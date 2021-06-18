import { LambdaDataSource, MappingTemplate } from '@aws-cdk/aws-appsync';
import { getAuthenticatedUserIdFromContextIdentity } from '../../resolver-mapping-templates';

export const createOrderResolvers = ({
  lambdaDs,
}: {
  lambdaDs: LambdaDataSource;
}): void => {
  lambdaDs.createResolver({
    typeName: 'Mutation',
    fieldName: 'createOrderFromCart',
    requestMappingTemplate: MappingTemplate.fromString(
      `
      {
        "version" : "2017-02-28",
        "operation" : "Invoke",
        "payload": {
          "handler": "createOrderFromCart",
          "payload": {
            "userId": ${getAuthenticatedUserIdFromContextIdentity},
            "input": $util.toJson($ctx.arguments.input)
          }
        }
      }
      `,
    ),
  });
};
