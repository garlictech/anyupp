import path from 'path';

import * as appsync from '@aws-cdk/aws-appsync';
import * as cognito from '@aws-cdk/aws-cognito';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as sm from '@aws-cdk/aws-secretsmanager';
import * as ssm from '@aws-cdk/aws-ssm';
import * as cdk from '@aws-cdk/core';
import { createAdminUserResolvers } from '@bgap/api/admin-user';
import { createOrderResolvers } from '@bgap/api/order';
import { createUnitResolvers } from '@bgap/api/unit';
import { createProductResolvers } from '@bgap/api/product';
import * as sst from '@serverless-stack/resources';

import { commonLambdaProps } from './lambda-common';
import { PROJECT_ROOT } from './settings';

export interface AppsyncAppStackProps extends sst.StackProps {
  adminUserPool: cognito.UserPool;
  consumerUserPool: cognito.UserPool;
  secretsManager: sm.ISecret;
}

export class AppsyncAppStack extends sst.Stack {
  private lambdaDs!: appsync.LambdaDataSource;
  private api: appsync.GraphqlApi;

  constructor(scope: sst.App, id: string, props: AppsyncAppStackProps) {
    super(scope, id);
    const app = this.node.root as sst.App;

    // Creates the AppSync API
    this.api = new appsync.GraphqlApi(this, 'Api', {
      name: app.logicalPrefixedName('anyupp-appsync-api'),
      schema: appsync.Schema.fromAsset(
        PROJECT_ROOT +
          'libs/api/graphql/schema/src/schema/appsync/appsync-api.graphql',
      ),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: cdk.Expiration.after(cdk.Duration.days(365)),
          },
        },
        additionalAuthorizationModes: [
          {
            authorizationType: appsync.AuthorizationType.USER_POOL,
            userPoolConfig: {
              userPool: props.adminUserPool,
            },
          },
          {
            authorizationType: appsync.AuthorizationType.USER_POOL,
            userPoolConfig: {
              userPool: props.consumerUserPool,
            },
          },
        ],
      },
      xrayEnabled: true,
    });

    this.createDatasources(props);

    const commonResolverInputs = { lambdaDs: this.lambdaDs };
    createOrderResolvers(commonResolverInputs);
    createAdminUserResolvers(commonResolverInputs);
    createUnitResolvers(commonResolverInputs);
    createProductResolvers(commonResolverInputs);

    new ssm.StringParameter(this, 'GraphqlApiUrlParam', {
      allowedPattern: '.*',
      description: 'The graphql API endpoint URL',
      parameterName: app.logicalPrefixedName('GraphqlApiUrl'),
      stringValue: this.api.graphqlUrl,
    });

    new ssm.StringParameter(this, 'GraphqlApiKeyParam', {
      allowedPattern: '.*',
      description: 'The graphql API key',
      parameterName: app.logicalPrefixedName('GraphqlApiKey'),
      stringValue: this.api.apiKey || '',
    });

    // Prints out the AppSync GraphQL endpoint to the terminal
    new cdk.CfnOutput(this, 'GraphqlApiUrl', {
      value: this.api.graphqlUrl,
    });

    // Prints out the AppSync GraphQL API key to the terminal
    new cdk.CfnOutput(this, 'GraphqlApiKey', {
      value: this.api.apiKey || '',
    });
  }

  private createDatasources(props: AppsyncAppStackProps) {
    // NO DATA SOURCE
    new appsync.NoneDataSource(this, 'NoneDataSource', {
      api: this.api,
    });

    // LAMBDA DATA SOURCES
    // Create the lambda first. Mind, that we have to build appsync-lambda.zip
    // with serverless bundle, in the build step! So, you have to declare the lambda
    // in serverless.xml as well (see the example)
    const apiLambda = new lambda.Function(this, 'AppsyncLambda', {
      ...commonLambdaProps,
      // It must be relative to the serverless.yml file
      handler: 'lib/lambda/appsync-lambda/index.handler',
      timeout: cdk.Duration.seconds(30),
      memorySize: 256,
      code: lambda.Code.fromAsset(
        path.join(__dirname, '../../.serverless/appsync-lambda.zip'),
      ),
      environment: {
        userPoolId: props.adminUserPool.userPoolId,
        secretName: props.secretsManager.secretName,
      },
    });

    apiLambda.role &&
      apiLambda.role.addToPolicy(
        // TODO: replace this deprecated function usage
        new iam.PolicyStatement({
          actions: [
            'cognito-idp:AdminCreateUser',
            'cognito-idp:AdminGetUser',
            'cognito-idp:AdminDeleteUser',
          ],
          resources: [props.adminUserPool.userPoolArn],
        }),
      );

    props.secretsManager.grantRead(apiLambda);
    this.lambdaDs = this.api.addLambdaDataSource('lambdaDatasource', apiLambda);
  }
}
