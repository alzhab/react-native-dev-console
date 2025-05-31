import React, {FC, PropsWithChildren, useEffect} from 'react';
import {Alert, BackHandler, StatusBar, StyleSheet, Text, TouchableOpacity} from 'react-native';
import Animated, {SlideInDown, SlideOutDown} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export interface IModalProps {
  close: () => void;
  disable: () => void;
  isOpen: boolean;
}

export const Modal: FC<PropsWithChildren<IModalProps>> = props => {
  const insets = useSafeAreaInsets();
  
  useEffect(() => {
    if (props.isOpen) {
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        function () {
          props.close();
          return true;
        }
      );
      
      return () => {
        subscription?.remove();
      };
    }
  }, [props.isOpen]);
  
  return props.isOpen ? (
    <>
      <StatusBar barStyle={'light-content'} animated/>
      <Animated.View
        entering={SlideInDown.duration(300)}
        exiting={SlideOutDown.duration(300)}
        style={[
          styles.menu,
          {paddingTop: insets.top, paddingBottom: insets.bottom}
        ]}>
        {props.children}
        
        <TouchableOpacity
          style={{alignSelf: 'center', paddingVertical: 15}}
          onPress={() =>
            Alert.alert(
              'Turn off developer menu',
              '',
              [
                {
                  text: 'Confirm',
                  onPress: props.disable,
                  style: 'destructive'
                },
                {
                  text: 'Cancel',
                  onPress: () => {
                  },
                  style: 'destructive'
                }
              ],
              {cancelable: true}
            )
          }>
          <Text style={{color: '#FF4D4F'}}>Turn Off</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.closeButton} onPress={props.close}>
          <Text>Close</Text>
        </TouchableOpacity>
      </Animated.View>
    </>
  ) : null;
};

const styles = StyleSheet.create({
  menu: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    backgroundColor: '#12161E'
  },
  closeButton: {
    width: '100%',
    paddingVertical: 15,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: '#cecece'
  }
});
