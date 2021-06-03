import { SNSEvent } from 'aws-lambda';

export const handler = async (event: SNSEvent) => {
  console.debug('ROUTE53 handler event:', JSON.stringify(event, null, 2));

  console.log('SNS event: ', event.Records[0].Sns.Message);
  return 1;
};
