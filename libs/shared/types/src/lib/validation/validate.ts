import * as Joi from 'joi';
import { map as fp_map } from 'lodash/fp';
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
): SchemaValidation<REQUIRED_TYPE> => {
  return {
    validate: (arg: unknown): Observable<REQUIRED_TYPE> =>
      from(Joi.object(schema).validateAsync(arg, validationOptions)).pipe(
        map(x => x as REQUIRED_TYPE),
        catchError((err: Joi.ValidationError) =>
          throwError(
            fp_map((x: Joi.ValidationErrorItem) => ({
              message: x.message,
              path: x.path,
              exception: x.type,
            }))(err.details),
          ),
        ),
      ),
    isType: (arg: unknown): arg is REQUIRED_TYPE => {
      return !Joi.object(schema).validate(arg).error;
    },
  };
};
