import { LambdaDataSource, MappingTemplate } from '@aws-cdk/aws-appsync';

export const createUserResolvers = ({
  lambdaDs,
}: {
  lambdaDs: LambdaDataSource;
}) => {
  lambdaDs.createResolver({
    typeName: 'Mutation',
    fieldName: 'createAnonymUser',
    requestMappingTemplate: MappingTemplate.fromString(
      `
    {
      "version" : "2017-02-28",
      "operation" : "Invoke",
      "payload": {
        "typeName": "Mutation",
        "fieldName": "createAnonymUser"
      }
    }
    `,
    ),
    responseMappingTemplate: MappingTemplate.fromString(
      '$util.toJson($context.result)',
    ),
  });
};
