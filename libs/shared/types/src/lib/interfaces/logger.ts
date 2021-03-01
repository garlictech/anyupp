export interface ILogger {
  warn: (arg0: string) => void;
  error: (arg0: string) => void;
  debug: (arg0: string) => void;
}
