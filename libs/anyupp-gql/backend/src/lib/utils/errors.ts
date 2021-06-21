export enum ResolverErrorCode {
  UserAlreadyExists = 'UserAlreadyExists',
  DatabaseError = 'DatabaseError',
  UnknownError = 'UnknownError',
}

export interface ResolverError {
  code: ResolverErrorCode;
  message?: string;
}
