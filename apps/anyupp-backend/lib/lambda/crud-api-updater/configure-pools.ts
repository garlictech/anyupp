import { AppSync } from 'aws-sdk';
import { throwIfEmptyValue } from '@bgap/shared/utils';
import { defer, from, of, throwError } from 'rxjs';
import { catchError, map, switchMap, filter } from 'rxjs/operators';
import { UpdateGraphqlApiRequest, GraphqlApi } from 'aws-sdk/clients/appsync';
import { CrudApiConfig } from '@bgap/crud-gql/api';
import * as fp from 'lodash/fp';

const appsync = new AppSync({
  apiVersion: '2017-07-25',
});

const region = process.env.AWS_REGION || '';
const apiId = CrudApiConfig.appsyncApiId;

export const configureLogging = (logPublisherArn: string) =>
  defer(() => from(appsync.getGraphqlApi({ apiId }).promise())).pipe(
    map(response => {
      console.log('Response before setting logging: ' + response);
      return response.graphqlApi;
    }),
    throwIfEmptyValue(),
    map(graphqlApi => ({
      ...graphqlApi,
      apiId,
      name: graphqlApi.name || 'UNKNOWN_API_NAME',
      xrayEnabled: true,
      logConfig: {
        cloudWatchLogsRoleArn: logPublisherArn,
        fieldLogLevel: 'ERROR',
        excludeVerboseContent: false,
      },
    })),
    map(fp.omit(['arn', 'uris', 'tags'])),
    switchMap((graphqlApi: UpdateGraphqlApiRequest) =>
      from(appsync.updateGraphqlApi(graphqlApi).promise()),
    ),
    catchError(err => {
      console.log(err);
      console.warn('Setting logging options was not successful:  ', err);
      return of(true);
    }),
  );

export const configurePools = (userPoolId: string) =>
  defer(() => from(appsync.getGraphqlApi({ apiId }).promise())).pipe(
    map(response => {
      console.log('Response before setting auth provider: ' + response);
      return response.graphqlApi;
    }),
    throwIfEmptyValue(),
    filter(
      (graphqlApi: GraphqlApi) =>
        graphqlApi.additionalAuthenticationProviders?.filter(
          provider =>
            provider.authenticationType === 'AMAZON_COGNITO_USER_POOLS',
        ).length == 0,
    ),
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
    catchError(err => {
      console.log(err);
      return JSON.stringify(err, null, 2).includes(
        'Additional authentication provider',
      )
        ? of(true)
        : throwError(err);
    }),
  );
