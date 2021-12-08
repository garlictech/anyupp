import * as sst from '@serverless-stack/resources';
import * as ecs from '@aws-cdk/aws-ecs';
import * as ec2 from '@aws-cdk/aws-ec2';
import { anyuppFargateClusterName } from '@bgap/backend/shared/utils';

export interface FargateStackProps extends sst.StackProps {
  vpc: ec2.IVpc;
  securityGroup: ec2.ISecurityGroup;
}

export class FargateStack extends sst.Stack {
  public cluster: ecs.ICluster;

  constructor(scope: sst.App, id: string, private props: FargateStackProps) {
    super(scope, id);

    this.cluster = ecs.Cluster.fromClusterAttributes(this, 'FargateCluster', {
      clusterName: anyuppFargateClusterName,
      vpc: this.props.vpc,
      securityGroups: [this.props.securityGroup],
    });
  }
}
