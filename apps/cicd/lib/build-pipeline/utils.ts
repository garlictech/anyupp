import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import * as utils from './utils';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import * as codestarnotifications from '@aws-cdk/aws-codestarnotifications';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as iam from '@aws-cdk/aws-iam';
import * as ssm from '@aws-cdk/aws-ssm';
import {SecretsManagerStack} from './secretsmanager-stack';
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
  appcenterArtifactBucketNamePrefix: 'anyupp-build-artifacts',
};

export const projectPrefix = (stage: string) => `${stage}-${appConfig.name}`;

export const configurePermissions = (
  stack: sst.Stack,
  secretsManager: SecretsManagerStack,
  resources: iam.IGrantable[],
  prefix: string,
) => {
  const generatedParams = [
    'ConsumerWebUserPoolClientId',
    'ConsumerNativeUserPoolClientId',
    'ConsumerUserPoolDomain',
    'IdentityPoolId',
    'AnyuppGraphqlApiKey',
    'AnyuppGraphqlApiUrl',
    'StripeWebhookEndpoint',
    'AdminSiteUrl',
    'AdminWebUserPoolClientId',
    'AdminNativeUserPoolClientId',
    'AdminUserPoolId',
    'AdminUserPoolDomain',
    'CrudApiAppId',
  ].map(paramName => `/${prefix}/generated/${paramName}`);

  const fixParams = [
    'GoogleClientId',
    'StripePublishableKey',
    'FacebookAppId',
  ].map(paramName => `/${prefix}/${paramName}`);

  resources.forEach((resource, index) => {
    secretsManager.pipelineSecrets.grantRead(resource);

    [...generatedParams, ...fixParams].forEach(param =>
      ssm.StringParameter.fromStringParameterName(
        stack,
        param + 'Param' + index,
        param,
      ).grantRead(resource),
    );
  });
};

const getAppcenterArtifactBucketName = (stage: string) =>
  `${appConfig.appcenterArtifactBucketNamePrefix}-${stage}`;

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
            'yarn --frozen-lockfile',
            'npm install -g @aws-amplify/cli',
            'git clone https://github.com/flutter/flutter.git -b stable --depth 1 /tmp/flutter',
            'export PATH=$PATH:/tmp/flutter/bin',
            'flutter doctor',
          ],
        },
        pre_build: {
          commands: [
            `yarn nx config crud-backend --app=${appConfig.name} --stage=${stage}`,
            `yarn nx config shared-config --app=${appConfig.name} --stage=${stage}`,
            `yarn nx build anyupp-gql-api --skip-nx-cache`,
          ],
        },
        build: {
          commands: [
            `yarn nx build-schema crud-backend --skip-nx-cache --stage=${stage}`,
            `yarn nx build admin ${adminConfig} --skip-nx-cache`,
            `yarn nx build anyupp-backend --skip-nx-cache --stage=${stage} --app=${appConfig.name}`,
            `yarn nx buildApk anyupp-mobile`,
          ],
        },
        post_build: {
          commands: [
            `yarn nx deploy crud-backend`,
            'tar -cvf ${CODEBUILD_RESOLVED_SOURCE_VERSION}.tgz apps/anyupp-mobile/lib/awsconfiguration.dart',
            `aws s3 cp \${CODEBUILD_RESOLVED_SOURCE_VERSION}.tgz s3://${getAppcenterArtifactBucketName(
              stage,
            )}/`,
          ],
        },
      },
      artifacts: {
        files: [
          'apps/anyupp-backend/cdk.out/**/*',
          'apps/anyupp-mobile/build/app/outputs/flutter-apk/**/*',
        ],
      },
      env: {
        'secrets-manager': {
          AWS_ACCESS_KEY_ID: 'codebuild:codebuild-aws_access_key_id',
          AWS_SECRET_ACCESS_KEY: 'codebuild:codebuild-aws_secret_access_key',
        },
        variables: {
          NODE_OPTIONS:
            '--unhandled-rejections=strict --max_old_space_size=8196',
        },
      },
    }),
    cache,
    environment: {
      //      buildImage: utils.getBuildImage(stack),
      computeType: codebuild.ComputeType.MEDIUM,
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
          commands: ['yarn --frozen-lockfile'],
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
      env: {
        variables: {
          NODE_OPTIONS:
            '--unhandled-rejections=strict --max_old_space_size=8196',
        },
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
            'yarn --frozen-lockfile',
            'npm install -g @aws-amplify/cli',
          ],
        },
        pre_build: {
          commands: [
            `yarn nx config crud-backend --app=${appConfig.name} --stage=${stage}`,
            `yarn nx config shared-config --app=${appConfig.name} --stage=${stage}`,
            `yarn nx build anyupp-gql-api --skip-nx-cache`,
          ],
        },
        build: {
          commands: [
            `yarn nx test integration-tests-universal --codeCoverage --coverageReporters=clover`,
            `yarn nx test integration-tests-angular --codeCoverage --coverageReporters=clover`,
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
        variables: {
          NODE_OPTIONS:
            '--unhandled-rejections=strict --max_old_space_size=8196',
        },
      },
    }),
    cache,
    environment: {
      buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_3,
    },
  });

