import { App } from '@serverless-stack/resources';
import {
  DevBuildPipelineStack,
  PipelineStackProps,
} from './build-pipeline/dev-pipeline-stack';
import { SecretsManagerStack } from './build-pipeline/secretsmanager-stack';
import {
  DevPullRequestBuildStack,
  DevPullRequestBuildStackProps,
} from './build-pipeline/dev-pull-request-stack';
import { SlackNotificationsStack } from './build-pipeline/slack-notifications-stack';

export default function main(app: App): void {
  const secretsManagerStack = new SecretsManagerStack(app, 'secretsmanager');
  const slackChannel = new SlackNotificationsStack(app, 'SlackNotifications');

  const commonConfig = {
    repoOwner: 'bgap',
    repoName: 'anyupp',
    secretsManager: secretsManagerStack,
    chatbot: slackChannel.chatbot,
  };

  const devPullRequestConfig: DevPullRequestBuildStackProps = {
    repoBranch: 'dev',
    ...commonConfig,
  };

  const devBuildPipelineConfig: PipelineStackProps = {
    repoBranch: 'dev',
    ...commonConfig,
  };

  new DevBuildPipelineStack(
    app,
    'DevBuildPipelineStack',
    devBuildPipelineConfig,
  );

  new DevPullRequestBuildStack(
    app,
    'DevPullRequestBuildStack',
    devPullRequestConfig,
  );
}
