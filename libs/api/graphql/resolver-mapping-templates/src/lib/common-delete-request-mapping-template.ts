export const commonDeleteRequestMappingTemplate = `
{
  "version" : "2017-02-28",
  "operation" : "DeleteItem",
  "key": {
    "id": $util.dynamodb.toDynamoDBJson($context.arguments.id)
  }
}
`;
