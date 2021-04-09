import { LambdaDataSource, MappingTemplate } from '@aws-cdk/aws-appsync';

export const createAdminUserResolvers = ({
  lambdaDs,
}: {
  lambdaDs: LambdaDataSource;
}) => {
  ['createAdminUser', 'deleteAdminUser'].forEach(fieldName =>
    lambdaDs.createResolver({
      typeName: 'Mutation',
      fieldName,
      requestMappingTemplate: MappingTemplate.fromString(
        `
    {
      "version" : "2017-02-28",
      "operation" : "Invoke",
      "payload": {

        "handler": "${fieldName}",
        "payload": $util.toJson($ctx.arguments)
      }
    }
    `,
      ),
      responseMappingTemplate: MappingTemplate.fromString(
        '$util.toJson($context.result)',
      ),
    }),
  );
};
