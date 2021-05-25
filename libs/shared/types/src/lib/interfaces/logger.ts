export interface ILogger {
  warn: (_arg0: string) => void;
  error: (_arg0: string) => void;
  debug: (_arg0: string) => void;
}
