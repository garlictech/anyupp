import {
  GraphqlApi,
  MappingTemplate,
  Resolver,
  DynamoDbDataSource,
  LambdaDataSource,
} from '@aws-cdk/aws-appsync';
import { Construct } from '@aws-cdk/core';
import {
  StripeResolverFunctions,
  createStripeResolverFunctions,
} from './stripe-resolver-functions';

/**
 *
 * @param scope usually the stack itself so set `this` as value of this param
 */
export const createStripeResolvers = ({
  scope,
  api,
  userTableDDDs,
  orderTableDDDs,
  lambdaDs,
}: {
  scope: Construct;
  api: GraphqlApi;
  userTableDDDs: DynamoDbDataSource;
  orderTableDDDs: DynamoDbDataSource;
  lambdaDs: LambdaDataSource;
}): void => {
  const stripeResolverFunctions: StripeResolverFunctions = createStripeResolverFunctions(
    {
      userTableDDDs,
      orderTableDDDs,
      lambdaDs,
    },
  );

  new Resolver(scope, 'getMyStripeCards', {
    api,
    typeName: 'Query',
    fieldName: 'getMyStripeCards',
    requestMappingTemplate: MappingTemplate.fromString('{}'),
    pipelineConfig: [
      stripeResolverFunctions.getStripeCustomerId,
      stripeResolverFunctions.getStripeCardsForStripeCustomer,
    ],
    responseMappingTemplate: MappingTemplate.fromFile(
      'lib/appsync/graphql-api/mapping-templates/common-response-mappint-template-with-error-passthrough.vtl',
    ),
  });

  new Resolver(scope, 'updateMyStripeCard', {
    api,
    typeName: 'Mutation',
    fieldName: 'updateMyStripeCard',
    requestMappingTemplate: MappingTemplate.fromString('{}'),
    pipelineConfig: [
      stripeResolverFunctions.getStripeCustomerId,
      stripeResolverFunctions.updateStripeCard,
    ],
    responseMappingTemplate: MappingTemplate.fromFile(
      'lib/appsync/graphql-api/mapping-templates/common-response-mappint-template-with-error-passthrough.vtl',
    ),
  });

  new Resolver(scope, 'deleteMyStripeCard', {
    api,
    typeName: 'Mutation',
    fieldName: 'deleteMyStripeCard',
    requestMappingTemplate: MappingTemplate.fromString('{}'),
    pipelineConfig: [
      stripeResolverFunctions.getStripeCustomerId,
      stripeResolverFunctions.deleteStripeCard,
    ],
    responseMappingTemplate: MappingTemplate.fromFile(
      'lib/appsync/graphql-api/mapping-templates/common-response-mappint-template-with-error-passthrough.vtl',
    ),
  });

  new Resolver(scope, 'startStripePayment', {
    api,
    typeName: 'Mutation',
    fieldName: 'startStripePayment',
    requestMappingTemplate: MappingTemplate.fromString('{}'),
    pipelineConfig: [
      stripeResolverFunctions.getStripeCustomerId,
      // stripeResolverFunctions.getStripeCardsForStripeCustomer,
    ],
    responseMappingTemplate: MappingTemplate.fromFile(
      'lib/appsync/graphql-api/mapping-templates/common-response-mappint-template-with-error-passthrough.vtl',
    ),
  });
};
