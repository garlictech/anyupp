import * as ecr from '@aws-cdk/aws-ecr';
import * as codestarnotifications from '@aws-cdk/aws-codestarnotifications';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as iam from '@aws-cdk/aws-iam';
import * as ssm from '@aws-cdk/aws-ssm';
import { SecretsManagerStack } from './secretsmanager-stack';
import * as sst from '@serverless-stack/resources';
import * as chatbot from '@aws-cdk/aws-chatbot';

export interface PipelineStackProps extends sst.StackProps {
  readonly chatbot: chatbot.SlackChannelConfiguration;
  readonly repoName: string;
  readonly repoOwner: string;
  readonly repoBranch: string;
  readonly secretsManager: SecretsManagerStack;
}

export const appConfig = {
  name: 'anyupp-backend',
};

export const projectPrefix = (stage: string) => `${stage}-${appConfig.name}`;

export const configurePermissions = (
  stack: sst.Stack,
  secretsManager: SecretsManagerStack,
  resources: iam.IGrantable[],
  prefix: string,
) => {
  resources.forEach((resource, index) => {
    secretsManager.pipelineSecrets.grantRead(resource);

    [
      'consumerWebUserPoolClientId',
      'consumerNativeUserPoolClientId',
      'consumerUserPoolDomain',
      'IdentityPoolId',
      'GraphqlApiKey',
      'GraphqlApiUrl',
      'StripeWebhookEndpoint',
      'googleClientId',
      'stripePublishableKey',
      'facebookAppId',
      'AdminSiteUrl',
      'adminWebUserPoolClientId',
      'adminNativeUserPoolClientId',
      'adminUserPoolId',
      'adminUserPoolDomain',
      'AdminAmplifyAppId',
    ].forEach(param =>
      ssm.StringParameter.fromStringParameterName(
        stack,
        param + 'Param' + index,
        prefix + '-' + param,
      ).grantRead(resource),
    );
  });
};

export const createBuildProject = (
  stack: sst.Stack,
  cache: codebuild.Cache,
  stage: string,
): codebuild.PipelineProject => {
  const adminConfig = stage === 'dev' ? '' : `--configuration=${stage}`;

  return new codebuild.PipelineProject(stack, 'Build', {
    buildSpec: codebuild.BuildSpec.fromObject({
      version: '0.2',
      phases: {
        install: {
          commands: [
            `sh ./tools/setup-aws-environment.sh`,
            'yarn',
            'npm install -g @aws-amplify/cli',
          ],
        },
        pre_build: {
          commands: [
            `yarn nx config admin-amplify-app --app=${appConfig.name} --stage=${stage}`,
            `yarn nx config shared-config --app=${appConfig.name} --stage=${stage}`,
            `yarn nx config api-graphql-schema`,
          ],
        },
        build: {
          commands: [
            `yarn nx build-schema admin-amplify-app --stage=${stage}`,
            `yarn nx build admin ${adminConfig}`,
            `yarn nx build infrastructure-anyupp-backend-stack --stage=${stage} --app=${appConfig.name}`,
          ],
        },
        post_build: {
          commands: [`yarn nx deploy admin-amplify-app`],
        },
      },
      artifacts: {
        files: ['apps/infrastructure/anyupp-backend-stack/cdk.out/**/*'],
      },
      env: {
        'secrets-manager': {
          AWS_ACCESS_KEY_ID: 'codebuild:codebuild-aws_access_key_id',
          AWS_SECRET_ACCESS_KEY: 'codebuild:codebuild-aws_secret_access_key',
        },
      },
    }),
    cache,
    environment: {
      //      buildImage: utils.getBuildImage(stack),
      buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_3,
    },
  });
};

export const createE2eTestProject = (
  stack: sst.Stack,
  cache: codebuild.Cache,
  adminSiteUrl: string,
): codebuild.PipelineProject =>
  new codebuild.PipelineProject(stack, 'e2eTest', {
    buildSpec: codebuild.BuildSpec.fromObject({
      version: '0.2',
      phases: {
        install: {
          commands: ['yarn'],
        },
        build: {
          commands: [
            `yarn nx e2e-remote admin-e2e --headless --baseUrl=${adminSiteUrl}`,
            'yarn cucumber:report',
            'yarn cypress:generate:html:report',
          ],
        },
      },
      reports: {
        cypressReports: {
          files: ['cyreport/cucumber-json/**/*'],
          'file-format': 'CUCUMBERJSON',
        },
      },
      artifacts: {
        files: ['cyreport/**/*'],
      },
    }),
    cache,
    environment: {
      buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_3,
    },
  });

