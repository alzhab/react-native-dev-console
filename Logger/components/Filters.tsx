import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import NLModal from './Modal';
import Button from './Button';
import {ILog} from '../types';

const FilterButton = ({
                        onPress,
                        active,
                        children
                      }: {
  onPress: () => void
  active?: boolean
  children: string
}) => {
  return (
    <Button
      style={[styles.methodButton, active && styles.buttonActive]}
      textStyle={[styles.buttonText, active && styles.buttonActiveText]}
      onPress={onPress}
      accessibilityRole="checkbox"
      accessibilityState={{checked: active}}>
      {children}
    </Button>
  );
};

const Filters = ({
                   open,
                   onClose,
                   types,
                   activeType,
                   setActiveType,
                   clearFilter,
                   tags,
                   activeTags,
                   setActiveTag
                 }: {
  open: boolean
  onClose: () => void
  types: string[]
  activeType: string | null
  setActiveType: (val: any) => void
  clearFilter: () => void
  tags: string[]
  activeTags: ILog['tag'][]
  setActiveTag: (val: any) => void
}) => {
  return (
    <View>
      <NLModal visible={open} onClose={onClose} title="Filters">
        <Text style={styles.subTitle} accessibilityRole="header">
          Type
        </Text>
        <View style={styles.methods}>
          {types.map(method => (
            <FilterButton
              key={method}
              active={activeType === method}
              onPress={() => setActiveType(method)}>
              {method.toUpperCase()}
            </FilterButton>
          ))}
        </View>
        
        <Text style={styles.subTitle} accessibilityRole="header">
          Tags
        </Text>
        
        <View style={styles.methods}>
          {tags.map((tag, index) => (
            <FilterButton
              key={tag + index}
              active={activeTags.includes(tag)}
              onPress={() => setActiveTag(tag)}>
              {tag.toUpperCase()}
            </FilterButton>
          ))}
        </View>
        
        <View style={styles.divider}/>
        <Button
          textStyle={styles.clearButton}
          onPress={() => {
            clearFilter();
            onClose();
          }}>
          Reset All Filters
        </Button>
      </NLModal>
    </View>
  );
};

const styles = StyleSheet.create({
  subTitle: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8
  },
  filterValue: {
    fontWeight: 'bold'
  },
  methods: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10
  },
  tags: {
    marginBottom: 10,
    width: '100%'
  },
  methodButton: {
    margin: 2,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#2c7489'
  },
  statusInput: {
    color: '#fff',
    marginLeft: 10,
    borderColor: '#2c7489',
    padding: 5,
    borderBottomWidth: 1,
    minWidth: 100
  },
  buttonText: {
    fontSize: 12
  },
  buttonActive: {
    backgroundColor: '#2c7489'
  },
  buttonActiveText: {
    color: '#fff'
  },
  clearButton: {
    color: '#FF4D4F'
  },
  divider: {
    height: 1,
    backgroundColor: '#969696',
    marginTop: 20
  }
});

export default Filters;
