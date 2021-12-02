import * as cdk from '@aws-cdk/core';
import { App, Stack } from '@serverless-stack/resources';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ssm from '@aws-cdk/aws-ssm';
import {
  anyuppVpcName,
  anyuppFargateClusterName,
  anyuppVpcSecurityGroupParamName,
  anyuppVpcIdParamName,
} from '@bgap/backend/shared/utils';
import * as ecs from '@aws-cdk/aws-ecs';

export class AnyuppCommonStack extends Stack {
  constructor(scope: App, id: string) {
    super(scope, id);

    const vpc = new ec2.Vpc(this, anyuppVpcName, {
      maxAzs: 1,
    });

    //cluster
    new ecs.Cluster(this, 'AnyuppCluster', {
      vpc,
      clusterName: anyuppFargateClusterName,
    });

    // The fargete part

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

    new cdk.CfnOutput(this, 'AnyuppVpcSecurityGroupOutput', {
      value: vpc.vpcDefaultSecurityGroup,
    });

    new cdk.CfnOutput(this, 'AnyuppVpcSubnetOutput', {
      value: vpc.publicSubnets[0].subnetId,
    });

    new cdk.CfnOutput(this, 'AnyuppVpcIdOutput', {
      value: vpc.vpcId,
    });
  }
}

export default function main(app: App): void {
  new AnyuppCommonStack(app, 'anyupp');
}
