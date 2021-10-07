import * as CrudApi from '@bgap/crud-gql/api';
import { filterNullish } from '@bgap/shared/utils';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import * as E from 'fp-ts/lib/Either';
import { flow, pipe } from 'fp-ts/lib/function';
import { defer, from, of, throwError } from 'rxjs';
import {
  catchError,
  map,
  switchMap,
  switchMapTo,
  tap,
  throwIfEmpty,
} from 'rxjs/operators';
import { ResolverErrorCode } from '../../utils/errors';
import { AdminUserResolverDeps } from './utils';
import * as R from 'ramda';

export const createAdminUser =
  (vars: CrudApi.CreateAdminUserMutationVariables) =>
  (
    deps: AdminUserResolverDeps,
  ): ReturnType<CrudApi.CrudSdk['CreateAdminUser']> => {
    console.debug('createAdminUser Resolver parameters: ', vars);
    const newUsername = vars.input.id ?? deps.userNameGenerator();

    return pipe(
      {
        Limit: 2,
        AttributesToGet: ['email', 'phone_number'],
        Filter: `email = "${vars.input.email}"`,
        UserPoolId: deps.userPoolId,
      },
      params =>
        defer(() =>
          from(deps.cognitoidentityserviceprovider.listUsers(params).promise()),
        ),
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
          E.map(
            (): CognitoIdentityServiceProvider.Types.AdminCreateUserRequest => ({
              Username: newUsername,
              UserAttributes: [
                {
                  Name: 'email',
                  Value: vars.input.email,
                },
                {
                  Name: 'email_verified',
                  Value: 'true',
                },
                {
                  Name: 'phone_number',
                  Value: vars.input.phone,
                },
                {
                  Name: 'name',
                  Value: vars.input.name,
                },
              ],
              UserPoolId: deps.userPoolId,
              DesiredDeliveryMediums: ['EMAIL'],
            }),
          ),
        ),
      ),
      switchMap(res =>
        E.isLeft(res)
          ? throwError(JSON.stringify(res.left, null, 2))
          : of(res.right),
      ),
      switchMap(params =>
        from(
          deps.cognitoidentityserviceprovider.adminCreateUser(params).promise(),
        ),
      ),
      filterNullish(),
      switchMap(() =>
        from(
          deps.docClient
            .put({
              Item: {
                name: vars.input.name,
                id: newUsername,
                email: vars.input.email,
                phone: vars.input.phone,
              },
              TableName: deps.adminUserTableName,
            })
            .promise(),
        ),
      ),
      map(x => x?.Attributes as CrudApi.AdminUser),
      throwIfEmpty(),
    );
  };
