import awsLambdaFastify from 'aws-lambda-fastify';
import { ECS } from 'aws-sdk';
import fastify from 'fastify';
import { handleProducts, handleRkeeperProducts } from '@bgap/rkeeper-api';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { getCrudSdkForIAM } from '@bgap/crud-gql/api';

const app = fastify({
  logger: true,
});

const ecs = new ECS({ apiVersion: '2014-11-13' });

app.route({
  method: 'POST',
  url: '/wp-json/ucsdp/v1/push/dishes/',
  preHandler: async (request, reply) => {},
  handler: async (request, reply) => {
    /* const deps = {
      ecs,
      RKeeperProcessProductSubnet:
        process.env.RKeeperProcessProductSubnet || '',
      RKeeperProcessProductSecurityGroup:
        process.env.RKeeperProcessProductSecurityGroup || '',
      RKeeperProcessProductTaskArn:
        process.env.RKeeperProcessProductTaskArn || '',
      containerName: process.env.RKeeperContanerName || '',
    };
*/
    console.log('lofasz');
    console.log(request.body);

    const awsAccesskeyId = process.env.API_ACCESS_KEY_ID || '';
    const awsSecretAccessKey = process.env.API_SECRET_ACCESS_KEY || '';
    const crudSdk = getCrudSdkForIAM(awsAccesskeyId, awsSecretAccessKey);
    console.log('*****', request.body);
    try {
      await handleRkeeperProducts(crudSdk)('frei-rkeeper-unit', request.body)
        .pipe(
          tap(() => reply.send({ success: true })),
          tap(x => console.log('RESULT', x)),
          catchError(err => {
            reply.send({ error: err });
            return throwError(err);
          }),
        )
        .toPromise();
    } catch (err) {
      console.log('ERR', err);
      reply.send({ error: err });
    }
    /*await handleProducts(deps)('seeded-rkeeper-unit', request.body)
      .pipe(
        tap(() => reply.send({ success: true })),
        catchError(err => {
          reply.send({ error: err });
          return throwError(err);
        }),
      )
      .toPromise();*/
  },
});

export const handler = awsLambdaFastify(app);
