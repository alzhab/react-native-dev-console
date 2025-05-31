import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';

type Props = {
  children: string;
  fullWidth?: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
} & TouchableOpacity['props'];

const Button: React.FC<Props> = ({
  children,
  fullWidth,
  style,
  textStyle,
  onPress,
  ...rest
}) => {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      onPress={onPress}
      style={style}
      {...rest}
    >
      <Text style={[styles.button, fullWidth && styles.fullWidth, textStyle]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    button: {
      color: '#2261F6',
      fontSize: 18,
      padding: 10,
      alignSelf: 'flex-start',
    },
    fullWidth: {
      alignSelf: 'center',
    },
  });

export default Button;
