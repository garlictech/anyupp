import { LambdaDataSource, MappingTemplate } from '@aws-cdk/aws-appsync';

export const createProductResolvers = ({
  lambdaDs,
}: {
  lambdaDs: LambdaDataSource;
}): void => {
  lambdaDs.createResolver({
    typeName: 'Mutation',
    fieldName: 'createUnitProduct',
    requestMappingTemplate: MappingTemplate.fromString(
      `
      {
        "version" : "2017-02-28",
        "operation" : "Invoke",
        "payload": {
          "handler": "createUnitProduct",
          "payload": {
            "userId": $util.toJson($ctx.identity.claims.get("cognito:username")),
            "input": $util.toJson($ctx.arguments.input)
          }
        }
      }
      `,
    ),
  });
};
