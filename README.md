# react-native-dev-console

A simple in-app developer console for React Native apps — view logs, network requests, and developer tools even in
production.

## ✨ Features

- 🐞 **Log Viewer** — `log`, `warn`, `error`, and `info` logs with optional tags.
- 🌐 **Network Inspector** — view HTTP traffic (powered by `react-native-network-logger`).
- 🧩 **Custom Tab** — inject your own developer toggles and environment config.
- 🕹 **Floating Button** — activate the console under specific runtime conditions.
- 📱 **Production-ready** — works in release builds; safe to include in production.

---

## 📸 Preview

![Dev Console in action](https://jumpshare.com/s/Pl9aOWgbjRlJcgIfvEhD)
---

## ⚙️ Installation

### 1. Install the library

```bash
npm install react-native-dev-console
# or
yarn add react-native-dev-console
```

### 2. Install peer dependencies (if not already)

```bash
npm install react-native-reanimated react-native-gesture-handler react-native-safe-area-context
```

For iOS:

```bash
npx pod-install
```

---

## 🚀 Quick Start

### 1. Wrap your app

```tsx
<GestureHandlerRootView>
  <SafeAreaProvider>
    <Console>
      <App/>
    </Console>
  </SafeAreaProvider>
</GestureHandlerRootView>
```

---

## 📁 File Structure

Keep your custom Dev Console logic in `src/configs/DevConsole`:

```
src/configs/DevConsole
├── CustomTab.tsx     # Custom tab with toggles and versioning (optional)
├── init.ts           # Initialization logic for Dev Console
└── types.ts          # Dev Console store types
```

### `init.ts`

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

### `types.ts`

```ts
export interface IDevSettingsStore {
  isDevUrl: boolean
  version: string
}
```

---

## 🧩 `Console` Props

| **Prop**         | **Type**                                                      | **Description**                                          | **Required** |
|------------------|---------------------------------------------------------------|----------------------------------------------------------|--------------|
| `children`       | `React.ReactNode`                                             | Your app root wrapped with the Dev Console.              | ✅            |
| `CustomTab`      | `ICustomTabProps`                                             | Optional tab with custom settings and toggles.           | ❌            |
| `button`         | `{ style?: StyleProp<ViewStyle>, content?: React.ReactNode }` | Customizes the floating button used to open the console. | ❌            |
| `button.style`   | `StyleProp<ViewStyle>`                                        | Style override for the floating button.                  | ❌            |
| `button.content` | `React.ReactNode`                                             | Custom content (icon/text) for the floating button.      | ❌            |

---

## 🛠 Dev Console Methods

The `Console` object exposes global functions for programmatic access:

```
Console.enable()
Console.log(message:string, tag?: string)
Console.error(message:string, tag?: string)
Console.info(message:string, tag?: string)
Console.warn(message:string, tag?: string)
```

All logs appear in the **Logs** tab of the Dev Console.

| Method             | Description                                                         |
|--------------------|---------------------------------------------------------------------|
| `Console.enable()` | Opens the Dev Console manually.                                     |
| `Console.log()`    | Adds a standard log message. Optional `tag` for filtering/grouping. |
| `Console.error()`  | Adds an error message (highlighted in red).                         |
| `Console.info()`   | Adds an informational message (blue).                               |
| `Console.warn()`   | Adds a warning message (yellow).                                    |

### Example

```ts
Console.enable()
Console.log('User logged in', 'Auth')
Console.error('Failed to fetch user data', 'API')
```

---

## ⚙️ `CustomTab` Props

If you pass a `CustomTab` to `Console`, it will receive the following props:

```ts
export interface ICustomTabProps {
  store: Record<string, any>
  setKey: (key: string, value: any, persist?: boolean) => void
}
```

| Prop     | Type                                                   | Description                                                          |
|----------|--------------------------------------------------------|----------------------------------------------------------------------|
| `store`  | `Record<string, any>`                                  | Current state of the Dev Console store.                              |
| `setKey` | `(key: string, value: any, persist?: boolean) => void` | Updates the store. If `persist` is true, it's saved in localStorage. |

---

## 📘 License

MIT — free for personal and commercial use.
