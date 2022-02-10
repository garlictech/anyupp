import { aws_ecs as ecs, aws_ec2 as ec2 } from 'aws-cdk-lib';
import * as sst from '@serverless-stack/resources';
import { anyuppFargateClusterName } from '@bgap/backend/shared/utils';

export interface FargateStackProps extends sst.StackProps {
  vpc: ec2.IVpc;
  securityGroupId: ec2.ISecurityGroup;
}

export class FargateStack extends sst.Stack {
  public cluster: ecs.ICluster;

  constructor(scope: sst.App, id: string, private props: FargateStackProps) {
    super(scope, id);

    this.cluster = ecs.Cluster.fromClusterAttributes(this, 'FargateCluster', {
      clusterName: anyuppFargateClusterName,
      vpc: this.props.vpc,
      securityGroups: [this.props.securityGroupId],
    });
  }
}
