import {useCallback, useRef, useState} from 'react';
import {TStore} from './types';
import {ILog} from '../Logger';
import {ConsoleService} from '../../../../../src/configs/DevConsole/init';

const isDevelop = process.env.NODE_ENV === 'development';

async function reloadApp() {
  try {
    // Пробуем Expo метод
    const expo = await import('expo');
    await expo.reloadAppAsync();
  } catch {
    // Если Expo недоступен, используем react-native-restart
    const RNRestart = require('react-native-restart').default;
    RNRestart.restart();
  }
}

export const useDevConsoleAdapter = () => {
  const onSetStoreRef = useRef<null | ((store: TStore) => void)>(null);
  const [store, setStore] = useState<TStore>(ConsoleService.store || {devConsoleEnabled: isDevelop});
  
  const setStoreKey = useCallback(
    (key: keyof TStore, val: any, isReload: boolean) => {
      const newStore: TStore = {
        ...(store || {devConsoleEnabled: isDevelop}),
        [key]: val
      };
      setStore(newStore);
      ConsoleService.onSetStore(newStore);
      
      if (isReload) {
        RNRestart.restart();
      }
    },
    [store]
  );
  
  const enable = useCallback(() => {
    setStoreKey('devConsoleEnabled', true, false);
  }, [setStoreKey]);
  
  // Logger
  const [logs, setLogs] = useState<ILog[]>([]);
  const arrRef = useRef<ILog[]>([]);
  
  const [logsPaused, setLogsPaused] = useState(false);
  const logsPausedRef = useRef(false);
  
  const toggleLogsPaused = useCallback(async () => {
    logsPausedRef.current = !logsPaused;
    setLogsPaused(!logsPaused);
  }, [logsPaused]);
  
  const createLog = useCallback(
    (message: string, type: ILog['type'], tag?: string) => {
      switch (type) {
        case 'debug':
          console.log(message);
          break;
        case 'error':
          console.error(message);
          break;
        case 'info':
          console.info(message);
          break;
        case 'warn':
          console.warn(message);
          break;
      }
      
      if (logsPausedRef.current) {
        return;
      }
      
      const newLog: ILog = {
        message,
        type,
        date: new Date().toLocaleTimeString(),
        tag
      };
      
      const newArr = [newLog, ...arrRef.current];
      
      arrRef.current = newArr;
      
      setLogs(newArr);
    },
    [logsPaused, logs]
  );
  
  const log = useCallback((message: string, tag?: string) => {
    createLog(message, 'debug', tag);
  }, []);
  
  const error = useCallback((message: string, tag?: string) => {
    createLog(message, 'error', tag);
  }, []);
  
  const info = useCallback((message: string, tag?: string) => {
    createLog(message, 'info', tag);
  }, []);
  
  const warn = useCallback((message: string, tag?: string) => {
    createLog(message, 'warn', tag);
  }, []);
  
  const changeLogs = useCallback((val: ILog[]) => {
    arrRef.current = [];
    setLogs([]);
  }, []);
  
  return {
    variables: {
      store,
      logs,
      setLogs,
      logsPaused
    },
    handlers: {
      enable,
      setStoreKey,
      log,
      error,
      info,
      warn,
      toggleLogsPaused,
      setLogs: changeLogs
    }
  };
};
