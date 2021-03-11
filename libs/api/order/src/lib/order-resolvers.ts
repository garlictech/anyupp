import {
  GraphqlApi,
  MappingTemplate,
  Resolver,
  LambdaDataSource,
} from '@aws-cdk/aws-appsync';
import { Construct } from '@aws-cdk/core';
import {
  createOrderResolverFunctions,
  OrderResolverFunctions,
} from './order-resolver-functions';
import * as vtl from '@bgap/api/graphql/resolver-mapping-templates';

/**
 *
 * @param scope usually the stack itself so set `this` as value of this param
 */
export const createOrderResolvers = ({
  scope,
  api,
  // userTableDDDs,
  // orderTableDDDs,
  lambdaDs,
}: {
  scope: Construct;
  api: GraphqlApi;
  // userTableDDDs: DynamoDbDataSource;
  // orderTableDDDs: DynamoDbDataSource;
  lambdaDs: LambdaDataSource;
}): void => {
  const orderResolverFunctions: OrderResolverFunctions = createOrderResolverFunctions(
    {
      // orderTableDDDs,
      lambdaDs,
    },
  );

  new Resolver(scope, 'createOrderFromCart', {
    api,
    typeName: 'Mutation',
    fieldName: 'createOrderFromCart',
    requestMappingTemplate: MappingTemplate.fromString('{}'),
    pipelineConfig: [orderResolverFunctions.createOrderFromCart],
    responseMappingTemplate: MappingTemplate.fromString(
      vtl.commonResponseMappingTemplateWithErrorPassthrough,
    ),
  });
};
