import { LambdaDataSource, MappingTemplate } from '@aws-cdk/aws-appsync-alpha';
import { getAuthenticatedUserIdFromContextIdentity } from '@bgap/anyupp-backend-lib';

export const createStripeResolvers = ({
  lambdaDs,
}: {
  lambdaDs: LambdaDataSource;
}): void => {
  // --- Create startStripePayment Mutation lambda resolves
  lambdaDs.createResolver({
    typeName: 'Mutation',
    fieldName: 'startStripePayment',
    requestMappingTemplate: MappingTemplate.fromString(
      `
      {
        "version" : "2017-02-28",
        "operation" : "Invoke",
        "payload": {
          "fieldName": "startStripePayment",
          "typeName": "Mutation",
          "identity": {
            "username": ${getAuthenticatedUserIdFromContextIdentity}
          },
          "arguments": {
            "input": $util.toJson($ctx.arguments.input)
          }
        }
      }
      `,
    ),
  });

  // --- Create listStripeCards Query lambda resolves
  lambdaDs.createResolver({
    typeName: 'Query',
    fieldName: 'listStripeCards',
    requestMappingTemplate: MappingTemplate.fromString(
      `
      {
        "version" : "2017-02-28",
        "operation" : "Invoke",
        "payload": {
          "fieldName": "listStripeCards",
          "typeName": "Query",
          "identity": {
            "username": ${getAuthenticatedUserIdFromContextIdentity}
          },
          "arguments": {
            "input": $util.toJson($ctx.arguments.input)
          }
        }
      }
      `,
    ),
  });

  lambdaDs.createResolver({
    typeName: 'Mutation',
    fieldName: 'createStripeCard',
    requestMappingTemplate: MappingTemplate.fromString(
      `
      {
        "version" : "2017-02-28",
        "operation" : "Invoke",
        "payload": {
          "typeName": "Mutation",
          "fieldName": "createStripeCard",
          "identity": {
            "username": ${getAuthenticatedUserIdFromContextIdentity}
          },
          "arguments": {
            "input": $util.toJson($ctx.arguments.input)
          }
        }
      }
      `,
    ),
  });

  lambdaDs.createResolver({
    typeName: 'Mutation',
    fieldName: 'deleteMyStripeCard',
    requestMappingTemplate: MappingTemplate.fromString(
      `
      {
        "version" : "2017-02-28",
        "operation" : "Invoke",
        "payload": {
          "typeName": "Mutation",
          "fieldName": "deleteMyStripeCard",
          "identity": {
            "username": ${getAuthenticatedUserIdFromContextIdentity}
          },
          "arguments": {
            "input": $util.toJson($ctx.arguments.input)
          }
        }
      }
      `,
    ),
  });

  lambdaDs.createResolver({
    typeName: 'Mutation',
    fieldName: 'updateMyStripeCard',
    requestMappingTemplate: MappingTemplate.fromString(
      `
      {
        "version" : "2017-02-28",
        "operation" : "Invoke",
        "payload": {
          "typeName": "Mutation",
          "fieldName": "updateMyStripeCard",
          "identity": {
            "username": ${getAuthenticatedUserIdFromContextIdentity}
          },
          "arguments": {
            "input": $util.toJson($ctx.arguments.input)
          }
        }
      }
      `,
    ),
  });
};
