import { LaunchType } from '@aws-cdk/aws-ecs';
import { AWSError, ECS } from 'aws-sdk';
import { pipe } from 'fp-ts/lib/function';
import { bindNodeCallback, of, throwError } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import * as R from 'ramda';
import * as cdk from '@aws-cdk/core';

export interface HandleProductsDeps {
  ecs: ECS;
  RKeeperProcessProductSubnet: string;
  RKeeperProcessProductSecurityGroup: string;
  taskRoleArn: string;
  API_ACCESS_KEY_ID: string;
  API_SECRET_ACCESS_KEY: string;
  AWS_REGION: string;
}

export const handleProducts =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (deps: HandleProductsDeps) => (unitId: string, rawData: any) =>
    pipe(
      {
        taskRoleArn: deps.taskRoleArn,
        executionRoleArn: deps.taskRoleArn,
        family: 'fargate-task-definition',
        networkMode: 'awsvpc',
        requiresCompatibilities: ['FARGATE'],
        cpu: '256',
        memory: '512',
        containerDefinitions: [
          {
            image:
              '568276182587.dkr.ecr.eu-west-1.amazonaws.com/rkeeper-products',
            name: 'anyupp-rkeeper-process-products',
            environment: [
              {
                name: 'unitId',
                value: unitId,
              },
              {
                name: 'rawData',
                value: JSON.stringify(rawData),
              },
              {
                name: 'AWS_ACCESS_KEY_ID',
                value: deps.API_ACCESS_KEY_ID,
              },
              {
                name: 'AWS_SECRET_ACCESS_KEY',
                value: deps.API_SECRET_ACCESS_KEY,
              },
            ],
            logConfiguration: {
              logDriver: 'awslogs',
              options: {
                'awslogs-create-group': 'true',
                'awslogs-region': deps.AWS_REGION || '',
                'awslogs-group': cdk.Fn.importValue('RkeeperLogGroup'),
                'awslogs-stream-prefix': 'xxx',
              },
            },
          },
        ],
      },
      R.tap(() => console.error(deps.taskRoleArn)),
      params =>
        bindNodeCallback(
          (
            p: ECS.Types.RegisterTaskDefinitionRequest,
            callback: (
              err: AWSError,
              data: ECS.Types.RegisterTaskDefinitionResponse,
            ) => void,
          ) => deps.ecs.registerTaskDefinition(p, callback),
        )(params),
      tap(x => console.warn(JSON.stringify(x, null, 2))),
      switchMap(taskDefinition =>
        taskDefinition?.taskDefinition?.taskDefinitionArn
          ? of(taskDefinition?.taskDefinition.taskDefinitionArn)
          : throwError('Wrong task definition'),
      ),
      map(taskDefinitionArn => ({
        launchType: LaunchType.FARGATE,
        networkConfiguration: {
          awsvpcConfiguration: {
            subnets: [deps.RKeeperProcessProductSubnet],
            securityGroups: [deps.RKeeperProcessProductSecurityGroup],
          },
        },
        taskDefinition: taskDefinitionArn,
      })),
      switchMap((params: ECS.Types.RunTaskRequest) =>
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
