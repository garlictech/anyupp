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
          "handler": "${fieldName}",
          "payload": {
            "input": $util.toJson($ctx.arguments.input)
          }
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
