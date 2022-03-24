import {
  aws_lambda as lambda,
  aws_iam as iam,
  aws_cognito as cognito,
  aws_secretsmanager as sm,
  Duration,
} from 'aws-cdk-lib';

import { tableConfig } from '@bgap/crud-gql/backend';
import * as sst from '@serverless-stack/resources';
import path from 'path';
import { commonLambdaProps } from './lambda-common';

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
  constructor(scope: sst.App, id: string, props: AppsyncAppStackProps) {
    super(scope, id);
    const apiLambda = new lambda.Function(this, 'AppsyncLambda', {
      ...commonLambdaProps,
      // It must be relative to the serverless.yml file
      functionName: `${scope.stage}-anyupp-graphql-resolvers`,
      handler: 'lib/lambda/appsync-lambda/index.handler',
      timeout: Duration.seconds(30),
      memorySize: 512,
      code: lambda.Code.fromAsset(
        path.join(__dirname, '../../.serverless-1/appsync-lambda.zip'),
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
            tableConfig.AdminUser.TableArn,
            tableConfig.UnitProduct.TableArn,
            tableConfig.GroupProduct.TableArn,
            tableConfig.ChainProduct.TableArn,
            tableConfig.Order.TableArn,
          ],
        }),
      );
    }

    props.secretsManager.grantRead(apiLambda);
  }
}
