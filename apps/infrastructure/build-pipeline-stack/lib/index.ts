import { App } from '@serverless-stack/resources';
import { DevBuildPipelineStack } from './build-pipeline/dev-pipeline-stack';
import { SecretsManagerStack } from './build-pipeline/secretsmanager-stack';
import { DevPullRequestBuildStack } from './build-pipeline/dev-pull-request-stack';
import { SlackNotificationsStack } from './build-pipeline/slack-notifications-stack';
import { PipelineStackProps } from './build-pipeline/utils';

export default function main(app: App): void {
  const secretsManagerStack = new SecretsManagerStack(app, 'secretsmanager');
  const slackChannel = new SlackNotificationsStack(app, 'SlackNotifications');

  const commonConfig = {
    repoOwner: 'bgap',
    repoName: 'anyupp',
    secretsManager: secretsManagerStack,
    chatbot: slackChannel.chatbot,
  };

  const devPullRequestConfig: PipelineStackProps = {
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
