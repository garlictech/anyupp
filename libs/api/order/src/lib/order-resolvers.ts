import {
  GraphqlApi,
  LambdaDataSource,
  MappingTemplate,
} from '@aws-cdk/aws-appsync';
import { Construct } from '@aws-cdk/core';

/**
 *
 * @param scope usually the stack itself so set `this` as value of this param
 */
export const createOrderResolvers = ({
  scope,
  api,
  lambdaDs,
}: {
  scope: Construct;
  api: GraphqlApi;
  lambdaDs: LambdaDataSource;
}): void => {
  lambdaDs.createResolver({
    typeName: 'Mutation',
    fieldName: 'createOrderFromCart',
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
  });
};
