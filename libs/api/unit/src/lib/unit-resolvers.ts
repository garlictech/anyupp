import { LambdaDataSource, MappingTemplate } from '@aws-cdk/aws-appsync';

export const createAdminUserResolvers = ({
  lambdaDs,
}: {
  lambdaDs: LambdaDataSource;
}) => {
  lambdaDs.createResolver({
    typeName: 'Query',
    fieldName: 'getUnitsInRadius',
    requestMappingTemplate: MappingTemplate.fromString(
      `
      {
        "version" : "2017-02-28",
        "operation" : "Invoke",
        "payload": {
          "handler": "getUnitsInRadius",
          "payload": {
            "input": $util.toJson($ctx.arguments.input)
          }
        }
      }
      `,
    ),
  });
};
