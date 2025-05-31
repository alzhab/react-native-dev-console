import React, { Fragment } from 'react'
import { Image, StyleSheet, TouchableOpacity } from 'react-native'

const icons: any = {
  close: require('./images/close.png'),
  filter: require('./images/filter.png'),
  more: require('./images/more.png'),
  search: require('./images/search.png'),
  share: require('./images/share.png'),
}

type ButtonProps =
  | {
      onPress?: never
      accessibilityLabel?: string
    }
  | ({
      onPress: () => void
      accessibilityLabel: string
    } & TouchableOpacity['props'])

const Icon = ({
  name,
  onPress,
  accessibilityLabel,
  iconStyle,
  ...rest
}: {
  name: keyof typeof icons
  iconStyle?: Image['props']['style']
} & ButtonProps) => {
  const Wrapper = onPress ? TouchableOpacity : Fragment

  return (
    <Wrapper
      {...(onPress && {
        onPress,
        accessibilityLabel,
        accessibilityRole: 'button',
        style: styles.iconWrapper,
        ...rest,
      })}>
      {!!icons[name] && (
        <Image
          source={icons[name]}
          resizeMode="contain"
          style={[styles.icon, onPress && styles.iconButton, iconStyle]}
        />
      )}
    </Wrapper>
  )
}

const styles = StyleSheet.create({
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
    alignSelf: 'center',
    tintColor: '#969696',
  },
  iconButton: {
    tintColor: '#fff',
  },
  iconWrapper: {
    alignSelf: 'center',
  },
})

export default Icon
