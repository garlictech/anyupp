import { ECS } from 'aws-sdk';
import * as fastify from 'fastify';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { v1 as uuidV1 } from 'uuid';
import { handleProducts } from '../rkeeper-api';
import { CrudSdk } from '@bgap/crud-gql/api';

export type RKeeperRequest = fastify.FastifyRequest<{
  Params: { externalUnitId: string };
}>;

const ecs = new ECS({ apiVersion: '2014-11-13' });

export const menusyncHandler =
  (sdk: CrudSdk) => (request: RKeeperRequest, reply: fastify.FastifyReply) => {
    console.log('*****', request?.params);
    const externalUnitId = request?.params?.externalUnitId;
    console.log('Handling request for unit', externalUnitId);

    const deps = {
      ecs,
      RKeeperProcessProductSubnet:
        process.env.RKeeperProcessProductSubnet ||
        'RKeeperProcessProductSubnet NOT DEFINED',
      RKeeperProcessProductSecurityGroup:
        process.env.RKeeperProcessProductSecurityGroup ||
        'RKeeperProcessProductSecurityGroup NOT DEFINED',
      taskDefinitionArn:
        process.env.taskDefinitionArn || 'taskDefinitionArn NOT DEFINED',
      bucketName: process.env.BUCKET_NAME || 'BUCKET_NAME NOT DEFINED',
      uuidGenerator: uuidV1,
      sdk,
    };

    return handleProducts(deps)(externalUnitId, request.body)
      .pipe(
        tap(res => {
          console.log('Request handled:', res);
          reply.send({ success: true });
        }),
        catchError(error => {
          console.error('Request failed:', error);
          reply.status(400).send({ error });
          return of(error);
        }),
      )
      .toPromise();
  };
