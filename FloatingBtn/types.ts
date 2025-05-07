import { StyleProp, ViewStyle } from 'react-native'
import React from 'react'

export interface IFloatingBtnProps {
  width: number
  disabled?: boolean
  button?: {
    style?: StyleProp<ViewStyle>
    content?: React.ReactNode
  }
  onPress: () => void
  visible: boolean
}
