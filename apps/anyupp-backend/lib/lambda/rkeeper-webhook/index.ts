import awsLambdaFastify from 'aws-lambda-fastify';
import fastify from 'fastify';

const app = fastify({
  logger: true,
});

app.post('/', async (_request, reply) => {
  return reply.send({ hello: 'world' });
});

export const handler = awsLambdaFastify(app);
