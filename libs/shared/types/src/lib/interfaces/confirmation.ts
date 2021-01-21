export interface IConfirmButton {
  label: string;
  callback(): void;
  status: string;
}

export interface IConfirmOptions {
  message: string;
  buttons: IConfirmButton[];
}
