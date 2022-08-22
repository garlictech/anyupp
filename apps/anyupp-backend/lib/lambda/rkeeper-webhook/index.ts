import awsLambdaFastify from '@fastify/aws-lambda';
import * as fastify from 'fastify';
import { menusyncHandler, orderStatusHandler } from '@bgap/rkeeper-api';

const app = fastify.fastify({
  logger: true,
});

app.route({
  method: 'POST',
  url: '/:externalUnitId/menusync',
  handler: menusyncHandler,
});

app.route({
  method: 'POST',
  url: '/:externalUnitId/menusync/*',
  handler: menusyncHandler,
});

app.route({
  method: 'POST',
  url: '/:externalUnitId/order-status',
  handler: orderStatusHandler,
});

export const handler = awsLambdaFastify(app);
