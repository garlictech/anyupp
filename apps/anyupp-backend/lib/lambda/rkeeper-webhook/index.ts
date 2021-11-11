import { LaunchType } from '@aws-cdk/aws-ecs';
import awsLambdaFastify from 'aws-lambda-fastify';
import { ECS } from 'aws-sdk';
import fastify from 'fastify';

const app = fastify({
  logger: true,
});

const ecs = new ECS({ apiVersion: '2014-11-13' });

app.post('/', async (_request, reply) => {
  const params = {
    launchType: LaunchType.FARGATE,
    networkConfiguration: {
      awsvpcConfiguration: {
        subnets: [process.env.RKeeperProcessProductSubnet || ''],
        securityGroups: [process.env.RKeeperProcessProductSecurityGroup || ''],
      },
    },
    taskDefinition: process.env.RKeeperProcessProductTaskArn || '',
  };

  console.log('PARAMS: ', params);

  ecs.runTask(params, (_err, data) => {
    console.log('****', _err, data);
    return reply.send(data);
  });
});

const RKeeperProcessProductSecurityGroup = 'sg-0bd21afb7c8a2565f';
const RKeeperProcessProductSubnet = 'subnet-074ccac7d8246a233';
const RKeeperProcessProductTaskArn =
  'arn:aws:ecs:eu-west-1:568276182587:task-definition/zsoltstackanyuppbackendrkeeperAnyuppRKeeperTaskDefBAE1C0E2:1';

export const launchFargateTask = () => {
  const params = {
    launchType: LaunchType.FARGATE,
    networkConfiguration: {
      awsvpcConfiguration: {
        subnets: [RKeeperProcessProductSubnet || ''],
        securityGroups: [RKeeperProcessProductSecurityGroup || ''],
      },
    },
    taskDefinition: RKeeperProcessProductTaskArn || '',
  };

  console.log('PARAMS: ', params);

  ecs.runTask(params, (_err, data) => {
    console.log('****', _err, data);
  });
};

export const handler = awsLambdaFastify(app);

launchFargateTask();
