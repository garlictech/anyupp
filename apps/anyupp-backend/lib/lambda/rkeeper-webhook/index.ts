import awsLambdaFastify from 'aws-lambda-fastify';
import { ECS } from 'aws-sdk';
import * as fastify from 'fastify';
import { handleProducts } from '@bgap/rkeeper-api';
import { tap } from 'rxjs/operators';

const app = fastify.fastify({
  logger: true,
});

const ecs = new ECS({ apiVersion: '2014-11-13' });

type RKeeperRequest = fastify.FastifyRequest<{
  Params: { externalUnitId: string };
}>;

app.route({
  method: 'POST',
  url: ':externalUnitId/menusync/*',
  handler: async (request: RKeeperRequest, reply: fastify.FastifyReply) => {
    const deps = {
      ecs,
      RKeeperProcessProductSubnet:
        process.env.RKeeperProcessProductSubnet || '',
      RKeeperProcessProductSecurityGroup:
        process.env.RKeeperProcessProductSecurityGroup || '',
      taskRoleArn: process.env.taskRoleArn || '',
      logGroupName: process.env.logGroupName || '',
      dockerImageUri: process.env.dockerImageUri || '',
      API_ACCESS_KEY_ID: process.env.API_ACCESS_KEY_ID || '',
      API_SECRET_ACCESS_KEY: process.env.API_SECRET_ACCESS_KEY || '',
      AWS_REGION: process.env.AWS_REGION || '',
    };

    // Place it in the URL
    //const externalUnitId = '109150009';
    const externalUnitId = request.params.externalUnitId;

    await handleProducts(deps)(externalUnitId, request.body)
      .pipe(tap(res => reply.send({ success: res })))
      .toPromise();
  },
});

export const handler = awsLambdaFastify(app);
