import { LambdaDataSource, MappingTemplate } from '@aws-cdk/aws-appsync';

const createMutationResolver = (fieldName: string) => ({
  typeName: 'Mutation',
  fieldName,
  requestMappingTemplate: MappingTemplate.fromString(
    `
      {
        "version" : "2017-02-28",
        "operation" : "Invoke",
        "payload": {
          "typeName": "Mutation",
          "fieldName": "${fieldName}",
          "arguments": $util.toJson($ctx.arguments)
        }
      }
      `,
  ),
});

export const createProductResolvers = ({
  lambdaDs,
}: {
  lambdaDs: LambdaDataSource;
}): void => {
  lambdaDs.createResolver(createMutationResolver('updateChainProduct'));
  lambdaDs.createResolver(createMutationResolver('updateGroupProduct'));
  lambdaDs.createResolver(createMutationResolver('createUnitProduct'));
  lambdaDs.createResolver(createMutationResolver('updateUnitProduct'));
  lambdaDs.createResolver(createMutationResolver('deleteUnitProduct'));
};
