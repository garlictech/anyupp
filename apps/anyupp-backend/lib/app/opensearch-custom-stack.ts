import { aws_logs } from 'aws-cdk-lib';
import * as sst from '@serverless-stack/resources';
import { StackProps } from '@serverless-stack/resources';

export interface OpenSearchCustomStackProps extends StackProps {
  openSearchArn: string;
}

export class OpenSearchCustomStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props: OpenSearchCustomStackProps) {
    super(scope, id);

    const openSearchDomainName = props.openSearchArn.split('/')[1];

    new aws_logs.LogGroup(this, 'OsSSearchSlowLogsGroup', {
      logGroupName: `/aws/aes/domains/${openSearchDomainName}/search-slow-logs`,
    });

    new aws_logs.LogGroup(this, 'OsIndexSlowLOgsGroup', {
      logGroupName: `/aws/aes/domains/${openSearchDomainName}/index-slow-logs`,
    });
  }
}
