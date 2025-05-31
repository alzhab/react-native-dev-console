import React, {FC, PropsWithChildren} from 'react';
import {IDevSettingsStore} from 'configs/DevConsole/types';
import {StyleProp, ViewStyle} from 'react-native';

export type TStore = Partial<IDevSettingsStore> & {
  devConsoleEnabled: boolean
}

export type ICustomTabProps = FC<{
  store: TStore
  setKey: (key: keyof TStore, val: any, isReload: boolean) => void
}>

export interface IDevConsoleRef {
  enable: () => void;
  log: (message: string, tag?: string) => void;
  error: (message: string, tag?: string) => void;
  info: (message: string, tag?: string) => void;
  warn: (message: string, tag?: string) => void;
}

export type IDevConsoleContainerProps = PropsWithChildren<{
  CustomTab?: ICustomTabProps
  button?: {
    style?: StyleProp<ViewStyle>
    content?: React.ReactNode
  }
}>
