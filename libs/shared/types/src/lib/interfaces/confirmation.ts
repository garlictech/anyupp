export interface IConfirmButton {
  label: string;
  callback(params?: unknown): void;
  status: string;
}

export interface IConfirmOptions {
  message: string;
  buttons: IConfirmButton[];
}
