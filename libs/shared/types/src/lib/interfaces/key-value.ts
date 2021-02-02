export interface IKeyValue {
  key: string;
  value: string | number | any;
}

export interface IKeyValueObject {
  [key: string]: string | number | any;
}

export interface IDataObject<T> {
  [key: string]: T;
}
