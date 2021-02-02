import * as sst from '@serverless-stack/resources';
import * as codebuild from '@aws-cdk/aws-codebuild';
import { SecretsManagerStack } from './secretsmanager-stack';
import * as sns from '@aws-cdk/aws-sns';
import * as eventTargets from '@aws-cdk/aws-events-targets';

export interface DevPullRequestBuildStackProps extends sst.StackProps {
  //  readonly slackChannel: chatbot.ISlackChannelConfiguration;
  readonly repoName: string;
  readonly repoOwner: string;
  readonly repoBranch: string;
  readonly secretsManager: SecretsManagerStack;
}

export class DevPullRequestBuildStack extends sst.Stack {
  constructor(app: sst.App, id: string, props: DevPullRequestBuildStackProps) {
    super(app, id, props);

    const githubPrSource = codebuild.Source.gitHub({
      owner: props.repoOwner,
      repo: props.repoName,
      webhook: true,
      webhookFilters: [
        codebuild.FilterGroup.inEventOf(
          codebuild.EventAction.PULL_REQUEST_CREATED
        ),
        codebuild.FilterGroup.inEventOf(
          codebuild.EventAction.PULL_REQUEST_UPDATED
        )
      ]
    });

    const project = new codebuild.Project(this, 'PullRequestClone', {
      source: githubPrSource,
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          install: {
            commands: ['yarn']
          },
          build: {
            commands: [
              'yarn nx affected:lint --base=dev',
              'yarn nx affected:test --base=dev',
              'yarn nx affected:build --base=dev'
            ]
          }
        }
      }),
      environment: {
        buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_3
      }
    });

    const topic = sns.Topic.fromTopicArn(
      this,
      'SlackNotificationTopic',
      'arn:aws:sns:eu-west-1:568276182587:CodeStarNotifications-anyupp-cicd-f50b5f6cf3315948882cbd0ba0230163179d510d'
    );
    const snsTarget = new eventTargets.SnsTopic(topic);

    project.onBuildStarted('PullRequestBuildStart', {
      target: snsTarget
    });
  }
}
