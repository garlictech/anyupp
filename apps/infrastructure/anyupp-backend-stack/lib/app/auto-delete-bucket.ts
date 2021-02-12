import { Construct, RemovalPolicy, Duration } from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';

import { Bucket, BucketProps } from '@aws-cdk/aws-s3';
import path from 'path';

export class AutoDeleteBucket extends Bucket {
  constructor(scope: Construct, id: string, props: BucketProps = {}) {
    super(scope, id, {
      ...props,
      removalPolicy: RemovalPolicy.DESTROY
    });

    const adlambda = new lambda.SingletonFunction(this, 'AutoBucketHandler', {
      uuid: '7677dc81-117d-41c0-b75b-db11cb84bb70',
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'lib/lambda/auto-delete-bucket/index.handler',
      code: lambda.Code.fromAsset(
        path.join(__dirname, '../../.serverless/auto-delete-bucket.zip')
      ),
      lambdaPurpose: 'AutoBucket',
      timeout: Duration.minutes(15)
    });

    // allow the bucket contents to be read and deleted by the lambda
    this.grantReadWrite(adlambda);
  }
}
