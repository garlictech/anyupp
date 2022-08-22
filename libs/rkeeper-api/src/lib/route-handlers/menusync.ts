import { ECS } from 'aws-sdk';
import * as fastify from 'fastify';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { v1 as uuidV1 } from 'uuid';
import { handleProducts } from '../rkeeper-api';

export type RKeeperRequest = fastify.FastifyRequest<{
  Params: { externalUnitId: string };
}>;

const ecs = new ECS({ apiVersion: '2014-11-13' });

export const menusyncHandler = (
  request: RKeeperRequest,
  reply: fastify.FastifyReply,
) => {
  const externalUnitId = request.params.externalUnitId;
  console.log('Handling request for unit ', externalUnitId);
  console.debug('Request:', JSON.stringify(request.body, null, 2));

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
  };

  return handleProducts(deps)(externalUnitId, request.body)
    .pipe(
      tap(res => {
        console.log('Request handled:', res);
        reply.send({ success: true });
      }),
      catchError(err => {
        console.error('Request failed:', err);
        reply.send(500);
        return of(err);
      }),
    )
    .toPromise();
};
