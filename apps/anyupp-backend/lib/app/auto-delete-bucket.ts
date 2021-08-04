import {
  Construct,
  RemovalPolicy,
  Duration,
  CustomResource,
} from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import { Provider } from '@aws-cdk/custom-resources';
import { Bucket, BucketProps } from '@aws-cdk/aws-s3';
import path from 'path';
import { commonLambdaProps } from './lambda-common';

export class AutoDeleteBucket extends Bucket {
  constructor(scope: Construct, id: string, props: BucketProps = {}) {
    super(scope, id, {
      ...props,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const adlambda = new lambda.SingletonFunction(this, 'AutoBucketHandler', {
      uuid: '7677dc81-117d-41c0-b75b-db11cb84bb70',
      ...commonLambdaProps,
      handler: 'lib/lambda/auto-delete-bucket/index.handler',
      code: lambda.Code.fromAsset(
        path.join(__dirname, '../../.serverless/auto-delete-bucket.zip'),
      ),
      lambdaPurpose: 'AutoBucket',
      timeout: Duration.minutes(15),
    });

    // allow the bucket contents to be read and deleted by the lambda
    this.grantReadWrite(adlambda);

    const provider = new Provider(this, 'AutoBucketProvider', {
      onEventHandler: adlambda,
    });

    new CustomResource(this, 'AutoBucket', {
      serviceToken: provider.serviceToken,
      resourceType: 'Custom::AutoDeleteBucket',
      properties: {
        BucketName: this.bucketName,
      },
    });
  }
}
