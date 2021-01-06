export interface IConfirmButton {
  label: string;
  callback: any;
  status: string;
}

export interface IConfirmOptions {
  message: string;
  buttons: IConfirmButton[];
}
