import React, {useState} from 'react';
import {startNetworkLogging} from 'react-native-network-logger';
import {IDevConsoleContainerProps, IDevConsoleRef} from './types';
import {compWithMethods} from '../compWithMethods';
import {useDevConsoleAdapter} from './adapter';
import {FloatingBtn} from '../FloatingBtn';
import {Menu} from '../Menu';

startNetworkLogging({ignoredHosts: ['localhost']});

export const Console = compWithMethods<
  ReturnType<typeof useDevConsoleAdapter>,
  IDevConsoleRef,
  IDevConsoleContainerProps
>({
  adapter: useDevConsoleAdapter,
  UI: ({adapter, children, CustomTab, button}) => {
    const [isDevConsoleOpen, setIsDevConsoleOpen] = useState(false);
    const {store} = adapter.variables;
    
    return (
      <>
        <Menu
          close={() => setIsDevConsoleOpen(false)}
          diable={() => {
            adapter.handlers.setStoreKey('devConsoleEnabled', false, false);
            setIsDevConsoleOpen(false);
          }}
          isOpen={isDevConsoleOpen}
          adapter={adapter}
          CustomTab={CustomTab}
        />
        
        {children}
        
        <FloatingBtn
          visible={store.devConsoleEnabled}
          width={50}
          button={button}
          onPress={() => setIsDevConsoleOpen(!isDevConsoleOpen)}
        />
      </>
    );
  }
});
