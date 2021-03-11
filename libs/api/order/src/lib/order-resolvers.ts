import {
  GraphqlApi,
  MappingTemplate,
  Resolver,
  LambdaDataSource,
  DynamoDbDataSource,
} from '@aws-cdk/aws-appsync';
import { Construct } from '@aws-cdk/core';
import {
  createOrderResolverFunctions,
  OrderResolverFunctions,
} from './order-resolver-functions';
import * as vtl from '@bgap/api/graphql/resolver-mapping-templates';
import {
  UnitResolverFunctions,
  createUnitResolverFunctions,
  GroupResolverFunctions,
  createGroupResolverFunctions,
} from '@bgap/api/shared/data-access';

/**
 *
 * @param scope usually the stack itself so set `this` as value of this param
 */
export const createOrderResolvers = ({
  scope,
  api,
  groupTableDDDs,
  unitTableDDDs,
  lambdaDs,
}: {
  scope: Construct;
  api: GraphqlApi;
  groupTableDDDs: DynamoDbDataSource;
  unitTableDDDs: DynamoDbDataSource;
  lambdaDs: LambdaDataSource;
}): void => {
  const orderResolverFunctions: OrderResolverFunctions = createOrderResolverFunctions(
    {
      lambdaDs,
    },
  );
  const unitResolverFunctions: UnitResolverFunctions = createUnitResolverFunctions(
    {
      unitTableDDDs,
    },
  );
  const groupResolverFunctions: GroupResolverFunctions = createGroupResolverFunctions(
    {
      groupTableDDDs,
    },
  );

  new Resolver(scope, 'createOrderFromCart', {
    api,
    typeName: 'Mutation',
    fieldName: 'createOrderFromCart',
    requestMappingTemplate: MappingTemplate.fromString(
      `
        $util.qr($ctx.stash.put("unitId", $ctx.arguments.input.unitId))
        {} ## make sure you add this at the end to prevent the empty template response error
      `,
    ),
    pipelineConfig: [
      unitResolverFunctions.getUnitById,
      groupResolverFunctions.getGroupById,
      orderResolverFunctions.createOrderFromCart,
    ],
    responseMappingTemplate: MappingTemplate.fromString(
      vtl.commonResponseMappingTemplateWithErrorPassthrough,
    ),
  });
};
