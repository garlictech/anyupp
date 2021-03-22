import { App } from '@serverless-stack/resources';
import { DevBuildPipelineStack } from './build-pipeline/dev-pipeline-stack';
import { SecretsManagerStack } from './build-pipeline/secretsmanager-stack';
import { DevPullRequestBuildStack } from './build-pipeline/dev-pull-request-stack';
import { SlackNotificationsStack } from './build-pipeline/slack-notifications-stack';
import { PipelineStackProps } from './build-pipeline/utils';
import { CiStack } from './build-pipeline/ci-stack';
import { QABuildPipelineStack } from './build-pipeline/qa-pipeline-stack';
import { BuildEnvironmentStack } from './build-pipeline/build-environment';

export default function main(app: App): void {
  const pipelineSecretsManagerArn =
    'arn:aws:secretsmanager:eu-west-1:568276182587:secret:codebuild-Z12nwS';

  const devSecretsManagerStack = new SecretsManagerStack(
    app,
    'devsecretsmanager',
    {
      projectSecretsManagerArn:
        'arn:aws:secretsmanager:eu-west-1:568276182587:secret:anyupp-dev-secrets-WtbZ0k',
      pipelineSecretsManagerArn,
    },
  );

  const qaSecretsManagerStack = new SecretsManagerStack(
    app,
    'qasecretsmanager',
    {
      projectSecretsManagerArn:
        'arn:aws:secretsmanager:eu-west-1:568276182587:secret:anyupp-qa-secrets-4cFY1U',
      pipelineSecretsManagerArn,
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

  new QABuildPipelineStack(app, 'QABuildStack', {
    repoBranch: 'qa',
    secretsManager: qaSecretsManagerStack,
    ...commonConfig,
  });

  new BuildEnvironmentStack(app, 'DockerBuildAWSEnvironment', {
    repoOwner: 'bgap',
    repoName: 'aws-codebuild-docker-images',
    repoBranch: 'master',
    x86SourceDir: 'al2/x86_64/standard/3.0',
    armSourceDir: 'al2/aarch64/standard/2.0',
    imageName: 'aws-codebuild-core',
    chatbot: slackChannel.chatbot,
  });

  new BuildEnvironmentStack(app, 'DockerBuildAnyuppEnvironment', {
    repoOwner: 'bgap',
    repoName: 'aws-codebuild-docker-images',
    repoBranch: 'anyupp',
    x86SourceDir: 'anyupp/x86_64',
    armSourceDir: 'anyupp/aarch64',
    imageName: 'anyupp-codebuild',
    chatbot: slackChannel.chatbot,
  });
}
