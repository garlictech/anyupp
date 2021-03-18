import * as sst from '@serverless-stack/resources';

export class DynamoDBStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);
  }
}
