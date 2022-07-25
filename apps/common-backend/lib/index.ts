import { App, Stack } from '@serverless-stack/resources';
import {
  aws_ec2 as ec2,
  aws_ssm as ssm,
  aws_ecs as ecs,
  CfnOutput,
} from 'aws-cdk-lib';
import {
  anyuppVpcName,
  anyuppFargateClusterName,
  anyuppVpcSecurityGroupParamName,
  anyuppVpcIdParamName,
} from '@bgap/backend/shared/utils';
import { AnyuppAccountServicesStack } from './stacks/account-services-stack';
import { AnyuppCloudTrailStack } from './stacks/cloud-trail-stack';
import { AnyuppConfigStack } from './stacks/config-stack';

export class AnyuppCommonStack extends Stack {
  constructor(scope: App, id: string) {
    super(scope, id);

    // TODO: This should be at least 2
    const vpc = new ec2.Vpc(this, anyuppVpcName, {
      maxAzs: 1,
    });

    //cluster
    new ecs.Cluster(this, 'AnyuppCluster', {
      vpc,
      clusterName: anyuppFargateClusterName,
    });

    // The fargate part

    new ssm.StringParameter(this, 'AnyuppVpcIdParam', {
      allowedPattern: '.*',
      description: 'VPC for the anyupp projects',
      parameterName: anyuppVpcIdParamName,
      stringValue: vpc.vpcId,
    });

    new ssm.StringParameter(this, 'AnyuppVpcSecurityGroupNameParam', {
      allowedPattern: '.*',
      description: 'Default security group for the anyupp projects',
      parameterName: anyuppVpcSecurityGroupParamName,
      stringValue: vpc.vpcDefaultSecurityGroup,
    });

    new CfnOutput(this, 'AnyuppVpcSecurityGroupOutput', {
      value: vpc.vpcDefaultSecurityGroup,
    });

    new CfnOutput(this, 'AnyuppVpcSubnetOutput', {
      value: vpc.privateSubnets[0].subnetId,
    });

    new CfnOutput(this, 'AnyuppVpcIdOutput', {
      value: vpc.vpcId,
    });
  }
}

export default function main(app: App): void {
  new AnyuppCommonStack(app, 'anyupp');
  new AnyuppAccountServicesStack(app, 'anyupp-services');
  new AnyuppCloudTrailStack(app, 'anyupp-cloudtrail');
  new AnyuppConfigStack(app, 'anyupp-config');
}
