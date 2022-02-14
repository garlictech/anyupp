import {
  aws_route53 as route53,
  aws_cloudfront as cloudfront,
  aws_route53_targets as targets,
  aws_s3_deployment as s3deploy,
  aws_certificatemanager as acm,
  aws_s3 as s3,
  RemovalPolicy,
  CfnOutput,
} from 'aws-cdk-lib';
import * as sst from '@serverless-stack/resources';
import { Construct } from 'constructs';

export interface WebsiteProps extends sst.StackProps {
  domainName: string;
  siteSubDomain: string;
  distDir: string;
  certificate: acm.ICertificate;
}

export class WebsiteConstruct extends Construct {
  public websiteUrl: string;

  constructor(scope: Construct, id: string, props: WebsiteProps) {
    super(scope, id);
    const app = this.node.root as sst.App;

    const siteDomain = props.siteSubDomain + '.' + props.domainName;

    this.websiteUrl = 'https://' + siteDomain;
    new CfnOutput(this, 'Site', { value: this.websiteUrl });

    // Content bucket
    const siteBucket = new s3.Bucket(this, 'SiteBucket', {
      bucketName: siteDomain,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
      publicReadAccess: true,
      removalPolicy: RemovalPolicy.RETAIN,
    });

    new CfnOutput(this, 'Bucket', { value: siteBucket.bucketName });

    // CloudFront distribution that provides HTTPS
    const distribution = new cloudfront.CloudFrontWebDistribution(
      this,
      'SiteDistribution',
      {
        viewerCertificate: cloudfront.ViewerCertificate.fromAcmCertificate(
          props.certificate,
          {
            aliases: [siteDomain],
            sslMethod: cloudfront.SSLMethod.SNI,
            securityPolicy: cloudfront.SecurityPolicyProtocol.TLS_V1_1_2016,
          },
        ),
        originConfigs: [
          {
            customOriginSource: {
              domainName: siteBucket.bucketWebsiteDomainName,
              originProtocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY,
            },
            behaviors: [{ isDefaultBehavior: true, compress: true }],
          },
        ],
      },
    );

    new CfnOutput(this, 'DistributionId', {
      value: distribution.distributionId,
    });

    new CfnOutput(this, 'DistributionDomainName', {
      value: distribution.distributionDomainName,
    });

    new CfnOutput(this, 'SiteDomain', {
      value: siteDomain,
    });
    //
    // Route53 alias record for the CloudFront distribution
    if (app.stage !== 'prod') {
      const zone = route53.HostedZone.fromLookup(this, 'Zone', {
        domainName: props.domainName,
      });

      new route53.ARecord(this, 'SiteAliasRecord', {
        recordName: siteDomain,
        target: route53.RecordTarget.fromAlias(
          new targets.CloudFrontTarget(distribution),
        ),
        zone,
      });
    }

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
