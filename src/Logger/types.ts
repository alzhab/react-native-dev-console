export interface ILoggerProps {
  logsPaused: boolean
  toggleLogsPaused: () => Promise<void>
  logs: ILog[]
  setLogs: (val: ILog[]) => void
}

export interface ILog {
  type: 'debug' | 'info' | 'warn' | 'error'
  message: string
  date: string
  tag?: string
}
