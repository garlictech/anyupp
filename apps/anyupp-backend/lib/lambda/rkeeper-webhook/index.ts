import awsLambdaFastify from 'aws-lambda-fastify';
import { ECS } from 'aws-sdk';
import fastify from 'fastify';

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
    console.log(JSON.stringify(request.body, null, 2));

    /*await handleProducts(deps)('yellow-rkeeper-unit', request.body)
      .pipe(
        tap(res => reply.send({ success: res })),
        tap(res => console.log('RESULT', res)),
        catchError(err => {
          reply.send({ error: err });
          return throwError(err);
        }),
      )
      .toPromise();*/
    /*    const awsAccesskeyId = process.env.API_ACCESS_KEY_ID || '';
    const awsSecretAccessKey = process.env.API_SECRET_ACCESS_KEY || '';
    const crudSdk = getCrudSdkForIAM(awsAccesskeyId, awsSecretAccessKey);
    console.log('*****', JSON.stringify(request.body, null, 2));
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
    }*/
  },
});

export const handler = awsLambdaFastify(app);
