import awsLambdaFastify from 'aws-lambda-fastify';
import * as fastify from 'fastify';
import { menusyncHandler } from '@bgap/rkeeper-api';

const app = fastify.fastify({
  logger: true,
});

app.route({
  method: 'POST',
  url: '/:externalUnitId/menusync/*',
  handler: menusyncHandler,
});

export const handler = awsLambdaFastify(app);
