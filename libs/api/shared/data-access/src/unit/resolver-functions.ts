import {
  MappingTemplate,
  AppsyncFunction,
  DynamoDbDataSource,
} from '@aws-cdk/aws-appsync';

export interface UnitResolverFunctions {
  getUnitById: AppsyncFunction;
}

export const createUnitResolverFunctions = ({
  unitTableDDDs,
}: {
  unitTableDDDs: DynamoDbDataSource;
}): UnitResolverFunctions => ({
  getUnitById: unitTableDDDs.createFunction({
    name: 'getUnitById',
    description: 'Get unit by id',
    requestMappingTemplate: MappingTemplate.fromString(
      `
      {
        "operation": "GetItem",
        "key": {
            "id": $util.dynamodb.toDynamoDBJson($ctx.stash.unitId),
        }
       }
      `,
    ),
    responseMappingTemplate: MappingTemplate.fromString(
      `
      #if(!$ctx.result)
          $util.error('Unit is missing')
      #end

      $util.qr($ctx.stash.put("unit", $ctx.result))
      $util.qr($ctx.stash.put("groupId", $ctx.result.groupId))
      $util.qr($ctx.stash.put("chainId", $ctx.result.chainId))
      {} ## make sure you add this at the end to prevent the empty template response error `,
    ),
  }),
});
