import { Construct } from '@aws-cdk/core';
import * as route53 from '@aws-cdk/aws-route53';
import * as cdk from '@aws-cdk/core';
import * as sst from '@serverless-stack/resources';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as targets from '@aws-cdk/aws-route53-targets';
import * as s3deploy from '@aws-cdk/aws-s3-deployment';
import { AutoDeleteBucket } from './auto-delete-bucket';

export interface WebsiteProps extends sst.StackProps {
  domainName: string;
  siteSubDomain: string;
  distDir: string;
  certificateArn: string;
}

export class WebsiteConstruct extends Construct {
  public websiteUrl: string;

  constructor(scope: Construct, id: string, props: WebsiteProps) {
    super(scope, id);
    const app = this.node.root as sst.App;

    /*const zone = route53.HostedZone.fromLookup(this, 'Zone', {
      domainName: props.domainName,
    });*/

    const zone = route53.HostedZone.fromHostedZoneId(
      this,
      'Zone',
      'Z07724744XHDX57X0R8H',
    );
    const siteDomain =
      app.stage + '-' + props.siteSubDomain + '.' + props.domainName;

    this.websiteUrl = 'https://' + siteDomain;
    new cdk.CfnOutput(this, 'Site', { value: this.websiteUrl });

    // Content bucket
    const siteBucket = new AutoDeleteBucket(this, 'SiteBucket', {
      bucketName: siteDomain,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
      publicReadAccess: true,
    });

    new cdk.CfnOutput(this, 'Bucket', { value: siteBucket.bucketName });

    // CloudFront distribution that provides HTTPS
    const distribution = new cloudfront.CloudFrontWebDistribution(
      this,
      'SiteDistribution',
      {
        aliasConfiguration: {
          acmCertRef: props.certificateArn,
          names: [siteDomain],
          sslMethod: cloudfront.SSLMethod.SNI,
          securityPolicy: cloudfront.SecurityPolicyProtocol.TLS_V1_1_2016,
        },
        originConfigs: [
          {
            customOriginSource: {
              domainName: siteBucket.bucketWebsiteDomainName,
              originProtocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY,
            },
            behaviors: [{ isDefaultBehavior: true }],
          },
        ],
      },
    );

    new cdk.CfnOutput(this, 'DistributionId', {
      value: distribution.distributionId,
    });

    // Route53 alias record for the CloudFront distribution
    new route53.ARecord(this, 'SiteAliasRecord', {
      recordName: siteDomain,
      target: route53.RecordTarget.fromAlias(
        new targets.CloudFrontTarget(distribution),
      ),
      zone,
    });

    // Deploy site contents to S3 bucket
    new s3deploy.BucketDeployment(this, 'DeployWithInvalidation', {
      sources: [s3deploy.Source.asset(props.distDir)],
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ['/*'],
      retainOnDelete: false,
    });
  }
}
