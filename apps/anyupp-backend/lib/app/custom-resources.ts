import { SnsEventSource } from '@aws-cdk/aws-lambda-event-sources';
import path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import * as iam from '@aws-cdk/aws-iam';
import * as sst from '@serverless-stack/resources';
import { commonLambdaProps } from './lambda-common';
import { Duration, CustomResource } from '@aws-cdk/core';
import { Provider } from '@aws-cdk/custom-resources';
import * as sns from '@aws-cdk/aws-sns';
import * as sqs from '@aws-cdk/aws-sqs';

export interface CustomResourcesStackProps extends sst.StackProps {}

export class CustomResourcesStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props: CustomResourcesStackProps) {
    super(scope, id);

    const route53Lambda = new lambda.Function(this, 'Route53Lambda', {
      ...commonLambdaProps,
      handler: 'lib/lambda/route53/index.handler',
      memorySize: 512,
      code: lambda.Code.fromAsset(
        path.join(__dirname, '../../.serverless/route53.zip'),
      ),
      timeout: Duration.minutes(15),
      initialPolicy: [
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ['*'],
          resources: ['*'],
        }),
        new iam.PolicyStatement({
          actions: ['appsync:GraphQL'],
          resources: ['*'],
        }),
      ],
    });

    const topic = new sns.Topic(this, 'Route53Topic');
    const queue = new sqs.Queue(this, 'MyQueue');
    route53Lambda.addEventSource(
      new SnsEventSource(topic, { deadLetterQueue: queue }),
    );
  }
}
