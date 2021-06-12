import * as fp from 'lodash/fp';
import { PreSignUpTriggerHandler } from 'aws-lambda';
import { pipe } from 'fp-ts/lib/function';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { from } from 'rxjs';
import { map, tap } from 'rxjs/operators';

const cognitoidentityserviceprovider = new CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18',
  region: process.env.AWS_REGION,
});

export const handler: PreSignUpTriggerHandler = async (
  event,
  _context,
  _callback,
) => {
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
    event.request.userAttributes.email
      ? {
          AttributesToGet: ['email'],
          Filter: `email = \"${event.request.userAttributes.email}\"`,
        }
      : {
          AttributesToGet: ['phone_number'],
          Filter: `phone_number = \"${event.request.userAttributes.phone_number}\"`,
        },
    param => ({
      ...param,
      Limit: 2,
      UserPoolId: event.userPoolId,
    }),
    fp.tap(x => console.log(JSON.stringify(x, null, 2))),
    params => cognitoidentityserviceprovider.listUsers(params).promise(),
    from,
    tap(x => console.log(JSON.stringify(x, null, 2))),
    map(result => result.Users),
    tap(users => {
      if (users?.length === 2) {
        throw new Error(
          'Something bad happened, more users were found with the same email or phone number',
        );
      } else if (users?.length === 1) {
        throw {
          code: 'UserAlreadyExists',
        };
      }
    }),
    map(() => ({
      ...event,
      response: {
        autoConfirmUser: true,
        autoVerifyEmail: true,
        autoVerifyPhone: true,
      },
    })),
  ).toPromise();
};

from(
  handler(
    {
      userPoolId: 'eu-west-1_0Lg0Ug1Lt',
      request: {
        userAttributes: {
          email: 'test@anyupp.com',
        },
      },
    } as any,
    null as any,
    null as any,
  ) as any,
).subscribe(console.log, console.log);
