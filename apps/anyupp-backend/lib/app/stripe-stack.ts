import {
  aws_lambda as lambda,
  aws_certificatemanager as acm,
  aws_route53 as route53,
  aws_apigateway as apigateway,
  Duration,
} from 'aws-cdk-lib';
import * as sst from '@serverless-stack/resources';
import { commonLambdaProps } from './lambda-common';
import path from 'path';
import { createApiDomainName } from './utils';

export interface StripeStackProps extends sst.StackProps {
  stripeSecretKey: string;
  stripeSigningSecret: string;
  szamlazzhuAgentKey: string;
  apiAccessKeyId: string;
  apiSecretAccessKey: string;
  rootDomain: string;
  certificate: acm.ICertificate;
  zone: route53.IHostedZone;
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
        timeout: Duration.seconds(30),
        memorySize: 512,
        code: lambda.Code.fromAsset(
          path.join(__dirname, '../../.serverless-1/stripe-webhook.zip'),
        ),
        environment: {
          STRIPE_SECRET_KEY: props.stripeSecretKey,
          STRIPE_SIGNING_SECRET: props.stripeSigningSecret,
          SZAMLAZZ_HU_AGENT_KEY: props.szamlazzhuAgentKey,
          API_ACCESS_KEY_ID: props.apiAccessKeyId,
          API_SECRET_ACCESS_KEY: props.apiSecretAccessKey,
        },
      },
    );

    const apiName = 'stripe-webhook';

    const api = new apigateway.LambdaRestApi(this, 'StripeWebhook', {
      handler: stripeWebhookLambda,
      restApiName: apiName,
      proxy: true,
      deployOptions: {
        stageName: scope.stage,
      },
    });

    createApiDomainName(
      this,
      apiName,
      api,
      props.zone,
      props.rootDomain,
      props.certificate,
    );
  }
}
