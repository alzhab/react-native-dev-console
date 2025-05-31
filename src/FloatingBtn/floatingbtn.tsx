import React, {PropsWithChildren, useMemo} from 'react';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {useAnimatedStyle, useDerivedValue, useSharedValue, withSpring, ZoomIn} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Dimensions, Pressable, StyleSheet, Text} from 'react-native';
import {IFloatingBtnProps} from './types';

const {width, height} = Dimensions.get('window');
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('screen');

const AnimPressable = Animated.createAnimatedComponent(Pressable);

export const DimensionsService = {
  WIDTH: width,
  HEIGHT: height,
  SCREEN_WIDTH,
  SCREEN_HEIGHT
};

interface AnimatedPosition {
  x: Animated.SharedValue<number>;
  y: Animated.SharedValue<number>;
}

const useFollowAnimatePosition = ({x, y}: AnimatedPosition) => {
  const followLeft = useDerivedValue(() => {
    return withSpring(x.value, {duration: 1000});
  });
  
  const followTop = useDerivedValue(() => {
    return withSpring(y.value, {duration: 1000});
  });
  
  const rStyle = useAnimatedStyle(() => ({
    top: followTop.value,
    left: followLeft.value
  }));
  
  return {followTop, followLeft, rStyle};
};

export const FloatingBtn = ({
                              width,
                              button,
                              onPress,
                              visible
                            }: PropsWithChildren<IFloatingBtnProps>) => {
  const actualWidth = useMemo(
    () => button?.style?.width || button?.style?.height || width,
    [button, width]
  );
  
  const edges = useSafeAreaInsets();
  const top = useSharedValue(
    actualWidth + edges.top + DimensionsService.HEIGHT / 2
  );
  const left = useSharedValue(actualWidth / 2);
  const context = useSharedValue({x: 0, y: 0});
  
  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = {x: top.value, y: left.value};
    })
    .onUpdate(event => {
      top.value = event.absoluteY;
      left.value = event.absoluteX;
    })
    .onEnd(event => {
      if (event.absoluteX > DimensionsService.SCREEN_WIDTH / 2) {
        left.value = DimensionsService.SCREEN_WIDTH - actualWidth / 2;
      } else {
        left.value = actualWidth / 2;
      }
      
      if (event.absoluteY > DimensionsService.SCREEN_HEIGHT - 150) {
        top.value = DimensionsService.HEIGHT - actualWidth - edges.bottom - 50;
      } else if (event.absoluteY < 150) {
        top.value = actualWidth / 2 + edges.top;
      }
    });
  
  const {rStyle: blueRStyle} = useFollowAnimatePosition({
    x: left,
    y: top
  });
  
  return visible ? (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[
          {
            transform: [
              {translateX: -(actualWidth || 2) / 2},
              {translateY: -(actualWidth || 2) / 2}
            ]
          },
          styles.btn,
          blueRStyle
        ]}>
        <AnimPressable
          entering={ZoomIn}
          style={[styles.openButton, button?.style]}
          onPress={onPress}>
          {button && button.content ? button.content : <Text>Menu</Text>}
        </AnimPressable>
      </Animated.View>
    </GestureDetector>
  ) : null;
};

const styles = StyleSheet.create({
  btn: {
    position: 'absolute',
    zIndex: 999
  },
  openButton: {
    width: 50,
    aspectRatio: 1,
    backgroundColor: '#fff',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: '#cecece'
  }
});
