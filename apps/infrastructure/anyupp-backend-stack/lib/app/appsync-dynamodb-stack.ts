import { Table } from '@aws-cdk/aws-dynamodb';
import * as sst from '@serverless-stack/resources';
import { TableConstruct } from './dynamodb-construct';

export class DynamoDBStack extends sst.Stack {
  public readonly adminUserTable: Table;

  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

    this.adminUserTable = new TableConstruct(this, 'AdminUser', {
      isStreamed: true
    }).theTable;
  }
}
