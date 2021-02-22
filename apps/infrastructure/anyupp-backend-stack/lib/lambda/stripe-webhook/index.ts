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
lofasz;
export const handler: Handler = async (
  event: HttpLambdaEvent,
  context: Context,
): Promise<unknown> => {
  console.log('Stripe webhook called with ', event);
  // Validate the request, then...
  const param =
    event?.queryStringParameters?.param ||
    'https://media.giphy.com/media/20k1punZ5bpmM/giphy-downsized.gif';

  console.log('***1', param);

  console.log('*****2', {
    body: JSON.stringify({ status: `All good for ${param}` }),
    bodyEncoding: 'text',
    statusCode: '200',
  });

  return Promise.resolve({
    body: JSON.stringify({ status: `All good for ${param}` }),
    bodyEncoding: 'text',
    statusCode: 200,
  });
};
