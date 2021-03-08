import * as sst from '@serverless-stack/resources';
import { ITable } from '@aws-cdk/aws-dynamodb';
import { TableConstruct } from './dynamodb-construct';

export class DynamoDBStack extends sst.Stack {
  public userTable: ITable;
  public orderTable: ITable;
  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

    this.userTable = new TableConstruct(this, 'User', {
      isStreamed: true,
    }).theTable;
    this.orderTable = new TableConstruct(this, 'Order', {
      isStreamed: true,
    }).theTable;
  }
}
