import * as sst from '@serverless-stack/resources';
import { ITable } from '@aws-cdk/aws-dynamodb';
import { TableConstruct } from './dynamodb-construct';

export class DynamoDBStack extends sst.Stack {
  public userTable: ITable;
  public orderTable: ITable;
  public unitTable: ITable;
  public groupTable: ITable;
  public unitProductTable: ITable;
  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

    this.userTable = new TableConstruct(this, 'User', {
      isStreamed: true,
    }).theTable;
    this.orderTable = new TableConstruct(this, 'Order', {
      isStreamed: true,
    }).theTable;
    this.unitTable = new TableConstruct(this, 'Unit', {
      isStreamed: true,
    }).theTable;
    this.groupTable = new TableConstruct(this, 'Group', {
      isStreamed: true,
    }).theTable;
    this.unitProductTable = new TableConstruct(this, 'UnitProduct', {
      isStreamed: true,
    }).theTable;
  }
}
