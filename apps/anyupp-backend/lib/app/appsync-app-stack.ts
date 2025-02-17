import {
  aws_iam as iam,
  aws_cognito as cognito,
  aws_secretsmanager as sm,
  Duration,
  aws_lambda,
} from 'aws-cdk-lib';
import { tableConfig } from '@bgap/crud-gql/backend';
import { App, Stack, StackProps } from '@serverless-stack/resources';
import { commonLambdaProps } from './lambda-common';
import path from 'path';

export interface AppsyncAppStackProps extends StackProps {
  adminUserPool: cognito.UserPool;
  consumerUserPool: cognito.UserPool;
  stripeSecretKey: string;
  stripeSigningSecret: string;
  secretsManager: sm.ISecret;
  szamlazzhuAgentKey: string;
  apiAccessKeyId: string;
  apiSecretAccessKey: string;
}

export class AppsyncAppStack extends Stack {
  readonly appSyncLogPublisherRole: iam.Role;

  constructor(scope: App, id: string, props: AppsyncAppStackProps) {
    super(scope, id);

    const apiLambda = new aws_lambda.Function(this, 'AppsyncLambda', {
      ...commonLambdaProps,
      handler: 'index.handler',
      code: aws_lambda.Code.fromAsset(
        path.join(__dirname, '../../build/appsync-lambda'),
      ),
      functionName: `${scope.stage}-anyupp-graphql-resolvers`,
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
            tableConfig.Unit.TableArn,
            tableConfig.AdminUser.TableArn,
            tableConfig.UnitProduct.TableArn,
            tableConfig.Order.TableArn,
            tableConfig.Variant.TableArn,
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

    this.appSyncLogPublisherRole = new iam.Role(
      this,
      'AWSAppSyncPushToCloudWatchLogsRole',
      {
        roleName: `${scope.stage}-AWSAppSyncPushToCloudWatchLogsRole`,
        assumedBy: new iam.ServicePrincipal('appsync.amazonaws.com'),
      },
    );

    this.appSyncLogPublisherRole.addToPrincipalPolicy(
      new iam.PolicyStatement({
        actions: [
          'logs:CreateLogGroup',
          'logs:CreateLogStream',
          'logs:PutLogEvents',
        ],
        resources: ['*'],
      }),
    );
  }
}
