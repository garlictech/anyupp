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
  updateStripeCard: AppsyncFunction;
  deleteStripeCard: AppsyncFunction;
  startStripePayment: AppsyncFunction;
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
      `
      $util.qr($ctx.stash.put("stripeCustomerId", $ctx.result.stripeCustomerId))
      {} ## make sure you add this at the end to prevent the empty template response error
      `,
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
            "stripeCustomerId": $util.toJson($ctx.stash.stripeCustomerId)
          }
        }
      }
      `,
    ),
  }),

  updateStripeCard: lambdaDs.createFunction({
    name: 'updateStripeCard',
    description: 'update a Stripe card for the given Stripe customerId',
    requestMappingTemplate: MappingTemplate.fromString(
      `
      {
        "version" : "2017-02-28",
        "operation" : "Invoke",
        "payload": {
          "handler": "updateStripeCard",
          "payload": {
            "stripeCustomerId": $util.toJson($ctx.stash.stripeCustomerId),
            "input": $util.toJson($ctx.arguments.input)
          }
        }
      }
      `,
    ),
  }),

  deleteStripeCard: lambdaDs.createFunction({
    name: 'deleteStripeCard',
    description: 'delete a Stripe card for the given Stripe customerId',
    requestMappingTemplate: MappingTemplate.fromString(
      `
      {
        "version" : "2017-02-28",
        "operation" : "Invoke",
        "payload": {
          "handler": "deleteStripeCard",
          "payload": {
            "stripeCustomerId": $util.toJson($ctx.stash.stripeCustomerId),
            "input": $util.toJson($ctx.arguments.input)
          }
        }
      }
      `,
    ),
  }),

  startStripePayment: lambdaDs.createFunction({
    name: 'startStripePayment',
    description: 'get the Stripe cards for the given Stripe customerId',
    requestMappingTemplate: MappingTemplate.fromString(
      `
      {
        "version" : "2017-02-28",
        "operation" : "Invoke",
        "payload": {
          "handler": "getStripeCardsForCustomer",
          "payload": {
            "stripeCustomerId": $util.toJson($ctx.stash.stripeCustomerId),
            "input": $util.toJson($ctx.arguments.input)
          }
        }
      }
      `,
    ),
  }),
});
