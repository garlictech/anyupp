import { AWSError, ECS } from 'aws-sdk';
import { pipe } from 'fp-ts/lib/function';
import { bindNodeCallback, defer, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { S3 } from 'aws-sdk';
import * as R from 'ramda';

export interface HandleProductsDeps {
  ecs: ECS;
  RKeeperProcessProductSubnet: string;
  RKeeperProcessProductSecurityGroup: string;
  taskDefinitionArn: string;
  bucketName: string;
  uuidGenerator: () => string;
}

export const handleProducts =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (deps: HandleProductsDeps) => (unitId: string, rawData: any) => {
    const objectKey = deps.uuidGenerator();
    const s3 = new S3();

    return pipe(
      JSON.stringify(rawData),
      Body => ({
        Bucket: deps.bucketName,
        Key: objectKey,
        Body,
      }),
      R.tap(x => console.log('*****0', x)),
      params => defer(() => s3.upload(params).promise()),
      catchError(err => of(err)),
      tap(x => console.log('*****1', x)),
      map(() => ({
        launchType: 'FARGATE',
        networkConfiguration: {
          awsvpcConfiguration: {
            subnets: [deps.RKeeperProcessProductSubnet],
            securityGroups: [deps.RKeeperProcessProductSecurityGroup],
          },
        },
        taskDefinition: deps.taskDefinitionArn,
        cluster: 'anyupp-fargate-cluster',
        overrides: {
          containerOverrides: [
            {
              name: 'DefaultContainer',
              environment: [
                {
                  name: 'unitId',
                  value: unitId,
                },
                {
                  name: 'objectKey',
                  value: objectKey,
                },
              ],
            },
          ],
        },
      })),
      tap(x => console.log('*****2', x)),
      switchMap(params =>
        bindNodeCallback(
          (
            p: ECS.Types.RunTaskRequest,
            callback: (err: AWSError, data: ECS.Types.RunTaskResponse) => void,
          ) => deps.ecs.runTask(p, callback),
        )(params),
      ),
      tap(x => console.log('*****3', x)),
      tap(result =>
        console.log(
          'Task submission result: ',
          JSON.stringify(result, null, 2),
        ),
      ),
    );
  };
