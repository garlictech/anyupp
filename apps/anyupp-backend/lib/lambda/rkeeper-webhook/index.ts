import awsLambdaFastify from '@fastify/aws-lambda';
import * as fastify from 'fastify';
import { menusyncHandler, orderStatusHandler } from '@bgap/rkeeper-api';
import { getCrudSdkForIAM } from '@bgap/crud-gql/api';

const app = fastify.fastify({
  logger: true,
});

const awsAccesskeyId = process.env.API_ACCESS_KEY_ID || '';
const awsSecretAccessKey = process.env.API_SECRET_ACCESS_KEY || '';
const anyuppSdk = getCrudSdkForIAM(awsAccesskeyId, awsSecretAccessKey);

app.route({
  method: 'POST',
  url: '/:externalUnitId/menusync',
  handler: menusyncHandler(anyuppSdk),
});

app.route({
  method: 'POST',
  url: '/:externalUnitId/menusync/*',
  handler: menusyncHandler(anyuppSdk),
});

app.route({
  method: 'POST',
  url: '/:externalUnitId/order-status',
  handler: orderStatusHandler(anyuppSdk),
});

export const handler = awsLambdaFastify(app);
