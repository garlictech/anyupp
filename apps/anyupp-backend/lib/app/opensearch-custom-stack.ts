import { aws_iam, aws_logs } from 'aws-cdk-lib';
import { App, Stack, StackProps } from '@serverless-stack/resources';

export interface OpenSearchCustomStackProps extends StackProps {
  openSearchArn: string;
}

/**
 * The Amplify managed OpenSearch cluster requires these log groups in order
 * to be able to log slow search queries and slow indexes
 *
 * NOTE: The log group association with the OS domain is a destructive process despite
 * what the documentation says. Thus setting the logpublishing options are
 * done via `amplify override api`
 * https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticsearch-domain.html#cfn-elasticsearch-domain-logpublishingoptions
 */
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
