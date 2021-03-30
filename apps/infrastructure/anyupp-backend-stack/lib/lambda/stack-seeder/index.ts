import { CloudFormationCustomResourceEvent } from 'aws-lambda';
import { AWSError, CognitoIdentityServiceProvider } from 'aws-sdk';
import axios from 'axios';
import { pipe } from 'fp-ts/lib/function';
import * as fp from 'lodash/fp';
import { combineLatest, from, of, throwError } from 'rxjs';
import { catchError, filter, map, mapTo, switchMap } from 'rxjs/operators';

import API, { graphqlOperation } from '@aws-amplify/api-graphql';
import Amplify from '@aws-amplify/core';
import {
  awsConfig,
  createAdminUser,
  CreateAdminUserInput,
} from '@bgap/admin/amplify-api';

import {
  createTestChain,
  createTestChainProduct,
  createTestGroup,
  createTestGroupProduct,
  createTestProductCategory,
  createTestUnit,
  createTestUnitProduct,
} from './seed-data-fn';

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

const username = 'test@anyupp.com';
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
      UserAttributes: [
        {
          Name: 'email',
          Value: username,
        },
        {
          Name: 'phone_number',
          Value: '+123456789012',
        },
      ],
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
      name: 'John Doe',
      profileImage:
        'https://ocdn.eu/pulscms-transforms/1/-rxktkpTURBXy9jMzIxNGM4NWI2NmEzYTAzMjkwMTQ1NGMwZmQ1MDE3ZS5wbmeSlQMAAM0DFM0Bu5UCzQSwAMLD',
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
    mapTo('SUCCESS'),
    catchError((error: AWSError) => {
      console.log("Probably 'normal' error: ", error);
      return error.code === 'UsernameExistsException'
        ? of('SUCCESS')
        : throwError(error);
    }),
  );

export const seedBusinessData = () =>
  pipe(
    combineLatest([
      createTestChain(1),
      createTestGroup(1, 1),
      createTestGroup(2, 1),
      createTestUnit(1, 1, 1),
      createTestUnit(1, 1, 2),
      createTestUnit(1, 2, 1),
      createTestProductCategory(1, 1),
      createTestProductCategory(1, 2),
      createTestChainProduct(1, 1, 1),
      createTestChainProduct(1, 1, 2),
      createTestChainProduct(1, 2, 1),
      createTestGroupProduct(1, 1, 1, 1),
      createTestGroupProduct(1, 1, 2, 2),
      createTestUnitProduct(1, 1, 1, 1, 1),
      createTestUnitProduct(1, 1, 1, 2, 2),
    ]),
    mapTo('SUCCESS'),
    catchError((error: AWSError) => {
      console.log("Probably 'normal' error: ", error);
      return of('SUCCESS');
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
  const physicalResourceId = event.ResourceProperties.physicalResourceId;

  if (event.RequestType === 'Create' || event.RequestType === 'Update') {
    await combineLatest([seedAdminUser(adminUserPoolId), seedBusinessData()])
      .pipe(
        switchMap(() =>
          from(
            sendResponse({
              status: 'SUCCESS',
              requestId: event.RequestId,
              stackId: event.StackId,
              reason: '',
              physicalResourceId,
              logicalResourceId: event.LogicalResourceId,
              responseUrl: event.ResponseURL,
            }),
          ),
        ),
      )
      .toPromise();
  }
};
