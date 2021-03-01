import {
  NoneDataSource,
  MappingTemplate,
  AppsyncFunction,
  DynamoDbDataSource,
  LambdaDataSource,
} from '@aws-cdk/aws-appsync';

export interface StripeResolverFunctions {
  getStripeCustomerId: AppsyncFunction;
  getStripeCardsForStripeCustomer: AppsyncFunction;
}

export const createStripeResolverFunctions = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  noneDs,
  userTableDDDs,
  lambdaDs,
}: {
  noneDs: NoneDataSource;
  userTableDDDs: DynamoDbDataSource;
  lambdaDs: LambdaDataSource;
}): StripeResolverFunctions => ({
  getStripeCustomerId: userTableDDDs.createFunction({
    name: 'getStripeCustomeridForAuthenticatedUser',
    description:
      'get the stripe customer id for the currently authenticated user',
    requestMappingTemplate: MappingTemplate.fromString(
      `
      {
        "operation": "GetItem",
        "key": {
            "id": $util.dynamodb.toDynamoDBJson($ctx.identity.sub),
        }
       }
      `,
    ),
    responseMappingTemplate: MappingTemplate.fromString(
      '$util.toJson($ctx.result.stripeCustomerId)',
    ),
  }),
  getStripeCardsForStripeCustomer: lambdaDs.createFunction({
    name: 'getStripeCardsForCustomer',
    description: 'get the Stripe cards for the given Stripe customerId',
    requestMappingTemplate: MappingTemplate.fromString(
      `
      {
        "version" : "2017-02-28",
        "operation" : "Invoke",
        "payload": {
          "handler": "getStripeCardsForCustomer",
          "payload": {
            "stripeCustomerId": $util.toJson($ctx.prev.result)
          }
        }
      }
      `,
    ),
  }),
});
