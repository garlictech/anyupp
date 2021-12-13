import awsLambdaFastify from 'aws-lambda-fastify';
import { ECS } from 'aws-sdk';
import * as fastify from 'fastify';

const app = fastify.fastify({
  logger: true,
});

const ecs = new ECS({ apiVersion: '2014-11-13' });

type RKeeperRequest = fastify.FastifyRequest<{
  Params: { externalUnitId: string };
}>;

console.debug('init rkeeper:');
app.route({
  method: 'POST',
  url: '/:externalUnitId/menusync/*',
  handler: async (request: RKeeperRequest, reply: fastify.FastifyReply) => {
    console.log('Handling request for unit ', request.params.externalUnitId);
    console.debug('Request:', request);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const deps = {
      ecs,
      RKeeperProcessProductSubnet:
        process.env.RKeeperProcessProductSubnet || '',
      RKeeperProcessProductSecurityGroup:
        process.env.RKeeperProcessProductSecurityGroup || '',
      taskDefinitionArn: process.env.taskDefinitionArn || '',
    };
    console.log(deps);
    // Place it in the URL
    //const externalUnitId = '109150009';
    //const externalUnitId = request.params.externalUnitId;

    /* await handleProducts(deps)(externalUnitId, request.body)
      .pipe(
        tap(res => console.log('Request handled:', res)),
        tap(res => reply.send({ success: res })),
        catchError(err => {
          console.error('Request failed:', err);
          return throwError(err);
        }),
      )
      .toPromise();

      */ reply.send({ success: true });
  },
});

export const handler = awsLambdaFastify(app);
