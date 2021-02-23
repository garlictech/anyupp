import * as ssm from '@aws-cdk/aws-ssm';
import * as sst from '@serverless-stack/resources';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codestarnotifications from '@aws-cdk/aws-codestarnotifications';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import { SecretsManagerStack } from './secretsmanager-stack';
import { configurePermissions, PipelineStackProps } from './utils';

export { SecretsManagerStack };

export class DevBuildPipelineStack extends sst.Stack {
  constructor(app: sst.App, id: string, props: PipelineStackProps) {
    super(app, id, props);

    const sourceOutput = new codepipeline.Artifact();
    const buildOutput = new codepipeline.Artifact();
    const cache = codebuild.Cache.local(codebuild.LocalCacheMode.CUSTOM);

    const adminSiteUrl = ssm.StringParameter.fromStringParameterName(
      this,
      'AdminSiteUrlParamDev',
      'dev-anyupp-backend-AdminSiteUrl',
    ).stringValue;

    const build = new codebuild.PipelineProject(this, 'Build', {
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          install: {
            commands: ['yarn'],
          },
          pre_build: {
            commands: ['yarn nx config shared-config'],
          },
          build: {
            commands: [
              'yarn nx build admin',
              'yarn nx build infrastructure-anyupp-backend-stack',
            ],
          },
        },
        artifacts: {
          files: ['apps/infrastructure/anyupp-backend-stack/cdk.out/**/*'],
        },
      }),
      cache,
      environment: {
        buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_3,
      },
    });

    const e2eTest = new codebuild.PipelineProject(this, 'e2eTest', {
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        env: {
          variables: {
            NODE_OPTIONS: '--unhandled-rejections=strict',
          },
        },
        phases: {
          install: {
            commands: ['yarn'],
          },
          build: {
            commands: [
              `yarn nx e2e-remote admin-e2e --headless --baseUrl=${adminSiteUrl}`,
            ],
          },
        },
        reports: {
          cypressReports: {
            files: ['cyreport/cucumber-json/**/*'],
            'file-format': 'CUCUMBERJSON',
          },
          cypressMedia: {
            files: ['dist/cypress/**/*'],
          },
        },
      }),
      cache,
      environment: {
        buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_3,
      },
    });

    configurePermissions(
      this,
      props.secretsManager,
      build,
      'dev-anyupp-backend',
    );

    const pipeline = new codepipeline.Pipeline(this, 'Pipeline', {
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
                `apps/infrastructure/anyupp-backend-stack/cdk.out/dev-anyupp-backend-anyupp.template.json`,
              ),
              stackName: `dev-anyupp-backend-anyupp`,
              adminPermissions: true,
              extraInputs: [buildOutput],
              replaceOnFailure: true,
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
            }),
          ],
        },
      ],
    });

    new codestarnotifications.CfnNotificationRule(
      this,
      'DevBuildNotification',
      {
        detailType: 'FULL',
        eventTypeIds: [
          'codepipeline-pipeline-action-execution-failed',
          'codepipeline-pipeline-action-execution-succeeded',
          'codepipeline-pipeline-action-execution-started',
          'codepipeline-pipeline-action-execution-canceled',
        ],
        name: 'AnyUppDevBuildNotification',
        resource: pipeline.pipelineArn,
        targets: [
          {
            targetAddress: props.chatbot.slackChannelConfigurationArn,
            targetType: 'AWSChatbotSlack',
          },
        ],
      },
    );
  }
}
