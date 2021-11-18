import awsLambdaFastify from 'aws-lambda-fastify';
import { ECS } from 'aws-sdk';
import fastify from 'fastify';
import { handleProducts } from '@bgap/rkeeper-api';
import { tap } from 'rxjs/operators';

const app = fastify({
  logger: true,
});

const ecs = new ECS({ apiVersion: '2014-11-13' });

app.route({
  method: 'POST',
  url: '/wp-json/ucsdp/v1/push/dishes/',
  handler: async (request, reply) => {
    const deps = {
      ecs,
      RKeeperProcessProductSubnet:
        process.env.RKeeperProcessProductSubnet || '',
      RKeeperProcessProductSecurityGroup:
        process.env.RKeeperProcessProductSecurityGroup || '',
      taskRoleArn: process.env.taskRoleArn || '',
      API_ACCESS_KEY_ID: process.env.API_ACCESS_KEY_ID || '',
      API_SECRET_ACCESS_KEY: process.env.API_SECRET_ACCESS_KEY || '',
      AWS_REGION: process.env.AWS_REGION || '',
    };

    // Place it in the URL
    const externalUnitId = '109150009';

    await handleProducts(deps)(externalUnitId, request.body)
      .pipe(tap(res => reply.send({ success: res })))
      .toPromise();
  },
});

export const handler = awsLambdaFastify(app);
