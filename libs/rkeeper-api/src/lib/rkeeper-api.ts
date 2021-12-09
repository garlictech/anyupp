import { anyuppFargateClusterName } from '@bgap/backend/shared/utils';
import { LaunchType } from '@aws-cdk/aws-ecs';
import { AWSError, ECS } from 'aws-sdk';
import { pipe } from 'fp-ts/lib/function';
import { bindNodeCallback } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface HandleProductsDeps {
  ecs: ECS;
  RKeeperProcessProductSubnet: string;
  RKeeperProcessProductSecurityGroup: string;
  taskDefinitionArn: string;
}

export const handleProducts =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        taskDefinition: deps.taskDefinitionArn,
        cluster: anyuppFargateClusterName,
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
                  name: 'rawData',
                  value: JSON.stringify(rawData),
                },
              ],
            },
          ],
        },
        //  })),
      },
      params =>
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
