import AWS from 'aws-sdk';

// Creates a dynamodb update expression for Document Client.
// Assumes, that the key name is id...
export const createUpdateParams = (
  TableName: string,
  id: string,
  item: Record<string, unknown>,
): AWS.DynamoDB.UpdateItemInput => ({
  TableName,
  Key: { id: { S: id } },
  UpdateExpression:
    'set ' +
    Object.keys(item)
      .map(k => `#${k} = :${k}`)
      .join(', '),
  ExpressionAttributeNames: Object.entries(item).reduce(
    (acc, cur) => ({ ...acc, [`#${cur[0]}`]: cur[0] }),
    {},
  ),
  ExpressionAttributeValues: Object.entries(item).reduce(
    (acc, cur) => ({ ...acc, [`:${cur[0]}`]: cur[1] }),
    {},
  ),
});
