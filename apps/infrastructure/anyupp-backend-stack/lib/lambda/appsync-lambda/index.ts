import { Context, Handler } from 'aws-lambda';

export const handler: Handler<string, string> = (
  name: string,
  _: Context
): Promise<string> => {
  console.log('Lambda called with ', name);
  return Promise.resolve(`Hellobello, ${name}`);
};
