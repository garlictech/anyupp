import * as sst from '@serverless-stack/resources';
import {
  CfnOutput,
  RemovalPolicy,
  aws_dynamodb as dynamodb,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';

export interface AnyUppTableProps {
  isStreamed?: boolean;
  primaryKeyName?: string;
}

export class TableConstruct extends Construct {
  public readonly theTable: dynamodb.Table;

  constructor(scope: Construct, id: string, props?: AnyUppTableProps) {
    super(scope, id);
    const app = this.node.root as sst.App;

    const tableProps: dynamodb.TableProps = {
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST, // Use on-demand billing mode
      partitionKey: {
        name: (props && props.primaryKeyName) || 'id',
        type: dynamodb.AttributeType.STRING,
      },
      removalPolicy: RemovalPolicy.DESTROY,
      stream:
        props && props.isStreamed
          ? dynamodb.StreamViewType.NEW_AND_OLD_IMAGES
          : undefined,
    };

    this.theTable = new dynamodb.Table(this, id, tableProps);

    // Output values
    const tableName = id + 'TableName';
    new CfnOutput(this, tableName, {
      value: this.theTable.tableName,
      exportName: app.logicalPrefixedName(tableName),
    });

    const tableArn = id + 'TableArn';
    new CfnOutput(this, tableArn, {
      value: this.theTable.tableArn,
      exportName: app.logicalPrefixedName(tableArn),
    });
  }
}
