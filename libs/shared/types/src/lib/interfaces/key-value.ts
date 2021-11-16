export interface KeyValue {
  key: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: string | number | any;
}

export interface KeyValueObject {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: string | number | any;
}

export interface DataObject<T> {
  [key: string]: T;
}
