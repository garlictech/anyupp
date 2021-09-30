import { LambdaDataSource, MappingTemplate } from '@aws-cdk/aws-appsync';
import { getAuthenticatedUserIdFromContextIdentity } from '../../resolver-mapping-templates';

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
          "arguments": {
            "userId": ${getAuthenticatedUserIdFromContextIdentity},
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
          "arguments": {
            "userId": ${getAuthenticatedUserIdFromContextIdentity},
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
          "fieldName": "createStripeCard",
          "payload": {
            "userId": ${getAuthenticatedUserIdFromContextIdentity},
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
          "fieldName": "deleteMyStripeCard",
          "payload": {
            "userId": ${getAuthenticatedUserIdFromContextIdentity},
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
          "fieldName": "updateMyStripeCard",
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

// import {
//   GraphqlApi,
//   MappingTemplate,
//   Resolver,
//   DynamoDbDataSource,
//   LambdaDataSource,
// } from '@aws-cdk/aws-appsync';
// import { Construct } from '@aws-cdk/core';
// import {
//   StripeResolverFunctions,
//   createStripeResolverFunctions,
// } from './stripe-resolver-functions';
// import * as vtl from '../../resolver-mapping-templates';

// /**
//  *
//  * @param scope usually the stack itself so set `this` as value of this param
//  */
// export const createStripeResolvers = ({
//   scope,
//   api,
//   userTableDDDs,
//   orderTableDDDs,
//   lambdaDs,
// }: {
//   scope: Construct;
//   api: GraphqlApi;
//   userTableDDDs: DynamoDbDataSource;
//   orderTableDDDs: DynamoDbDataSource;
//   lambdaDs: LambdaDataSource;
// }): void => {
//   const stripeResolverFunctions: StripeResolverFunctions = createStripeResolverFunctions(
//     {
//       userTableDDDs,
//       orderTableDDDs,
//       lambdaDs,
//     },
//   );

//   new Resolver(scope, 'getMyStripeCards', {
//     api,
//     typeName: 'Query',
//     fieldName: 'getMyStripeCards',
//     requestMappingTemplate: MappingTemplate.fromString('{}'),
//     pipelineConfig: [
//       stripeResolverFunctions.getStripeCustomerId,
//       stripeResolverFunctions.getStripeCardsForStripeCustomer,
//     ],
//     responseMappingTemplate: MappingTemplate.fromString(
//       vtl.commonResponseMappingTemplateWithErrorPassthrough,
//     ),
//   });

//   new Resolver(scope, 'updateMyStripeCard', {
//     api,
//     typeName: 'Mutation',
//     fieldName: 'updateMyStripeCard',
//     requestMappingTemplate: MappingTemplate.fromString('{}'),
//     pipelineConfig: [
//       stripeResolverFunctions.getStripeCustomerId,
//       stripeResolverFunctions.updateStripeCard,
//     ],
//     responseMappingTemplate: MappingTemplate.fromString(
//       vtl.commonResponseMappingTemplateWithErrorPassthrough,
//     ),
//   });

//   new Resolver(scope, 'deleteMyStripeCard', {
//     api,
//     typeName: 'Mutation',
//     fieldName: 'deleteMyStripeCard',
//     requestMappingTemplate: MappingTemplate.fromString('{}'),
//     pipelineConfig: [
//       stripeResolverFunctions.getStripeCustomerId,
//       stripeResolverFunctions.deleteStripeCard,
//     ],
//     responseMappingTemplate: MappingTemplate.fromString(
//       vtl.commonResponseMappingTemplateWithErrorPassthrough,
//     ),
//   });

//   new Resolver(scope, 'startStripePayment', {
//     api,
//     typeName: 'Mutation',
//     fieldName: 'startStripePayment',
//     requestMappingTemplate: MappingTemplate.fromString('{}'),
//     pipelineConfig: [
//       stripeResolverFunctions.getStripeCustomerId,
//       // stripeResolverFunctions.getStripeCardsForStripeCustomer,
//     ],
//     responseMappingTemplate: MappingTemplate.fromString(
//       vtl.commonResponseMappingTemplateWithErrorPassthrough,
//     ),
//   });
// };
