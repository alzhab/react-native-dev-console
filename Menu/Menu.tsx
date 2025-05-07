import React, {FC, useMemo, useState} from 'react';
import {View} from 'react-native';
import {Tabs} from './components/Tabs';
import {Modal} from './components/Modal';
import {Logger} from '../Logger';
import {NetworkLogger} from '../NetworkLogger';
import {IMenuProps} from './types';

export const Menu: FC<IMenuProps> = (props) => {
  const [activeTab, setActiveTab] = useState<'network' | 'logs' | 'custom'>(
    'network'
  );
  
  const tabs = useMemo(
    () =>
      [
        {label: 'Network', value: 'network'},
        {label: 'Logs', value: 'logs'},
        props.CustomTab ? {label: 'Custom', value: 'custom'} : undefined
      ].filter(item => !!item),
    [props.CustomTab]
  );
  
  return (
    <Modal
      close={props.close}
      disable={props.diable}
      isOpen={props.isOpen}>
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onPress={setActiveTab}
      />
      
      <View style={{flex: 1}}>
        {activeTab === 'network' && <NetworkLogger/>}
        {activeTab === 'logs' && (
          <Logger
            logs={props.adapter.variables.logs}
            setLogs={props.adapter.handlers.setLogs}
            logsPaused={props.adapter.variables.logsPaused}
            toggleLogsPaused={props.adapter.handlers.toggleLogsPaused}
          />
        )}
        {activeTab === 'custom' && !!props.CustomTab && (
          <props.CustomTab store={props.adapter.variables.store} setKey={props.adapter.handlers.setStoreKey}/>
        )}
      </View>
    </Modal>
  );
};
