import {
  aws_iam as iam,
  aws_cognito as cognito,
  aws_secretsmanager as sm,
  Duration,
  aws_lambda_nodejs,
} from 'aws-cdk-lib';

import { tableConfig } from '@bgap/crud-gql/backend';
import * as sst from '@serverless-stack/resources';
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
    const apiLambda = new aws_lambda_nodejs.NodejsFunction(
      this,
      'AppsyncLambda',
      {
        ...commonLambdaProps,
        functionName: `${scope.stage}-anyupp-graphql-resolvers`,
        handler: 'handler',
        entry: __dirname + '/../../lib/lambda/appsync-lambda/index.ts',
        timeout: Duration.seconds(30),
        memorySize: 512,
        environment: {
          userPoolId: props.adminUserPool.userPoolId,
          secretName: props.secretsManager.secretName,
          STRIPE_SECRET_KEY: props.stripeSecretKey,
          STRIPE_SIGNING_SECRET: props.stripeSigningSecret,
          SZAMLAZZ_HU_AGENT_KEY: props.szamlazzhuAgentKey,
          API_ACCESS_KEY_ID: props.apiAccessKeyId,
          API_SECRET_ACCESS_KEY: props.apiSecretAccessKey,
        },
      },
    );

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
      apiLambda.role.addToPrincipalPolicy(
        new iam.PolicyStatement({
          actions: ['es:ESHttpPost'],
          resources: ['*'],
        }),
      );
    }

    props.secretsManager.grantRead(apiLambda);
  }
}
