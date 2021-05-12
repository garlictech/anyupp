import { Handler } from 'aws-lambda';

console.log('Starting Stripe API lambda');

import awsServerlessExpress from 'aws-serverless-express';
// import app from '@bgap/stripe'
// import app from './app';
import { createStripeWebhookExpressApp } from '@bgap/anyupp-gql/backend';
const app = createStripeWebhookExpressApp();

const server = awsServerlessExpress.createServer(app);

// export interface StripeWebhookRequest {
//   param: string;
// }

// export interface StripeWebhookResponse {
//   status: string;
// }

// // Get the proper type from aws lambda lib
// interface HttpLambdaEvent {
//   queryStringParameters: StripeWebhookRequest;
// }

export const handler: Handler = async (
  event,
  context,
) => {
  console.log('Stripe webhook called with ', event);
  return awsServerlessExpress.proxy(server, event, context, 'PROMISE').promise;

  // Validate the request, then...
  // const param =
  //   event?.queryStringParameters?.param ||
  //   'https://media.giphy.com/media/20k1punZ5bpmM/giphy-downsized.gif';
//
  // return {
  //   body: JSON.stringify({ status: `All good for ${param}` }),
  //   statusCode: 200,
  // };
};
