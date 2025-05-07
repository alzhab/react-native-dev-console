import React, { FC, useCallback } from 'react'

import { FlatList, Text, View } from 'react-native'
import { Log } from './components/Log'
import { ILog, ILoggerProps } from './types'
import SearchBar from './components/SearchBar'
import { useLoggerAdapter } from './adapter'

export const Logger: FC<ILoggerProps> = props => {
  const { variables, handlers } = useLoggerAdapter(props)

  const renderItem = useCallback(
    ({ item }: { item: ILog }) => <Log log={item} />,
    [],
  )
  
  const keyExtractor = useCallback((item: ILog, index: number) => index.toString(), [])
  
  const getItemLayout = useCallback(
    (data: any, index: number) => ({
      length: 80,
      offset: 80 * index,
      index,
    }),
    []
  )

  return (
    <>
      {variables.logsPaused && (
        <View
          style={{
            backgroundColor: '#ff7c7c',
            padding: 10,
            alignItems: 'center',
          }}>
          <Text>Paused</Text>
        </View>
      )}

      <SearchBar
        value={variables.searchValue}
        onChangeText={handlers.setSearchValue}
        options={[
          {
            text: variables.logsPaused ? 'Resume' : 'Pause',
            onPress: handlers.toggleLogsPaused,
          },
          {
            text: 'Clear Logs',
            onPress: handlers.clearLogs,
          },
          {
            text: 'Export all logs',
            onPress: handlers.exportAllLogs,
          },
        ]}
        filterActive={variables.filterActive}
        types={variables.logTypes}
        activeType={variables.activeTypeFilter}
        setActiveType={handlers.changeActiveTypeFilter}
        clearFilter={handlers.resetAllFilters}
        tags={variables.tagsTypes}
        activeTags={variables.activeTagsFilter}
        setActiveTag={handlers.changeActiveTagFilter}
      />

      <FlatList
        showsVerticalScrollIndicator={false}
        data={variables.logsFilteredList}
        renderItem={renderItem}
        // virtualization tuning
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
        
        // if all items have same height:
        getItemLayout={getItemLayout}
        
        keyExtractor={keyExtractor}
        
        // optional extra props:
        updateCellsBatchingPeriod={50}
        onEndReachedThreshold={0.5}
      />
    </>
  )
}
