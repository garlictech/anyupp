import { Context, Handler } from 'aws-lambda';

console.log('Starting Stripe API lambda');

export interface StripeWebhookRequest {
  param: string;
}

export interface StripeWebhookResponse {
  status: string;
}

// Get the proper type from aws lambda lib
interface HttpLambdaEvent {
  queryStringParameters: StripeWebhookRequest;
}

export const handler: Handler = async (
  event: HttpLambdaEvent,
  context: Context,
) => {
  console.log('Stripe webhook called with ', event);
  // Validate the request, then...
  const param =
    event?.queryStringParameters?.param ||
    'https://media.giphy.com/media/20k1punZ5bpmM/giphy-downsized.gif';

  return {
    body: JSON.stringify({ status: `All good for ${param}` }),
    statusCode: 200,
  };
};
