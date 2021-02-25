import { App } from '@serverless-stack/resources';
import { DevBuildPipelineStack } from './build-pipeline/dev-pipeline-stack';
import { SecretsManagerStack } from './build-pipeline/secretsmanager-stack';
import { DevPullRequestBuildStack } from './build-pipeline/dev-pull-request-stack';
import { SlackNotificationsStack } from './build-pipeline/slack-notifications-stack';
import { PipelineStackProps } from './build-pipeline/utils';
import { CiStack } from './build-pipeline/ci-stack';
import { QAPullRequestBuildStack } from './build-pipeline/qa-pull-request-stack';
import { QABuildPipelineStack } from './build-pipeline/qa-pipeline-stack';

export default function main(app: App): void {
  const devSecretsManagerStack = new SecretsManagerStack(
    app,
    'devsecretsmanager',
    {
      secretsManagerArn:
        'arn:aws:secretsmanager:eu-west-1:568276182587:secret:anyupp-dev-secrets-WtbZ0k',
    },
  );

  const qaSecretsManagerStack = new SecretsManagerStack(
    app,
    'qasecretsmanager',
    {
      secretsManagerArn:
        'arn:aws:secretsmanager:eu-west-1:568276182587:secret:anyupp-qa-secrets-4cFY1U',
    },
  );

  const slackChannel = new SlackNotificationsStack(app, 'SlackNotifications');

  const commonConfig = {
    repoOwner: 'bgap',
    repoName: 'anyupp',
    chatbot: slackChannel.chatbot,
  };

  const devPullRequestConfig: PipelineStackProps = {
    repoBranch: 'dev',
    secretsManager: devSecretsManagerStack,
    ...commonConfig,
  };

  const devBuildPipelineConfig: PipelineStackProps = {
    repoBranch: 'dev',
    secretsManager: devSecretsManagerStack,
    ...commonConfig,
  };

  new CiStack(app, 'CiStack', { secretsManager: devSecretsManagerStack });

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

  new QAPullRequestBuildStack(app, 'QAPullRequestBuildStack', {
    repoBranch: 'qa',
    secretsManager: qaSecretsManagerStack,
    ...commonConfig,
  });

  new QABuildPipelineStack(app, 'QABuildStack', {
    repoBranch: 'qa',
    secretsManager: qaSecretsManagerStack,
    ...commonConfig,
  });
}
