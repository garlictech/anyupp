import { AWSError, ECS } from 'aws-sdk';
import { pipe } from 'fp-ts/lib/function';
import { bindNodeCallback, defer, of, throwError } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { S3 } from 'aws-sdk';
import { CrudSdk } from '@bgap/crud-gql/api';

export interface HandleProductsDeps {
  ecs: ECS;
  RKeeperProcessProductSubnet: string;
  RKeeperProcessProductSecurityGroup: string;
  taskDefinitionArn: string;
  bucketName: string;
  uuidGenerator: () => string;
  sdk: CrudSdk;
}

export const handleProducts =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (deps: HandleProductsDeps) => (externalUnitId: string, rawData: any) => {
    console.log(`Looking up unit ${externalUnitId}`);
    const objectKey = deps.uuidGenerator();
    const s3 = new S3();
    console.log(`Looking up unit `);

    return pipe(
      deps.sdk.SearchUnits({
        filter: { externalId: { eq: externalUnitId } },
      }),
      switchMap(res =>
        res?.items?.[0]?.externalId === externalUnitId
          ? of(true)
          : throwError(
              `Unit with external ID ${externalUnitId} cannot be found`,
            ),
      ),
      map(() => ({
        Bucket: deps.bucketName,
        Key: objectKey,
        Body: JSON.stringify(rawData),
      })),
      switchMap(params => defer(() => s3.upload(params).promise())),
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
                  value: externalUnitId,
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
      switchMap(params =>
        bindNodeCallback(
          (
            p: ECS.Types.RunTaskRequest,
            callback: (err: AWSError, data: ECS.Types.RunTaskResponse) => void,
          ) => deps.ecs.runTask(p, callback),
        )(params),
      ),
      tap(result =>
        console.log(
          'Task submission result: ',
          JSON.stringify(result, null, 2),
        ),
      ),
    );
  };
