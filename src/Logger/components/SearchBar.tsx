import React, {useState} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import Options from './Options';
import Filters from './Filters';
import Icon from './Icon';
import {ILog} from '../types';

interface Props {
  value: string;
  
  onChangeText(text: string): void;
  
  options: { text: string; onPress: () => Promise<void> }[];
  filterActive: boolean;
  types: string[];
  activeType: string | null;
  setActiveType: (val: any) => void;
  tags: string[];
  activeTags: ILog['tag'][];
  setActiveTag: (val: any) => void;
  clearFilter: () => void;
}

const SearchBar: React.FC<Props> = ({
                                      options,
                                      value,
                                      onChangeText,
                                      filterActive,
                                      types,
                                      activeType,
                                      setActiveType,
                                      clearFilter,
                                      tags,
                                      activeTags,
                                      setActiveTag
                                    }) => {
  const [showFilters, setShowFilters] = useState(false);
  
  return (
    <>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Icon name="search"/>
          <TextInput
            onChangeText={onChangeText}
            value={value}
            placeholder="Filter logs"
            underlineColorAndroid="transparent"
            style={styles.textInputSearch}
            placeholderTextColor={'#969696'}
          />
          <Icon
            name="filter"
            onPress={() => setShowFilters(!showFilters)}
            accessibilityLabel="Filter"
            iconStyle={[styles.filterIcon, filterActive && styles.filterActive]}
          />
        </View>
        <Options options={options}/>
      </View>
      <Filters
        open={showFilters}
        onClose={() => setShowFilters(false)}
        types={types}
        activeType={activeType}
        setActiveType={setActiveType}
        clearFilter={clearFilter}
        tags={tags}
        activeTags={activeTags}
        setActiveTag={setActiveTag}
      />
    </>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    margin: 5,
    borderWidth: 1,
    borderColor: '#969696',
    borderRadius: 10,
    flex: 1,
    paddingVertical: 5
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  filterIcon: {
    marginRight: 0
  },
  filterActive: {
    tintColor: '#2261F6'
  },
  textInputSearch: {
    height: 30,
    padding: 0,
    flexGrow: 1,
    color: '#fff'
  },
  searchContainer: {
    flexDirection: 'row'
  },
  menu: {alignSelf: 'center'},
  title: {
    fontSize: 20,
    paddingBottom: 10,
    fontWeight: 'bold',
    textAlign: 'center'
  }
});

export default SearchBar;
