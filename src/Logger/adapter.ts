import {useCallback, useMemo, useState} from 'react';
import {ILog} from './types';
import {Share} from 'react-native';

export const useLoggerAdapter = ({
                                   logs,
                                   setLogs,
                                   logsPaused,
                                   toggleLogsPaused
                                 }: {
  logsPaused: boolean
  toggleLogsPaused: () => Promise<void>
  logs: ILog[]
  setLogs: (val: ILog[]) => void
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [activeTypeFilter, setActiveTypeFilter] = useState<ILog['type'] | null>(
    null
  );
  const [activeTagsFilter, setActiveTagsFilter] = useState<ILog['tag'][]>([]);
  
  const logTypes = useMemo(() => ['debug', 'info', 'warn', 'error'], []);
  const tagsTypes: string[] = useMemo(
    () => [...new Set(logs.map(item => item.tag || ''))].filter(item => !!item),
    [logs]
  );
  
  const filterActive = useMemo(() => {
    return !!activeTypeFilter || !!activeTagsFilter.length;
  }, [activeTypeFilter, activeTagsFilter]);
  
  const changeActiveTypeFilter = useCallback(
    (val: ILog['type'] | null) => {
      setActiveTypeFilter(val === activeTypeFilter ? null : val);
    },
    [activeTypeFilter]
  );
  
  const changeActiveTagFilter = useCallback((val: ILog['tag']) => {
    if (activeTagsFilter.includes(val)) {
      const newRes = activeTagsFilter.filter(item => item !== val);
      setActiveTagsFilter(newRes);
    } else {
      setActiveTagsFilter([val, ...activeTagsFilter]);
    }
  }, [activeTagsFilter]);
  
  const logsFilteredList = useMemo(() => {
    let result = logs;
    
    if (searchValue) {
      result = result.filter(item =>
        item.message.toLowerCase().includes(searchValue.toLowerCase())
      );
    }
    
    if (activeTypeFilter) {
      result = result.filter(item => item.type === activeTypeFilter);
    }
    
    if (activeTagsFilter.length) {
      result = result.filter(item => activeTagsFilter.includes(item.tag));
    }
    
    
    return result;
  }, [logs, searchValue, activeTypeFilter, activeTagsFilter]);
  
  const resetAllFilters = useCallback(() => {
    setActiveTypeFilter(null);
    setActiveTagsFilter([]);
  }, []);
  
  const clearLogs = useCallback(async () => {
    setLogs([]);
  }, []);
  
  const exportAllLogs = useCallback(async () => {
    await Share.share({
      message: JSON.stringify(logsFilteredList.reverse(), null, 2)
    });
  }, [logsFilteredList]);
  
  return {
    variables: {
      logsFilteredList,
      logsPaused,
      searchValue,
      filterActive,
      logTypes,
      activeTypeFilter,
      tagsTypes,
      activeTagsFilter
    },
    handlers: {
      toggleLogsPaused,
      clearLogs,
      exportAllLogs,
      setSearchValue,
      resetAllFilters,
      changeActiveTypeFilter,
      changeActiveTagFilter
    }
  };
};
