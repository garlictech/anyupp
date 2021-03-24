import * as Joi from 'joi';
import * as fp from 'lodash/fp';
import { from, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export const validationOptions: Joi.ValidationOptions = {
  abortEarly: false,
};
export interface SchemaValidation<T> {
  validate: (arg: unknown) => Observable<T>;
  isType: (arg: unknown) => boolean;
}
export const validateSchema = <REQUIRED_TYPE>(
  schema: Joi.SchemaMap,
  schemaName: string,
): SchemaValidation<REQUIRED_TYPE> => {
  return {
    validate: (arg: unknown): Observable<REQUIRED_TYPE> =>
      from(Joi.object(schema).validateAsync(arg, validationOptions)).pipe(
        map(x => x as REQUIRED_TYPE),
        catchError((err: Joi.ValidationError) => {
          console.log('### ~ file: validate.ts ~ line 24 ~ err', err);

          return throwError(
            // fp.map((x: Joi.ValidationErrorItem) => ({
            //   message: x.message,
            //   path: x.path,
            //   exception: x.type,
            // }))(err.details),
            `${schemaName} Object Validation Error: ` +
              fp.flow(
                fp.map((x: Joi.ValidationErrorItem) => x.message),
                fp.join(', '),
              )(err.details),
          );
        }),
      ),
    isType: (arg: unknown): arg is REQUIRED_TYPE => {
      return !Joi.object(schema).validate(arg).error;
    },
  };
};
