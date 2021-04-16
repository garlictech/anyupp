import { LambdaDataSource, MappingTemplate } from '@aws-cdk/aws-appsync';

export const createUnitResolvers = ({
  lambdaDs,
}: {
  lambdaDs: LambdaDataSource;
}) => {
  lambdaDs.createResolver({
    typeName: 'Query',
    fieldName: 'getUnitsNearLocation',
    requestMappingTemplate: MappingTemplate.fromString(
      `
      {
        "version" : "2017-02-28",
        "operation" : "Invoke",
        "payload": {
          "handler": "getUnitsNearLocation",
          "payload": {
            "input": $util.toJson($ctx.arguments.input)
          }
        }
      }
      `,
    ),
  });
};
