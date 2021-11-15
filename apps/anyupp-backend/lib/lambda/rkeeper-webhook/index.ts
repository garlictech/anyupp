import awsLambdaFastify from 'aws-lambda-fastify';
import { ECS } from 'aws-sdk';
import fastify from 'fastify';
import { handleProducts } from '@bgap/rkeeper-api';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { stackConfig } from '@bgap/shared/config';

const app = fastify({
  logger: true,
});

const ecs = new ECS({ apiVersion: '2014-11-13' });

app.route({
  method: 'POST',
  url: '/wp-json/ucsdp/v1/push/dishes/',
  preHandler: async (request, reply) => {},
  handler: async (request, reply) => {
    const deps = {
      ecs,
      RKeeperProcessProductSubnet:
        process.env.RKeeperProcessProductSubnet || '',
      RKeeperProcessProductSecurityGroup:
        process.env.RKeeperProcessProductSecurityGroup || '',
      RKeeperProcessProductTaskArn:
        process.env.RKeeperProcessProductTaskArn || '',
      containerName: '',
    };

    await handleProducts(deps)('seeded-rkeeper-unit', request.body)
      .pipe(
        tap(() => reply.send({ success: true })),
        catchError(err => {
          reply.send({ error: err });
          return throwError(err);
        }),
      )
      .toPromise();
  },
});

export const handler = awsLambdaFastify(app);
