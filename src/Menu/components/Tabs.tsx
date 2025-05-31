import React, { FC } from 'react'

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface ITabsProps {
  tabs: { label: string; value: string }[]
  activeTab: any
  onPress: (value: any) => void
}

export const Tabs: FC<ITabsProps> = props => {
  return (
    <View style={styles.tabs}>
      {props.tabs.map(item => (
        <TouchableOpacity
          key={item.value}
          style={[
            styles.tab,
            props.activeTab === item.value ? styles.tabActive : undefined,
          ]}
          onPress={() => props.onPress(item.value)}>
          <Text
            style={[
              styles.tabText,
              props.activeTab === item.value ? styles.tabTextActive : undefined,
            ]}>
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 20,
    gap: 15,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#20242B',
    borderRadius: 5,
  },
  tabActive: {
    backgroundColor: '#2261F6',
  },
  tabText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#fff',
  },
  tabTextActive: {
    fontWeight: 'bold',
  },
})
