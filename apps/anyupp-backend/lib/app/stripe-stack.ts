import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigateway from '@aws-cdk/aws-apigateway';
import * as sst from '@serverless-stack/resources';
import { commonLambdaProps } from './lambda-common';
import path from 'path';
import * as ssm from '@aws-cdk/aws-ssm';
import { getFQParamName } from './utils';

export interface StripeStackProps extends sst.StackProps {
  stripeSecretKey: string;
  stripeSigningSecret: string;
}

export class StripeStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props: StripeStackProps) {
    super(scope, id);

    const stripeWebhookLambda = new lambda.Function(
      this,
      'StripeWebhookLambda',
      {
        ...commonLambdaProps,
        // It must be relative to the serverless.yml file
        handler: 'lib/lambda/stripe-webhook/index.handler',
        code: lambda.Code.fromAsset(
          path.join(__dirname, '../../.serverless/stripe-webhook.zip'),
        ),
        environment: {
          STRIPE_SECRET_KEY: props.stripeSecretKey,
          STRIPE_SIGNING_SECRET: props.stripeSigningSecret,
        }
      },
    );

    const api = new apigateway.LambdaRestApi(this, 'StripeWebhook', {
      handler: stripeWebhookLambda,
      deployOptions: {
        stageName: scope.stage,
      },
    });

    new ssm.StringParameter(this, 'StripeWebhookEndpointParam', {
      allowedPattern: '.*',
      description: 'Webhook for Stripe',
      parameterName: getFQParamName(scope, 'StripeWebhookEndpoint'),
      stringValue: api.url,
    });

    new cdk.CfnOutput(this, 'StripeWebhookEndpoint', {
      value: api.url,
    });
  }
}
