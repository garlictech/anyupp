import { aws_iam, aws_logs } from 'aws-cdk-lib';
import { App, Stack, StackProps } from '@serverless-stack/resources';

export interface OpenSearchCustomStackProps extends StackProps {
  openSearchArn: string;
}

export class OpenSearchCustomStack extends Stack {
  constructor(scope: App, id: string, props: OpenSearchCustomStackProps) {
    super(scope, id);

    const openSearchDomainName = props.openSearchArn.split('/')[1];

    const slowLogs = new aws_logs.LogGroup(this, 'OsSSearchSlowLogsGroup', {
      logGroupName: `/aws/aes/domains/${openSearchDomainName}/search-slow-logs`,
    });

    const indexLogs = new aws_logs.LogGroup(this, 'OsIndexSlowLOgsGroup', {
      logGroupName: `/aws/aes/domains/${openSearchDomainName}/index-slow-logs`,
    });

    const policyStatement = new aws_iam.PolicyStatement({
      actions: [
        'logs:PutLogEvents',
        'logs:PutLogEventsBatch',
        'logs:CreateLogStream',
      ],
      principals: [new aws_iam.ServicePrincipal('es.amazonaws.com')],
      resources: [slowLogs.logGroupArn, indexLogs.logGroupArn],
    });

    slowLogs.addToResourcePolicy(policyStatement);
    indexLogs.addToResourcePolicy(policyStatement);
  }
}
