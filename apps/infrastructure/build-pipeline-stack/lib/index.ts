import { App } from '@serverless-stack/resources';
import {
  DevBuildPipelineStack,
  PipelineStackProps
} from './build-pipeline/pipeline-stack';
import { SecretsManagerStack } from './build-pipeline/secretsmanager-stack';
import {
  DevPullRequestBuildStack,
  DevPullRequestBuildStackProps
} from './build-pipeline/dev-pull-request-stack';

export { App };

export default function main(app: App): void {
  const secretsManagerStack = new SecretsManagerStack(app, 'secretsmanager');
  //const slackChannel = new SlackNotificationsStack(app, 'SlackNotifications');

  const commonConfig = {
    repoOwner: 'bgap',
    repoName: 'anyupp',
    secretsManager: secretsManagerStack,
    repoBranch: 'dev'
  };

  const devPullRequestConfig: DevPullRequestBuildStackProps = {
    ...commonConfig
  };

  const devBuildPipelineConfig: PipelineStackProps = {
    ...commonConfig
  };

  new DevBuildPipelineStack(
    app,
    'DevBuildPipelineStack',
    devBuildPipelineConfig
  );

  new DevPullRequestBuildStack(
    app,
    'DevPullRequestBuildStack',
    devPullRequestConfig
  );
}
