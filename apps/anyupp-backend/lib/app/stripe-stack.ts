import {
  aws_lambda_nodejs,
  aws_certificatemanager as acm,
  aws_route53 as route53,
  aws_apigateway as apigateway,
  Duration,
} from 'aws-cdk-lib';
import * as sst from '@serverless-stack/resources';
import { commonLambdaProps } from './lambda-common';
import { createApiDomainName } from './utils';

export interface StripeStackProps extends sst.StackProps {
  stripeSecretKey: string;
  stripeSigningSecret: string;
  stripeSecretKeyNewApi: string;
  stripeSigningSecretNewApi: string;
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

    const stripeWebhookLambda = new aws_lambda_nodejs.NodejsFunction(
      this,
      'StripeWebhookLambda',
      {
        ...commonLambdaProps,
        timeout: Duration.seconds(30),
        memorySize: 512,
        handler: 'handler',
        entry: __dirname + '/../../lib/lambda/stripe-webhook/index.ts',
        environment: {
          STRIPE_SECRET_KEY: props.stripeSecretKeyNewApi,
          STRIPE_SIGNING_SECRET: props.stripeSigningSecretNewApi,
          SZAMLAZZ_HU_AGENT_KEY: props.szamlazzhuAgentKey,
          API_ACCESS_KEY_ID: props.apiAccessKeyId,
          API_SECRET_ACCESS_KEY: props.apiSecretAccessKey,
        },
      },
    );

    // Temporarily, we refer to the old api with the current names,
    // in order to deploy it under the current endpoint, for the
    // old apps. Carefully, as it is confusding!
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
