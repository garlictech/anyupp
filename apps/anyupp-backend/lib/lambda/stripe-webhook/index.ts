import { Handler } from 'aws-lambda';

console.log('Starting Stripe API lambda');

import awsServerlessExpress from 'aws-serverless-express';
// import app from '@bgap/stripe'
// import app from './app';
import {
  createStripeClient,
  createStripeWebhookExpressApp,
  createSzamlazzClient,
} from '@bgap/anyupp-gql/backend';

if (!process.env.SZAMLAZZ_HU_AGENT_KEY) {
  throw Error(
    'SzamlazzHu agent key not found in lambda environment. Add itt with the name SZAMLAZZ_HU_AGENT_KEY',
  );
}
if (!process.env.STRIPE_SECRET_KEY) {
  throw Error(
    'Stripe secret key not found in lambda environment. Add itt with the name STRIPE_SECRET_KEY',
  );
}

const szamlazzClient = createSzamlazzClient(process.env.SZAMLAZZ_HU_AGENT_KEY);
const stripeClient = createStripeClient(process.env.STRIPE_SECRET_KEY);

const app = createStripeWebhookExpressApp(szamlazzClient, stripeClient);
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

export const handler: Handler = async (event, context) => {
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
