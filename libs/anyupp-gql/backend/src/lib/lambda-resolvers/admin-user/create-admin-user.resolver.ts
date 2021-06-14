import { flow, pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';
import * as AnyuppApi from '@bgap/anyupp-gql/api';
import { AdminUserResolverDeps } from './utils';
import { from, of, throwError } from 'rxjs';
import { catchError, map, mapTo, switchMap, switchMapTo } from 'rxjs/operators';
import { ResolverErrorCode } from '../../utils/errors';

export const createAdminUser =
  (vars: AnyuppApi.CreateAdminUserMutationVariables) =>
  (deps: AdminUserResolverDeps) => {
    console.debug('Resolver parameters: ', vars);
    const newUsername = deps.userNameGenerator();

    return pipe(
      {
        Limit: 2,
        AttributesToGet: ['email', 'phone_number'],
        Filter: `email = "${vars.input.email}"`,
        UserPoolId: deps.userPoolId,
      },
      params =>
        from(deps.cognitoidentityserviceprovider.listUsers(params).promise()),
      map(
        flow(
          result => result?.Users,
          E.fromPredicate(
            users => users?.length === undefined || users.length < 2,
            () => ({
              code: ResolverErrorCode.DatabaseError,
              message:
                'Something bad happened, more users found with the provided data',
            }),
          ),
          E.chain(
            E.fromPredicate(
              users => users?.length === undefined || users.length === 0,
              () => ({
                code: ResolverErrorCode.UserAlreadyExists,
                message: 'User already exists',
              }),
            ),
          ),
          E.map(() => ({
            Username: newUsername,
            UserAttributes: [
              {
                Name: 'email',
                Value: vars.input.email,
              },
              {
                Name: 'phone_number',
                Value: vars.input.phone,
              },
            ],
            UserPoolId: deps.userPoolId,
          })),
        ),
      ),
      switchMap(res => (E.isLeft(res) ? throwError(res.left) : of(res.right))),
      switchMap(params =>
        from(
          deps.cognitoidentityserviceprovider.adminCreateUser(params).promise(),
        ),
      ),
      switchMap(() =>
        deps.crudSdk
          .CreateAdminUser({
            input: {
              name: vars.input.name,
              id: newUsername,
              email: vars.input.email,
              phone: vars.input.phone,
            },
          })
          .pipe(
            catchError(err =>
              from(
                deps.cognitoidentityserviceprovider
                  .adminDeleteUser({
                    UserPoolId: deps.userPoolId,
                    Username: newUsername,
                  })
                  .promise(),
              ).pipe(
                switchMapTo(
                  throwError({
                    code: ResolverErrorCode.UnknownError,
                    message: JSON.stringify(err, null, 2),
                  }),
                ),
              ),
            ),
          ),
      ),
      mapTo(newUsername),
    ).toPromise();
  };
