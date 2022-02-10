import {
  RemovalPolicy,
  Duration,
  CustomResource,
  aws_lambda as lambda,
  aws_s3 as s3,
  custom_resources as cr,
} from 'aws-cdk-lib';
import path from 'path';
import { commonLambdaProps } from './lambda-common';
import { Construct } from 'constructs';

export class AutoDeleteBucket extends s3.Bucket {
  constructor(scope: Construct, id: string, props: s3.BucketProps = {}) {
    super(scope, id, {
      ...props,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const adlambda = new lambda.SingletonFunction(this, 'AutoBucketHandler', {
      uuid: '7677dc81-117d-41c0-b75b-db11cb84bb70',
      ...commonLambdaProps,
      handler: 'lib/lambda/auto-delete-bucket/index.handler',
      code: lambda.Code.fromAsset(
        path.join(__dirname, '../../.serverless-1/auto-delete-bucket.zip'),
      ),
      lambdaPurpose: 'AutoBucket',
      timeout: Duration.minutes(15),
    });

    // allow the bucket contents to be read and deleted by the lambda
    this.grantReadWrite(adlambda);

    const provider = new cr.Provider(this, 'AutoBucketProvider', {
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
