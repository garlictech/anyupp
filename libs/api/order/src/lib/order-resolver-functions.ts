import {
  MappingTemplate,
  AppsyncFunction,
  // DynamoDbDataSource,
  LambdaDataSource,
} from '@aws-cdk/aws-appsync';

export interface OrderResolverFunctions {
  createOrderFromCart: AppsyncFunction;
}

export const createOrderResolverFunctions = ({
  // orderTableDDDs,
  lambdaDs,
}: {
  // orderTableDDDs: DynamoDbDataSource;
  lambdaDs: LambdaDataSource;
}): OrderResolverFunctions => ({
  createOrderFromCart: lambdaDs.createFunction({
    name: 'createOrderFromCart',
    description: 'Create Order from the given cart for the authenticated user',
    requestMappingTemplate: MappingTemplate.fromString(
      `
      {
        "version" : "2017-02-28",
        "operation" : "Invoke",
        "payload": {
          "handler": "createOrderFromCart",
          "payload": {
            "userId": $util.toJson($ctx.identity.sub),
            "input": $util.toJson($ctx.arguments.input)
          }
        }
      }
      `,
    ),
  }),
});
