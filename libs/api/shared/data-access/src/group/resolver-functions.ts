import {
  MappingTemplate,
  AppsyncFunction,
  DynamoDbDataSource,
} from '@aws-cdk/aws-appsync';

export interface GroupResolverFunctions {
  getGroupById: AppsyncFunction;
}

export const createGroupResolverFunctions = ({
  groupTableDDDs,
}: {
  groupTableDDDs: DynamoDbDataSource;
}): GroupResolverFunctions => ({
  getGroupById: groupTableDDDs.createFunction({
    name: 'getGroupById',
    description: 'Get group by id',
    requestMappingTemplate: MappingTemplate.fromString(
      `
      {
        "operation": "GetItem",
        "key": {
            "id": $util.dynamodb.toDynamoDBJson($ctx.stash.groupId),
        }
       }
      `,
    ),
    responseMappingTemplate: MappingTemplate.fromString(
      `
      #if(!$ctx.result)
          $util.error('Group is missing')
      #end

      $util.qr($ctx.stash.put("group", $ctx.result))
      $util.qr($ctx.stash.put("chainId", $ctx.result.chainId))
      {} ## make sure you add this at the end to prevent the empty template response error `,
    ),
  }),
});
