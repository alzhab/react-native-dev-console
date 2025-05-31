import React, {FC, ReactNode, useCallback, useEffect} from 'react';
import {IDevConsoleContainerProps} from '../Console';

interface IAdapterRes {
  handlers: any;
  variables: any;
}

export function compWithMethods<
  AdapterRes extends IAdapterRes,
  ComponentRef,
  UIProps extends IDevConsoleContainerProps,
>(data: {
  adapter: (data: IDevConsoleContainerProps) => AdapterRes
  UI: (props: UIProps & { adapter: AdapterRes }) => ReactNode
}): FC<UIProps> & ComponentRef {
  let refs: { current: ComponentRef }[] = [];
  
  /**
   * Adds a ref to the end of the array, which will be used to show the toasts until its ref becomes null.
   *
   * @param newRef the new ref, which must be stable for the life of the Toast instance.
   */
  function addNewRef(newRef: ComponentRef) {
    refs.push({
      current: newRef
    });
  }
  
  /**
   * Removes the passed in ref from the file-level refs array using a strict equality check.
   *
   * @param oldRef the exact ref object to remove from the refs array.
   */
  function removeOldRef(oldRef: ComponentRef | null) {
    refs = refs.filter(r => r.current !== oldRef);
  }
  
  const Root = React.forwardRef((props: UIProps, ref) => {
    const adapter = data.adapter(props);
    
    React.useImperativeHandle(
      ref,
      useCallback(() => adapter.handlers, [adapter.handlers])
    );
    
    useEffect(() => {
      Object.keys(adapter.handlers).forEach(method => {
        Component[method] = (...params: any) => {
          const ref = getRef();
          
          if (ref) {
            return ref[method](...params);
          }
        };
      });
    }, []);
    
    return <data.UI adapter={adapter} {...props}/>;
  });
  
  const Component = (props: UIProps) => {
    const compRef = React.useRef<ComponentRef | null>(null);
    
    const setRef = React.useCallback((ref: ComponentRef | null) => {
      // Since we know there's a ref, we'll update `refs` to use it.
      if (ref) {
        // store the ref in this toast instance to be able to remove it from the array later when the ref becomes null.
        compRef.current = ref;
        addNewRef(ref);
      } else {
        // remove the this toast's ref, wherever it is in the array.
        removeOldRef(compRef.current);
      }
    }, []);
    
    return <Root {...props} ref={setRef}/>;
  };
  
  function getRef() {
    const reversePriority = [...refs].reverse();
    const activeRef = reversePriority.find(ref => ref?.current !== null);
    if (!activeRef) {
      return null;
    }
    return activeRef.current;
  }
  
  return Component as FC<UIProps> & ComponentRef;
}
