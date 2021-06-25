import { CloudFormationCustomResourceEvent } from 'aws-lambda';
import { AppSync } from 'aws-sdk';
import { throwIfEmptyValue } from '@bgap/shared/utils';
import { defer, from, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { sendResponse } from '../utils/send-response';
import { UpdateGraphqlApiRequest } from 'aws-sdk/clients/appsync';
import { CrudApiConfig } from '@bgap/crud-gql/api';
import * as fp from 'lodash/fp';

const appsync = new AppSync({
  apiVersion: '2017-07-25',
});

const region = process.env.AWS_REGION || '';

export const handler = async (event: CloudFormationCustomResourceEvent) => {
  console.log('### EVENT:', JSON.stringify(event, null, 2));

  /**
   * See the AWS documentation for more information passed in the request for a custom resource.
   *
   * https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/crpg-ref-requests.html
   */
  const physicalResourceId = event.ResourceProperties.physicalResourceId;
  const userPoolId = event.ResourceProperties.userPoolId;
  const apiId = CrudApiConfig.appsyncApiId;

  if (event.RequestType === 'Create' || event.RequestType === 'Update') {
    return defer(() => from(appsync.getGraphqlApi({ apiId }).promise()))
      .pipe(
        map(response => response.graphqlApi),
        throwIfEmptyValue(),
        map(graphqlApi => ({
          ...graphqlApi,
          apiId,
          name: graphqlApi.name || 'UNKNOWN_API_NAME',
          additionalAuthenticationProviders: [
            ...(graphqlApi.additionalAuthenticationProviders || []),
            {
              authenticationType: 'AMAZON_COGNITO_USER_POOLS',
              userPoolConfig: {
                awsRegion: region,
                userPoolId,
              },
            },
          ],
        })),
        map(fp.omit(['arn', 'uris', 'tags'])),
        switchMap((graphqlApi: UpdateGraphqlApiRequest) =>
          from(appsync.updateGraphqlApi(graphqlApi).promise()),
        ),
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
        catchError(err =>
          JSON.stringify(err, null, 2).includes(
            'Additional authentication provider',
          )
            ? of(true)
            : throwError(err),
        ),
      )
      .toPromise();
  }

  return true;
};
