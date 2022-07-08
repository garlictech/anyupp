import { App, Stack } from '@serverless-stack/resources';
import { aws_iam as iam, aws_s3, aws_cloudtrail } from 'aws-cdk-lib';

export class CloudTrailStack extends Stack {
  constructor(scope: App, id: string) {
    super(scope, id);
    const app = this.node.root as App;

    /***
     * Cloud Trail configurations and trails
     * NOTE: this should be elevated later to the organizational level
     */
    const cloudTrailPrincipal = new iam.ServicePrincipal(
      'cloudtrail.amazonaws.com',
    );

    const cloudTrailDeliveryBucket = new aws_s3.Bucket(
      this,
      'anyupp-cloudtrail',
      {
        versioned: true,
        enforceSSL: true,
        encryption: aws_s3.BucketEncryption.S3_MANAGED,
        blockPublicAccess: aws_s3.BlockPublicAccess.BLOCK_ALL,
      },
    );

    cloudTrailDeliveryBucket.addToResourcePolicy(
      new iam.PolicyStatement({
        resources: [cloudTrailDeliveryBucket.bucketArn],
        actions: ['s3:GetBucketAcl'],
        principals: [cloudTrailPrincipal],
      }),
    );

    cloudTrailDeliveryBucket.addToResourcePolicy(
      new iam.PolicyStatement({
        resources: [
          cloudTrailDeliveryBucket.arnForObjects(`AWSLogs/${app.stage}/*`),
        ],
        actions: ['s3:PutObject'],
        principals: [cloudTrailPrincipal],
        conditions: {
          StringEquals: { 's3:x-amz-acl': 'bucket-owner-full-control' },
        },
      }),
    );

    new aws_cloudtrail.Trail(this, 'ManagementTrail', {
      trailName: `${app.stage}-management-events-trail`,
      bucket: cloudTrailDeliveryBucket,
      managementEvents: aws_cloudtrail.ReadWriteType.ALL,
      enableFileValidation: true,
      isMultiRegionTrail: true,
    });
  }
}
