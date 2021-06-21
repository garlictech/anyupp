import path from 'path';
import * as appsync from '@aws-cdk/aws-appsync';
import * as cognito from '@aws-cdk/aws-cognito';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as sm from '@aws-cdk/aws-secretsmanager';
import * as ssm from '@aws-cdk/aws-ssm';
import * as cdk from '@aws-cdk/core';
import {
  createAdminUserResolvers,
  createOrderResolvers,
  createProductResolvers,
  createStripeResolvers,
  createUnitResolvers,
  createUserResolvers,
} from '@bgap/anyupp-gql/backend';
import * as sst from '@serverless-stack/resources';

import { commonLambdaProps } from './lambda-common';
import { PROJECT_ROOT } from './settings';
import { getFQParamName } from './utils';
import { tableConfig } from '@bgap/crud-gql/backend';
import { FieldLogLevel } from '@aws-cdk/aws-appsync';

export interface AppsyncAppStackProps extends sst.StackProps {
  adminUserPool: cognito.UserPool;
  consumerUserPool: cognito.UserPool;
  stripeSecretKey: string;
  stripeSigningSecret: string;
  secretsManager: sm.ISecret;
  szamlazzhuAgentKey: string;
  apiAccessKeyId: string;
  apiSecretAccessKey: string;
}

export class AppsyncAppStack extends sst.Stack {
  public api: appsync.GraphqlApi;

  private lambdaDs?: appsync.LambdaDataSource;

  constructor(scope: sst.App, id: string, props: AppsyncAppStackProps) {
    super(scope, id);
    const app = this.node.root as sst.App;

    // Creates the AppSync API
    this.api = new appsync.GraphqlApi(this, 'Api', {
      name: app.logicalPrefixedName('anyupp-appsync-api'),
      schema: appsync.Schema.fromAsset(
        PROJECT_ROOT +
          'libs/anyupp-gql/backend/src/graphql/schema/anyupp-api.graphql',
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
      logConfig: {
        fieldLogLevel: FieldLogLevel.ALL,
      },
    });

    this.createDatasources(props);

    if (!this.lambdaDs) {
      throw new Error(
        'MAke sure that teh lambda data source exists before using it!',
      );
    }

    const commonResolverInputs = { lambdaDs: this.lambdaDs };
    createOrderResolvers(commonResolverInputs);
    createAdminUserResolvers(commonResolverInputs);
    createUnitResolvers(commonResolverInputs);
    createProductResolvers(commonResolverInputs);
    createStripeResolvers(commonResolverInputs);
    createUserResolvers(commonResolverInputs);

    new ssm.StringParameter(this, 'AnyuppGraphqlApiUrlParam', {
      allowedPattern: '.*',
      description: 'The graphql API endpoint URL',
      parameterName: getFQParamName(app, 'AnyuppGraphqlApiUrl'),
      stringValue: this.api.graphqlUrl,
    });

    new ssm.StringParameter(this, 'AnyuppGraphqlApiKeyParam', {
      allowedPattern: '.*',
      description: 'The graphql API key',
      parameterName: getFQParamName(app, 'AnyuppGraphqlApiKey'),
      stringValue: this.api.apiKey || '',
    });

    // Prints out the AppSync GraphQL endpoint to the terminal
    new cdk.CfnOutput(this, 'AnyuppGraphqlApiUrl', {
      value: this.api.graphqlUrl,
    });

    // Prints out the AppSync GraphQL API key to the terminal
    new cdk.CfnOutput(this, 'AnyuppGraphqlApiKey', {
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
      memorySize: 512,
      code: lambda.Code.fromAsset(
        path.join(__dirname, '../../.serverless/appsync-lambda.zip'),
      ),
      environment: {
        userPoolId: props.adminUserPool.userPoolId,
        secretName: props.secretsManager.secretName,
        STRIPE_SECRET_KEY: props.stripeSecretKey,
        STRIPE_SIGNING_SECRET: props.stripeSigningSecret,
        SZAMLAZZ_HU_AGENT_KEY: props.szamlazzhuAgentKey,
        API_ACCESS_KEY_ID: props.apiAccessKeyId,
        API_SECRET_ACCESS_KEY: props.apiSecretAccessKey,
      },
    });

    if (apiLambda.role) {
      apiLambda.role.addToPrincipalPolicy(
        // TODO: replace this de  cated function usage
        new iam.PolicyStatement({
          actions: [
            'cognito-idp:AdminCreateUser',
            'cognito-idp:ListUsers',
            'cognito-idp:AdminGetUser',
            'cognito-idp:AdminDeleteUser',
            'cognito-idp:AdminSetUserPassword',
          ],
          resources: [
            props.adminUserPool.userPoolArn,
            props.consumerUserPool.userPoolArn,
          ],
        }),
      );
      apiLambda.role.addToPrincipalPolicy(
        new iam.PolicyStatement({
          actions: [
            'dynamodb:BatchGetItem',
            'dynamodb:BatchWriteItem',
            'dynamodb:PutItem',
            'dynamodb:DeleteItem',
            'dynamodb:GetItem',
            'dynamodb:Scan',
            'dynamodb:Query',
            'dynamodb:UpdateItem',
          ],
          resources: [
            tableConfig.GeneratedProduct.TableArn,
            tableConfig.GeneratedProductCategory.TableArn,
            tableConfig.Unit.TableArn,
          ],
        }),
      );
    }

    props.secretsManager.grantRead(apiLambda);
    this.lambdaDs = this.api.addLambdaDataSource('lambdaDatasource', apiLambda);
  }
}
