import * as fp from 'lodash/fp';
import { PreSignUpTriggerEvent, PreSignUpTriggerHandler } from 'aws-lambda';
import { flow, pipe } from 'fp-ts/lib/function';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { combineLatest, defer, from, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { throwIfEmptyValue } from '@bgap/shared/utils';

export interface Deps {
  cognitoidentityserviceprovider: CognitoIdentityServiceProvider;
}

export const handlerFn = (event: PreSignUpTriggerEvent) => (deps: Deps) => {
  console.debug('EVENT:', event);

  if (
    !(
      event.request.userAttributes.email ||
      event.request.userAttributes.phone_number
    )
  ) {
    throw new Error(
      'Bad request, either email or phone number must be provided',
    );
  }

  return pipe(
    [
      {
        AttributesToGet: ['email'],
        Filter: `email = "${event.request.userAttributes.email}"`,
      },
      {
        AttributesToGet: ['phone_number'],
        Filter: `phone_number = "${event.request.userAttributes.phone_number}"`,
      },
    ],
    params =>
      params.map(param => ({
        ...param,
        Limit: 2,
        UserPoolId: event.userPoolId,
      })),
    params =>
      params.map(param =>
        defer(() =>
          from(deps.cognitoidentityserviceprovider.listUsers(param).promise()),
        ).pipe(throwIfEmptyValue('BadDataFromCognito')),
      ),
    x => combineLatest(x),
    tap(x => console.debug('***1', x)),
    map(flow(result => result.map(res => res?.Users || []), fp.flatten)),
    tap(x => console.debug('***2', x)),
    switchMap(result =>
      result?.length ? throwError('UserAlreadyExists') : of(event),
    ),
    tap(x => console.debug('***2', x)),
    catchError(err => {
      console.error('ERROR:', JSON.stringify(err, null, 2));
      return throwError(err);
    }),
    tap(x => console.debug('***4', x)),
  ).toPromise();
};

const cognitoidentityserviceprovider = new CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18',
  region: process.env.AWS_REGION,
});

export const handler: PreSignUpTriggerHandler = async (
  event,
  _context,
  _callback,
) =>
  await handlerFn(event)({
    cognitoidentityserviceprovider,
  });
