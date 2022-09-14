import { aws_iam as iam } from 'aws-cdk-lib';
import { AwsCustomResource, AwsSdkCall } from 'aws-cdk-lib/custom-resources';
import { Construct } from 'constructs';

interface SSMParameterReaderProps {
  parameterName: string;
  region: string;
  account: string;
}

/**
 * This custom resource is to fetch a secret parameter value.
 */
export class SSMParameterReader extends AwsCustomResource {
  constructor(scope: Construct, name: string, props: SSMParameterReaderProps) {
    const { parameterName, region, account } = props;

    const ssmAwsSdkCall: AwsSdkCall = {
      service: 'SSM',
      action: 'getParameter',
      parameters: {
        Name: parameterName,
      },
      region,
      physicalResourceId: { id: Date.now().toString() }, // Update physical id to always fetch the latest version
    };

    super(scope, name, {
      onUpdate: ssmAwsSdkCall,
      policy: {
        statements: [
          new iam.PolicyStatement({
            resources: [
              `arn:aws:ssm:${region}:${account}:parameter/${parameterName}`,
            ],
            actions: ['ssm:GetParameter'],
            effect: iam.Effect.ALLOW,
          }),
        ],
      },
    });
  }

  public getParameterValue(): string {
    return this.getResponseField('Parameter.Value').toString();
  }
}