export const createIntegrationTestProject = (
  stack: sst.Stack,
  cache: codebuild.Cache,
  stage: string,
): codebuild.PipelineProject =>
  new codebuild.PipelineProject(stack, 'integrationTest', {
    buildSpec: codebuild.BuildSpec.fromObject({
      version: '0.2',
      phases: {
        install: {
          commands: [
            `sh ./tools/setup-aws-environment.sh`,
            'yarn',
            'npm install -g @aws-amplify/cli',
          ],
        },
        pre_build: {
          commands: [
            `yarn nx config admin-amplify-app --app=${appConfig.name} --stage=${stage}`,
            `yarn nx config shared-config --app=${appConfig.name} --stage=${stage}`,
            `yarn nx config api-graphql-schema`,
          ],
        },
        build: {
          commands: [
            `yarn nx test integration-tests --codeCoverage --coverageReporters=clover`,
          ],
        },
      },
      reports: {
        coverage: {
          files: ['coverage/**/*'],
          'file-format': 'CLOVERXML',
        },
      },
      env: {
        'secrets-manager': {
          AWS_ACCESS_KEY_ID: 'codebuild:codebuild-aws_access_key_id',
          AWS_SECRET_ACCESS_KEY: 'codebuild:codebuild-aws_secret_access_key',
        },
      },
    }),
    cache,
    environment: {
      buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_3,
    },
  });

export const configurePipeline = (
  stack: sst.Stack,
  stage: string,
): { adminSiteUrl: string } => {
  const adminSiteUrl = ssm.StringParameter.fromStringParameterName(
    stack,
    'AdminSiteUrlParamDev',
    `${stage}-${appConfig.name}-AdminSiteUrl`,
  ).stringValue;

  return { adminSiteUrl };
};

export const configurePipelineNotifications = (
  stack: sst.Stack,
  resourceArn: string,
  chatbot: chatbot.SlackChannelConfiguration,
  stage: string,
): void => {
  new codestarnotifications.CfnNotificationRule(stack, 'BuildNotification', {
    detailType: 'FULL',
    eventTypeIds: [
      'codepipeline-pipeline-action-execution-failed',
      'codepipeline-pipeline-action-execution-succeeded',
      'codepipeline-pipeline-action-execution-started',
      'codepipeline-pipeline-action-execution-canceled',
    ],
    name: `AnyUppBuildNotification${stage}`,
    resource: resourceArn,
    targets: [
      {
        targetAddress: chatbot.slackChannelConfigurationArn,
        targetType: 'AWSChatbotSlack',
      },
    ],
  });
};

export const configurePRNotifications = (
  stack: sst.Stack,
  resourceArn: string,
  chatbot: chatbot.SlackChannelConfiguration,
  stage: string,
): void => {
  new codestarnotifications.CfnNotificationRule(stack, 'BuildNotification', {
    detailType: 'FULL',
    eventTypeIds: [
      'codebuild-project-build-state-in-progress',
      'codebuild-project-build-state-failed',
      'codebuild-project-build-state-succeeded',
    ],
    name: `AnyUppPRNotification${stage}`,
    resource: resourceArn,
    targets: [
      {
        targetAddress: chatbot.slackChannelConfigurationArn,
        targetType: 'AWSChatbotSlack',
      },
    ],
  });
};

export const configureDockerImageNotifications = (
  stack: sst.Stack,
  resourceArn: string,
  chatbot: chatbot.SlackChannelConfiguration,
  label: string,
): void => {
  new codestarnotifications.CfnNotificationRule(
    stack,
    label + 'BuildNotification',
    {
      detailType: 'FULL',
      eventTypeIds: [
        'codebuild-project-build-state-in-progress',
        'codebuild-project-build-state-failed',
        'codebuild-project-build-state-succeeded',
      ],
      name: `AnyUppDockerImageNotification${label}`,
      resource: resourceArn,
      targets: [
        {
          targetAddress: chatbot.slackChannelConfigurationArn,
          targetType: 'AWSChatbotSlack',
        },
      ],
    },
  );
};

export const copyParameter = (
  paramName: string,
  fromStage: string,
  toStage: string,
  stack: sst.Stack,
) => {
  const paramNameParam = `${toStage}${paramName}Param`;

  const param = ssm.StringParameter.fromStringParameterAttributes(
    stack,
    `${paramNameParam}From`,
    {
      parameterName: `${fromStage}-${appConfig.name}-${paramName}`,
    },
  ).stringValue;

  new ssm.StringParameter(stack, paramNameParam, {
    allowedPattern: '.*',
    description: 'A project parameter',
    parameterName: `${projectPrefix(toStage)}-${paramName}`,
    stringValue: param,
  });
};

export const getBuildImage = (stack: sst.Stack): codebuild.IBuildImage => {
  const buildDockerRepo = ecr.Repository.fromRepositoryName(
    stack,
    'CodebuildDockerRepo',
    'aws-codebuild-core',
  );

  return codebuild.LinuxBuildImage.fromEcrRepository(
    buildDockerRepo,
    'latest-amd64',
  );
};
