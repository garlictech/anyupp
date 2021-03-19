import path from 'path';

import * as appsync from '@aws-cdk/aws-appsync';
import * as cognito from '@aws-cdk/aws-cognito';
import * as lambda from '@aws-cdk/aws-lambda';
import * as sm from '@aws-cdk/aws-secretsmanager';
import * as ssm from '@aws-cdk/aws-ssm';
import * as cdk from '@aws-cdk/core';
import { createOrderResolvers } from '@bgap/api/order';
import * as sst from '@serverless-stack/resources';

import { commonLambdaProps } from './lambda-common';
import { PROJECT_ROOT } from './settings';
import { GraphqlApi } from '@aws-cdk/aws-appsync';
import { Duration } from '@aws-cdk/core';

export interface AppsyncAppStackProps extends sst.StackProps {
  adminUserPool: cognito.UserPool;
  consumerUserPool: cognito.UserPool;
  secretsManager: sm.ISecret;
  // dynamoDBStack: DynamoDBStack;
}

export class AppsyncAppStack extends sst.Stack {
  // private validatorResolverFunctions: ValidatorResolverFunctions;
  // private userTableDDDs!: appsync.DynamoDbDataSource;
  // private orderTableDDDs!: appsync.DynamoDbDataSource;
  // private unitTableDDDs!: appsync.DynamoDbDataSource;
  // private groupTableDDDs!: appsync.DynamoDbDataSource;
  private lambdaDs!: appsync.LambdaDataSource;
  private api: GraphqlApi;

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

    this.createDatasources(props.secretsManager);

    const baseResolverInputParams = {
      api: this.api,
      scope: this,
      // userTableDDDs: this.userTableDDDs,
      // orderTableDDDs: this.orderTableDDDs,
      // unitTableDDDs: this.unitTableDDDs,
      // groupTableDDDs: this.groupTableDDDs,
      lambdaDs: this.lambdaDs,
    };

    // createStripeResolvers({
    //   ...baseResolverInputParams,
    // });
    createOrderResolvers({
      ...baseResolverInputParams,
    });

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

  private createDatasources(
    secretsManager: sm.ISecret,
    // dynamoDBStack: DynamoDBStack,
  ) {
    // NO DATA SOURCE
    new appsync.NoneDataSource(this, 'NoneDataSource', {
      api: this.api,
    });

    // // DATABASE DATA SOURCES
    // this.userTableDDDs = this.api.addDynamoDbDataSource(
    //   'UserDynamoDbDataSource',
    //   dynamoDBStack.userTable,
    // );
    // this.orderTableDDDs = this.api.addDynamoDbDataSource(
    //   'OrderDynamoDbDataSource',
    //   dynamoDBStack.orderTable,
    // );
    // this.unitTableDDDs = this.api.addDynamoDbDataSource(
    //   'UnitDynamoDbDataSource',
    //   dynamoDBStack.unitTable,
    // );
    // this.groupTableDDDs = this.api.addDynamoDbDataSource(
    //   'GroupDynamoDbDataSource',
    //   dynamoDBStack.groupTable,
    // );

    // LAMBDA DATA SOURCES
    // Create the lambda first. Mind, that we have to build appsync-lambda.zip
    // with serverless bundle, in the build step! So, you have to declare the lambda
    // in serverless.xml as well (see the example)
    const apiLambda = new lambda.Function(this, 'AppsyncLambda', {
      ...commonLambdaProps,
      // It must be relative to the serverless.yml file
      handler: 'lib/lambda/appsync-lambda/index.handler',
      timeout: Duration.seconds(5),
      memorySize: 256,
      code: lambda.Code.fromAsset(
        path.join(__dirname, '../../.serverless/appsync-lambda.zip'),
      ),
      initialPolicy: [
        // new iam.PolicyStatement({
        //   actions: ['dynamodb:*'],
        //   resources: ['arn:aws:dynamodb:*:568276182587:table/*'],
        // }),
      ],
    });

    secretsManager.grantRead(apiLambda);
    this.lambdaDs = this.api.addLambdaDataSource('lambdaDatasource', apiLambda);
    // The API LAMBDA should be able to access these tables
    // apiLambda.addEnvironment(
    //   'UNIT_PRODUCT_TABLE',
    //   dynamoDBStack.unitProductTable.tableName,
    // );
  }
}
