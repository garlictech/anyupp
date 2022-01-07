export interface ConfirmButton {
  label: string;
  callback?(params?: unknown): void;
  status: string;
}

export interface ConfirmOptions {
  message: string;
  buttons: ConfirmButton[];
}
