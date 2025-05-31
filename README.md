# React Native Dev Console

A simple in-app developer console for React Native applications that allows viewing logs, network requests, and
developer tools in production environments.

## Example

<img src="./README/Preview.gif">

## Features

- Log Viewer - View log, warn, error, and info logs with optional tags for filtering.
- Network Inspector - Monitor HTTP traffic (powered by react-native-network-logger).
- Custom Tab - Extend functionality with custom developer toggles and environment configuration.
- Floating Button - Activate the console programmatically or through specific runtime conditions.
- Production-ready - Designed to work in release builds and safe for production use.

## Installation

### 1. Install the library

```
npm install react-native-dev-console
```

### 2. Install peer dependencies (if not already installed)

```
npm install react-native-reanimated react-native-gesture-handler react-native-safe-area-context 
```

For iOS:

```
npx pod-install 
```

## Quick Start

### 1. Wrap your application

```tsx 
<GestureHandlerRootView>
  <SafeAreaProvider>
    <Console>
      <App/>
    </Console>
  </SafeAreaProvider>
</GestureHandlerRootView>
```

## File Structure

Recommended structure for custom Dev Console logic:

```
src/configs/DevConsole 
├── CustomTab.tsx # Custom tab with toggles and versioning (optional) 
├── init.ts # Initialization logic for Dev Console 
└── types.ts # Dev Console store types
```

### init.ts

```ts
import {version} from '../../../package.json'
import {LocalStorageService, LSKeys} from 'services/LocalStorage'

const isDevelop = process.env.NODE_ENV === 'development'

const store = LocalStorageService.getString(LSKeys.LSDevConsoleStore) || `{"devConsoleEnabled": ${isDevelop}}`
const parsedStore = JSON.parse(store)

export const ConsoleService = {
  store: {
    ...parsedStore,
    isDevUrl: parsedStore?.isDevUrl ?? isDevelop,
    version: parsedStore?.version ?? version,
  },
  onSetStore: (newStore: any) => {
    console.log({newStore})
    LocalStorageService.set(LSKeys.LSDevConsoleStore, JSON.stringify(newStore))
  },
}
```

### types.ts

```ts
export interface IDevSettingsStore {
  isDevUrl: boolean
  version: string
} 
```

## CustomTab Component

```tsx
import {ICustomTabProps} from 'react-native-dev-console'
import {Button, StyleSheet, Switch, Text, TextInput, View} from 'react-native'
import React, {useState} from 'react'

export const CustomTab: ICustomTabProps = ({store, setKey}) => {
  const [version, setVersion] = useState(store.version)
  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <Text style={{color: '#fff'}}>Dev Url Api</Text>
        <Switch
          value={store.isDevUrl}
          onChange={() => setKey('isDevUrl', !store.isDevUrl, true)}
        />
      </View>
      <View style={styles.item}>
        <TextInput
          style={{color: '#fff', flex: 1}}
          placeholder={'Version'}
          value={version}
          placeholderTextColor={'#b4b4b4'}
          onChangeText={text => setVersion(text)}
          keyboardType={'numeric'}
        />
        <Button
          title={'Submit'}
          onPress={() => setKey('version', version, false)}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#727272',
    paddingBottom: 5,
  },
})
```

The CustomTab component receives the following props:

```ts
export interface ICustomTabProps {
  store: Record<string, any>
  setKey: (key: string, value: any, reload?: boolean) => void
} 
```

| Prop   | Type                                                | Description                                         |
|--------|-----------------------------------------------------|-----------------------------------------------------|
| store  | Record<string, any>                                 | Current state of the Dev Console store              |
| setKey | (key: string, value: any, reload?: boolean) => void | Updates the store. When persist is true, reload App |

## Console Component Props

| Prop           | Type                                                        | Description                                        | Required |
|----------------|-------------------------------------------------------------|----------------------------------------------------|----------|
| children       | React.ReactNode                                             | Your app root wrapped with the Dev Console         | Yes      |
| CustomTab      | ICustomTabProps                                             | Optional tab with custom settings and toggles      | No       |
| button         | { style?: StyleProp<ViewStyle>, content?: React.ReactNode } | Customizes the floating button                     | No       |
| button.style   | StyleProp<ViewStyle>                                        | Style override for the floating button             | No       |
| button.content | React.ReactNode                                             | Custom content (icon/text) for the floating button | No       |

## Dev Console Methods

The Console object exposes global functions for programmatic access:

ts Console.enable() Console.log(message: string, tag?: string) Console.error(message: string, tag?: string)
Console.info(message: string, tag?: string) Console.warn(message: string, tag?: string)

All logs appear in the Logs tab of the Dev Console.

| Method           | Description                                                 |
|------------------|-------------------------------------------------------------|
| Console.enable() | Opens the Dev Console manually                              |
| Console.log()    | Adds a standard log message with optional tag for filtering |
| Console.error()  | Adds an error message (highlighted in red)                  |
| Console.info()   | Adds an informational message (highlighted in blue)         |
| Console.warn()   | Adds a warning message (highlighted in yellow)              |

### Example Usage

```ts 
Console.enable()
Console.log('User logged in', 'Auth')
Console.error('Failed to fetch user data', 'API') 
```

## Example: Dynamic API URL Switching

Use the isDevUrl flag to switch between development and production API endpoints at runtime:

### src/configs/DevConsole/init.ts

```ts
import {version} from '../../../package.json';
import {LocalStorageService, LSKeys} from 'services/LocalStorage';

const isDevelop = process.env.NODE_ENV === 'development';
const stored = LocalStorageService.getString(LSKeys.LSDevConsoleStore);
const parsed = stored ? JSON.parse(stored) : {};

export const ConsoleService = {
  store: {
    isDevUrl: parsed.isDevUrl ?? isDevelop,
    version: parsed.version ?? version,
  },
  onSetStore: (newStore: any) => {
    LocalStorageService.set(LSKeys.LSDevConsoleStore, JSON.stringify(newStore));
  },
};
```

### services/Api.ts

```ts
import axios from 'axios';
import {ConsoleService} from 'src/configs/DevConsole/init';

const DEV_BASE_URL = 'https://dev.api.myapp.com/';
const PROD_BASE_URL = 'https://api.myapp.com/';

export const api = axios.create({
  baseURL: ConsoleService.store.isDevUrl ? DEV_BASE_URL : PROD_BASE_URL,
});

// Update the baseURL dynamically when the flag changes
ConsoleService.onSetStore = (store) => {
  api.defaults.baseURL = store.isDevUrl ? DEV_BASE_URL : PROD_BASE_URL;
};
```

## License

MIT License - free for personal and commercial use.
