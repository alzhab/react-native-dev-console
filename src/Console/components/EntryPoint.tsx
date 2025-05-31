import {PropsWithChildren, useEffect, useState} from 'react';
import {InteractionManager} from 'react-native';

export const EntryPoint = (props: PropsWithChildren) => {
  const [rendered, setRendered] = useState(false);
  
  useEffect(() => {
    initDevConsole();
    setRendered(true);
    
    InteractionManager.runAfterInteractions(() => {
      // initDevConsole();
    });
  }, []);
  
  return rendered ? props.children : null;
};
