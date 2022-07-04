import { AppSync } from 'aws-sdk';
import { throwIfEmptyValue } from '@bgap/shared/utils';
import { defer, from, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { UpdateGraphqlApiRequest } from 'aws-sdk/clients/appsync';
import { CrudApiConfig } from '@bgap/crud-gql/api';
import * as fp from 'lodash/fp';

const appsync = new AppSync({
  apiVersion: '2017-07-25',
});

const region = process.env.AWS_REGION || '';
const apiId = CrudApiConfig.appsyncApiId;

export const configurePools = (userPoolId: string, logPublisherArn: string) =>
  defer(() => from(appsync.getGraphqlApi({ apiId }).promise())).pipe(
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
      logConfig: {
        fieldLogLevel: 'ALL',
        cloudWatchLogsRoleArn: logPublisherArn,
      },
      xrayEnabled: true,
    })),
    map(fp.omit(['arn', 'uris', 'tags'])),
    switchMap((graphqlApi: UpdateGraphqlApiRequest) =>
      from(appsync.updateGraphqlApi(graphqlApi).promise()),
    ),
    catchError(err =>
      JSON.stringify(err, null, 2).includes(
        'Additional authentication provider',
      )
        ? of(true)
        : throwError(err),
    ),
  );