export const createApkPublishProject = (
  stack: sst.Stack,
  cache: codebuild.Cache,
  stage: string,
): codebuild.PipelineProject =>
  new codebuild.PipelineProject(stack, 'publishApk', {
    buildSpec: codebuild.BuildSpec.fromObject({
      version: '0.2',
      phases: {
        install: {
          commands: ['npm install -g appcenter-cli'],
        },
        build: {
          commands: [`echo 'Pushing APK to appcenter...'`],
        },
        post_build: {
          commands: [`sh ./tools/publish-to-appcenter.sh ${stage} android`],
        },
      },
      env: {
        'secrets-manager': {
          AWS_ACCESS_KEY_ID: 'codebuild:codebuild-aws_access_key_id',
          AWS_SECRET_ACCESS_KEY: 'codebuild:codebuild-aws_secret_access_key',
          APP_CENTER_TOKEN: 'codebuild:codebuild-appcenter-token',
        },
        variables: {
          NODE_OPTIONS:
            '--unhandled-rejections=strict --max_old_space_size=8196',
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
): {adminSiteUrl: string} => {
  const adminSiteUrl = ssm.StringParameter.fromStringParameterName(
    stack,
    'AdminSiteUrlParamDev',
    `/${stage}-${appConfig.name}/generated/AdminSiteUrl`,
  ).stringValue;

  return {adminSiteUrl};
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

export const createCommonPipelineParts = (
  scope: sst.Stack,
  stage: string,
  props: utils.PipelineStackProps,
) => {
  const sourceOutput = new codepipeline.Artifact();
  const buildOutput = new codepipeline.Artifact('buildOutput');
  const e2eOutput = new codepipeline.Artifact();
  const cache = codebuild.Cache.local(codebuild.LocalCacheMode.CUSTOM);

  const {adminSiteUrl} = utils.configurePipeline(scope, stage);
  const build = utils.createBuildProject(scope, cache, stage);
  const e2eTest = utils.createE2eTestProject(scope, cache, adminSiteUrl);
  const integrationTest = utils.createIntegrationTestProject(
    scope,
    cache,
    stage,
  );
  const publishAndroidToAppcenter = utils.createApkPublishProject(
    scope,
    cache,
    stage,
  );

  const prefix = utils.projectPrefix(stage);

  const buildArtifactBucket = new s3.Bucket(scope, 'ArtifactBucket', {
    bucketName: getAppcenterArtifactBucketName(stage),
    publicReadAccess: true,
    removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT recommended for production code
  });

  utils.configurePermissions(
    scope,
    props.secretsManager,
    [build, integrationTest, publishAndroidToAppcenter],
    prefix,
  );

  const pipeline = new codepipeline.Pipeline(scope, 'Pipeline', {
    stages: [
      {
        stageName: 'CloneSource',
        actions: [
          new codepipeline_actions.GitHubSourceAction({
            actionName: 'CodeCommit_CloneSource',
            oauthToken: props.secretsManager.githubOauthToken.secretValue,
            output: sourceOutput,
            owner: props.repoOwner,
            repo: props.repoName,
            branch: props.repoBranch,
          }),
        ],
      },
      {
        stageName: 'Build',
        actions: [
          new codepipeline_actions.CodeBuildAction({
            actionName: 'Build',
            project: build,
            input: sourceOutput,
            outputs: [buildOutput],
          }),
        ],
      },
      {
        stageName: 'StackCreation',
        actions: [
          new codepipeline_actions.CloudFormationCreateUpdateStackAction({
            actionName: `CreateStack`,
            templatePath: buildOutput.atPath(
              `apps/anyupp-backend/cdk.out/${stage}-${utils.appConfig.name}-anyupp.template.json`,
            ),
            stackName: `${utils.projectPrefix(stage)}-anyupp`,
            adminPermissions: true,
            extraInputs: [buildOutput],
            replaceOnFailure: true,
          }),
        ],
      },
      {
        stageName: 'SeederRemoval',
        actions: [
          new codepipeline_actions.CloudFormationDeleteStackAction({
            actionName: `DeleteSeederStack`,
            stackName: `${utils.projectPrefix(stage)}-seeder`,
            adminPermissions: true,
          }),
        ],
      },
      {
        stageName: 'publishAndroidToAppcenter',
        actions: [
          new codepipeline_actions.CodeBuildAction({
            actionName: 'publishAndroidToAppcenter',
            project: publishAndroidToAppcenter,
            input: buildOutput,
          }),
        ],
      },
      {
        stageName: 'integrationTest',
        actions: [
          new codepipeline_actions.CodeBuildAction({
            actionName: 'integrationTest',
            project: integrationTest,
            input: sourceOutput,
          }),
        ],
      },
      {
        stageName: 'e2eTest',
        actions: [
          new codepipeline_actions.CodeBuildAction({
            actionName: 'e2eTest',
            project: e2eTest,
            input: sourceOutput,
            outputs: [e2eOutput],
          }),
        ],
      },
    ],
  });

  utils.configurePipelineNotifications(
    scope,
    pipeline.pipelineArn,
    props.chatbot,
    stage,
  );

  buildArtifactBucket.grantWrite(pipeline.role);
};
