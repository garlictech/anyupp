import { App } from '@serverless-stack/resources';
import { DevBuildPipelineStack } from './build-pipeline/dev-pipeline-stack';
import { SecretsManagerStack } from './build-pipeline/secretsmanager-stack';
import { DevPullRequestBuildStack } from './build-pipeline/dev-pull-request-stack';
import { SlackNotificationsStack } from './build-pipeline/slack-notifications-stack';
import { PipelineStackProps } from './build-pipeline/utils';
import { CiStack } from './build-pipeline/ci-stack';
import { QABuildPipelineStack } from './build-pipeline/qa-pipeline-stack';
import { StagingBuildPipelineStack } from './build-pipeline/staging-pipeline-stack';
import { ProdBuildPipelineStack } from './build-pipeline/prod-pipeline-stack';
import { TestBuildPipelineStack } from './build-pipeline/test-pipeline-stack';

export default function main(app: App): void {
  const slackChannel = new SlackNotificationsStack(app, 'SlackNotifications');

  const globalConfig = {
    repoOwner: 'bgap',
    repoName: 'anyupp',
    chatbot: slackChannel.chatbot,
  };

  function createStacksForDevStages() {
    const pipelineSecretsManagerArn =
      'arn:aws:secretsmanager:eu-west-1:568276182587:secret:codebuild-Z12nwS';
    const githubSecretsManagerArn =
      'arn:aws:secretsmanager:eu-west-1:568276182587:secret:GithubAccessToken-2xxxSw';

    const devSecretsManagerStack = new SecretsManagerStack(
      app,
      'devsecretsmanager',
      {
        projectSecretsManagerArn:
          'arn:aws:secretsmanager:eu-west-1:568276182587:secret:anyupp-dev-secrets-WtbZ0k',
        pipelineSecretsManagerArn,
        githubSecretsManagerArn,
      },
    );

    const ciStack = new CiStack(app, 'CiStack', {
      secretsManager: devSecretsManagerStack,
    });

    const commonConfig = {
      ...globalConfig,
      appcenterUser: ciStack.appcenterIamUser,
    };

    const qaSecretsManagerStack = new SecretsManagerStack(
      app,
      'qasecretsmanager',
      {
        projectSecretsManagerArn:
          'arn:aws:secretsmanager:eu-west-1:568276182587:secret:anyupp-qa-secrets-4cFY1U',
        pipelineSecretsManagerArn,
        githubSecretsManagerArn,
      },
    );

    const stagingSecretsManagerStack = new SecretsManagerStack(
      app,
      'stagingsecretsmanager',
      {
        projectSecretsManagerArn:
          'arn:aws:secretsmanager:eu-west-1:568276182587:secret:anyupp-staging-secrets-4rGQUb',
        pipelineSecretsManagerArn,
        githubSecretsManagerArn,
      },
    );

    const testSecretManagerStack = new SecretsManagerStack(
      app,
      'testsecretsmanager',
      {
        projectSecretsManagerArn:
          'arn:aws:secretsmanager:eu-west-1:568276182587:secret:anyupp-test-secrets-6yLLKo',
        pipelineSecretsManagerArn,
        githubSecretsManagerArn,
      },
    );

    const devBuildPipelineConfig: PipelineStackProps = {
      repoBranch: 'dev',
      secretsManager: devSecretsManagerStack,
      ...commonConfig,
    };

    new DevBuildPipelineStack(
      app,
      'DevBuildPipelineStack',
      devBuildPipelineConfig,
    );

    const devPullRequestConfig: PipelineStackProps = {
      repoBranch: 'dev',
      secretsManager: devSecretsManagerStack,
      ...commonConfig,
    };

    const prStack = new DevPullRequestBuildStack(
      app,
      'DevPullRequestBuildStack',
      devPullRequestConfig,
    );

    prStack.addDependency(ciStack);

    new QABuildPipelineStack(app, 'QABuildStack', {
      repoBranch: 'qa',
      secretsManager: qaSecretsManagerStack,
      ...commonConfig,
    });

    new StagingBuildPipelineStack(app, 'StagingBuildStack', {
      repoBranch: 'staging',
      secretsManager: stagingSecretsManagerStack,
      ...commonConfig,
    });

    new TestBuildPipelineStack(app, 'TestBuildStack', {
      repoBranch: 'test',
      secretsManager: testSecretManagerStack,
      ...commonConfig,
    });
  }

  function createStacksForProdStage() {
    const secretsManager = new SecretsManagerStack(app, 'prodsecretsmanager', {
      projectSecretsManagerArn:
        'arn:aws:secretsmanager:eu-west-1:486782650003:secret:anyupp-prod-secrets-OQjuwn',
      pipelineSecretsManagerArn:
        'arn:aws:secretsmanager:eu-west-1:486782650003:secret:codebuild-w9fEax',
      githubSecretsManagerArn:
        'arn:aws:secretsmanager:eu-west-1:486782650003:secret:GithubAccessToken-47Zff7',
    });

    const ciStack = new CiStack(app, 'CiStack', {
      secretsManager,
    });

    const commonConfig = {
      ...globalConfig,
      appcenterUser: ciStack.appcenterIamUser,
    };

    new ProdBuildPipelineStack(app, 'ProdBuildStack', {
      repoBranch: 'prod',
      secretsManager,
      ...commonConfig,
    });
  }

  if (app.stage !== 'prod') {
    createStacksForDevStages();
  } else {
    createStacksForProdStage();
  }
}
