// import * as path from 'path';
// import * as cognito from '@aws-cdk/aws-cognito';
// import * as iam from '@aws-cdk/aws-iam';
// import * as lambda from '@aws-cdk/aws-lambda';
// import { Duration } from '@aws-cdk/core';
// import {
//   AwsCustomResource,
//   AwsCustomResourcePolicy,
//   AwsSdkCall,
// } from '@aws-cdk/custom-resources';
// import * as sst from '@serverless-stack/resources';

// // import { DynamoDBStack } from '../appsync-dynamodb-stack';
// import { commonLambdaProps } from '../lambda-common';

// export interface DynamoDBSeederStackProps extends sst.StackProps {
//   // dynamoDBStack: DynamoDBStack;
//   userPool: cognito.UserPool;
// }

export interface SeederLambdaInvokeArgs {
  mode: 'create' | 'update' | 'delete';
  tableNames: {
    order: string;
    user: string;
    group: string;
    unit: string;
    unitProduct: string;
  };
  userPoolId: string;
}

// export interface ItemKey {
//   [key: string]: string | number;
// }

export interface Item {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

// export class DynamoDBSeederStack extends sst.Stack {
//   constructor(scope: sst.App, id: string, props: DynamoDBSeederStackProps) {
//     super(scope, id, props);

//     const handlerLambda = new lambda.Function(this, 'handler', {
//       ...commonLambdaProps,
//       // It must be relative to the serverless.yml file
//       handler: 'lib/lambda/dynamodb-seeder/index.handler',
//       timeout: Duration.seconds(900),
//       code: lambda.Code.fromAsset(
//         path.join(__dirname, '../../.serverless/dynamodb-seeder.zip'),
//       ),
//       initialPolicy: [
//         new iam.PolicyStatement({
//           actions: ['s3:GetObject*'],
//           resources: ['*'],
//         }),
//         new iam.PolicyStatement({
//           actions: ['dynamodb:BatchWriteItem'],
//           resources: ['arn:aws:dynamodb:*:568276182587:table/*'],
//         }),
//         new iam.PolicyStatement({
//           actions: ['cognito-idp:AdminCreateUser'],
//           resources: ['arn:aws:cognito-idp:*:568276182587:userpool/*'],
//         }),
//       ],
//     });

//     const lambdaInvokeArgs: SeederLambdaInvokeArgs = {
//       mode: 'create',
//       tableNames: {
//         user: props.dynamoDBStack.userTable.tableName,
//         order: props.dynamoDBStack.orderTable.tableName,
//         unit: props.dynamoDBStack.unitTable.tableName,
//         group: props.dynamoDBStack.groupTable.tableName,
//         unitProduct: props.dynamoDBStack.unitProductTable.tableName,
//       },
//       userPoolId: props.userPool.userPoolId,
//     };

//     const onEvent = new AwsCustomResource(this, 'on-event', {
//       onCreate: {
//         ...this.callLambdaOptions(),
//         parameters: {
//           FunctionName: handlerLambda.functionArn,
//           InvokeArgs: JSON.stringify(lambdaInvokeArgs),
//         },
//       },
//       // onDelete: {
//       //   ...this.callLambdaOptions(props.dynamoDBStack.userTable.tableArn),
//       //   parameters: {
//       //     FunctionName: handlerLambda.functionArn,
//       //     InvokeArgs: JSON.stringify({
//       //       ...lambdaInvokeArgs,
//       //       mode: 'delete',
//       //     }),
//       //   },
//       // },
//       // TODO: update somehowe not gets triggered
//       onUpdate: {
//         ...this.callLambdaOptions(),
//         parameters: {
//           FunctionName: handlerLambda.functionArn,
//           InvokeArgs: JSON.stringify({
//             ...lambdaInvokeArgs,
//             mode: 'update',
//           }),
//         },
//       },
//       policy: AwsCustomResourcePolicy.fromSdkCalls({
//         resources: AwsCustomResourcePolicy.ANY_RESOURCE,
//       }),
//     });
//     handlerLambda.grantInvoke(onEvent);
//   }

//   private callLambdaOptions(): AwsSdkCall {
//     return {
//       service: 'Lambda',
//       action: 'invokeAsync',
//       apiVersion: '2015-03-31',
//       physicalResourceId: {
//         id: `seeder`,
//       },
//     };
//   }
// }
