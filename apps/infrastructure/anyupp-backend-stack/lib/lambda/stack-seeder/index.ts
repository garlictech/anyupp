import { CloudFormationCustomResourceEvent } from 'aws-lambda';
import { AWSError, CognitoIdentityServiceProvider } from 'aws-sdk';
import axios from 'axios';
import { pipe } from 'fp-ts/lib/function';
import * as fp from 'lodash/fp';
import { from, of, throwError } from 'rxjs';
import { catchError, filter, map, mapTo, switchMap } from 'rxjs/operators';

import API, { graphqlOperation } from '@aws-amplify/api-graphql';
import Amplify from '@aws-amplify/core';
import { awsConfig, createAdminUser, CreateAdminUserInput } from '@bgap/admin/amplify-api';

import {
  createTestChain, createTestChainProduct, createTestGroup, createTestGroupProduct, createTestProductCategory,
  createTestUnit, createTestUnitProduct
} from './mock-fn';

Amplify.configure(awsConfig);
/**
 * See the AWS documentation for more information on what needs to be contained in the
 * response of a custom resource.
 *
 * https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/crpg-ref-responses.html
 */
const sendResponse = async (props: any) => {
  const body = {
    Status: props.status,
    Reason: props.reason,
    StackId: props.stackId,
    RequestId: props.requestId,
    LogicalResourceId: props.logicalResourceId,
  };

  const responseBody = JSON.stringify(body);
  console.log({ responseBody });

  await axios.put(props.responseUrl, responseBody, {
    data: responseBody,
    headers: { 'content-type': '', 'content-length': responseBody.length },
  });
};

const username = 'test@test.com';
const password = 'Testtesttest12_';

const cognitoidentityserviceprovider = new CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18',
  region: 'eu-west-1',
});

export const seedAdminUser = (UserPoolId: string) =>
  pipe(
    {
      UserPoolId,
      Username: username,
    },
    params => cognitoidentityserviceprovider.adminCreateUser(params).promise(),
    from,
    switchMap(() =>
      from(
        cognitoidentityserviceprovider
          .adminSetUserPassword({
            UserPoolId,
            Username: username,
            Password: password,
            Permanent: true,
          })
          .promise(),
      ),
    ),
    switchMap(() =>
      from(
        cognitoidentityserviceprovider
          .adminGetUser({
            UserPoolId,
            Username: username,
          })
          .promise(),
      ),
    ),
    map((user: CognitoIdentityServiceProvider.Types.AdminGetUserResponse) =>
      pipe(
        user.UserAttributes,
        fp.find(attr => attr.Name === 'sub'),
        attr => attr?.Value,
      ),
    ),
    filter(fp.negate(fp.isEmpty)),
    map((adminUserId: string) => ({
      id: adminUserId,
      email: username,
      name: 'Test Elek',
      roles: {
        role: 'superuser',
      },
    })),
    switchMap((input: CreateAdminUserInput) =>
      pipe(
        API.graphql(graphqlOperation(createAdminUser, { input })),
        operation =>
          operation instanceof Promise
            ? from(operation)
            : throwError('Wrong graphql operation'),
      ),
    ),
  )
    .pipe(
      switchMap(createTestChain(1)),
      switchMap(createTestGroup(1, 1)),
      switchMap(createTestGroup(2, 1)),
      switchMap(createTestUnit(1, 1, 1)),
      switchMap(createTestUnit(1, 1, 2)),
      switchMap(createTestUnit(1, 2, 1)),
      switchMap(createTestProductCategory(1, 1)),
      switchMap(createTestProductCategory(1, 2)),
      switchMap(createTestChainProduct(1, 1, 1)),
      switchMap(createTestChainProduct(1, 1, 2)),
      switchMap(createTestChainProduct(1, 2, 1)),
      switchMap(createTestGroupProduct(1, 1, 1, 1)),
      switchMap(createTestGroupProduct(1, 1, 2, 2)),
      switchMap(createTestUnitProduct(1, 1, 1, 1, 1)),
      switchMap(createTestUnitProduct(1, 1, 1, 2, 1)),
    )
    .pipe(
      mapTo('SUCCESS'),
      catchError((error: AWSError) => {
        console.log("Probably 'normal' error: ", error);
        return error.code === 'UsernameExistsException'
          ? of('SUCCESS')
          : throwError(error);
      }),
    );

export const handler = async (event: CloudFormationCustomResourceEvent) => {
  console.log(JSON.stringify(event, null, 2));

  /**
   * See the AWS documentation for more information passed in the request for a custom resource.
   *
   * https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/crpg-ref-requests.html
   */
  const adminUserPoolId = event.ResourceProperties.adminUserPoolId;

  if (event.RequestType === 'Create' || event.RequestType === 'Update') {
    await seedAdminUser(adminUserPoolId)
      .pipe(
        switchMap(status =>
          from(
            sendResponse({
              status,
              requestId: event.RequestId,
              stackId: event.StackId,
              reason: '',
              logicalResourceId: event.LogicalResourceId,
              responseUrl: event.ResponseURL,
            }),
          ),
        ),
      )
      .toPromise();
  }
};
