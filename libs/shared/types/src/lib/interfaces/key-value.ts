export interface IKeyValue {
  key: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: string | number | any;
}

export interface IKeyValueObject {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: string | number | any;
}

export interface IDataObject<T> {
  [key: string]: T;
}
