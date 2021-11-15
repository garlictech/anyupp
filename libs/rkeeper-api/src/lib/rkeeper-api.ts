import { LaunchType } from '@aws-cdk/aws-ecs';
import { AWSError, ECS } from 'aws-sdk';
import { pipe } from 'fp-ts/lib/function';
import { bindNodeCallback } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as R from 'ramda';

export interface HandleProductsDeps {
  ecs: ECS;
  RKeeperProcessProductSubnet: string;
  RKeeperProcessProductSecurityGroup: string;
  RKeeperProcessProductTaskArn: string;
  containerName: string;
}

export const handleProducts =
  (deps: HandleProductsDeps) => (unitId: string, rawData: any) =>
    pipe(
      {
        launchType: LaunchType.FARGATE,
        networkConfiguration: {
          awsvpcConfiguration: {
            subnets: [deps.RKeeperProcessProductSubnet],
            securityGroups: [deps.RKeeperProcessProductSecurityGroup],
          },
        },
        taskDefinition: deps.RKeeperProcessProductTaskArn,
        overrides: {
          containerOverrides: [
            {
              name: deps.containerName,
              command: 'ls',
              environment: [
                {
                  name: 'unitId',
                  value: unitId,
                },
                {
                  name: 'rawData',
                  value: JSON.stringify(rawData),
                },
              ],
            },
          ],
        },
      },
      R.tap(console.warn),
      (params: ECS.Types.RunTaskRequest) =>
        bindNodeCallback(
          (
            p: ECS.Types.RunTaskRequest,
            callback: (err: AWSError, data: ECS.Types.RunTaskResponse) => void,
          ) => deps.ecs.runTask(p, callback),
        )(params),
      tap(result =>
        console.log(
          'Task submission result: ',
          JSON.stringify(result, null, 2),
        ),
      ),
    );
