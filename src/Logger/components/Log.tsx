import React, {FC, useCallback, useState} from 'react';
import {Share, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ILog} from '../types';
import Icon from './Icon';

const COLORS = {
  debug: '#fff',
  info: '#2261F6',
  error: '#FF4D4F',
  warn: '#FAAD14'
};

export const Log: FC<{ log: ILog }> = ({log}) => {
  const [hidden, setHidden] = useState(true);
  const color = COLORS[log.type] || COLORS.debug;
  
  const share = useCallback(() => {
    Share.share({
      message: log.message
    });
  }, [log.message]);
  
  return (
    <TouchableOpacity
      onLongPress={share}
      onPress={() => setHidden(!hidden)}
      activeOpacity={0.5}
      style={[styles.container, hidden ? {height: 80} : {minHeight: 80}]}>
      <View style={styles.minContainer}>
        <View style={styles.typeContainer}>
          <Text style={[styles.typeText, {color}]}>
            {log.type.toUpperCase()}
          </Text>
          
          {log.tag && (
            <Text style={styles.tagText} numberOfLines={1}>
              {log.tag}
            </Text>
          )}
          
          <Text style={styles.dateText}>{log.date}</Text>
        </View>
        
        {hidden && (
          <View style={styles.messageContainer}>
            <Text numberOfLines={2} style={[styles.messageText, {color}]}>
              {log.message}
            </Text>
          </View>
        )}
        
        <Icon
          iconStyle={{marginRight: 0}}
          style={styles.iconContainer}
          name={'share'}
          onPress={share}
        />
      </View>
      
      {!hidden && (
        <View style={[styles.messageContainer, {paddingVertical: 10}]}>
          <Text style={[styles.messageText, {color}]}>{log.message}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#20242B',
    borderRadius: 5,
    margin: 5,
    paddingHorizontal: 12
  },
  minContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
    paddingVertical: 10
  },
  typeContainer: {
    width: '15%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  typeText: {
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 5
  },
  tagText: {
    fontWeight: '600',
    fontSize: 11,
    lineHeight: 12,
    color: '#000',
    textAlign: 'center',
    marginBottom: 5,
    paddingHorizontal: 5,
    paddingVertical: 3,
    backgroundColor: '#777',
    borderRadius: 5
  },
  dateText: {
    color: '#777',
    fontSize: 14,
    textAlign: 'center'
  },
  messageContainer: {
    flex: 1,
    backgroundColor: '#20242B'
  },
  messageText: {
    fontSize: 16
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10
  }
});
