import * as ssm from '@aws-cdk/aws-ssm';
import * as sst from '@serverless-stack/resources';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codestarnotifications from '@aws-cdk/aws-codestarnotifications';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import { SecretsManagerStack } from './secretsmanager-stack';
import * as chatbot from '@aws-cdk/aws-chatbot';
import { configurePermissions } from './utils';

export { SecretsManagerStack };

export interface PipelineStackProps extends sst.StackProps {
  readonly chatbot: chatbot.SlackChannelConfiguration;
  readonly secretsManager: SecretsManagerStack;
  readonly repoName: string;
  readonly repoOwner: string;
  readonly repoBranch: string;
}

export class DevBuildPipelineStack extends sst.Stack {
  constructor(app: sst.App, id: string, props: PipelineStackProps) {
    super(app, id, props);

    new codebuild.GitHubSourceCredentials(this, 'CodeBuildGitHubCreds', {
      accessToken: props.secretsManager.githubOauthToken.secretValue,
    });

    const sourceOutput = new codepipeline.Artifact();
    const buildOutput = new codepipeline.Artifact();

    const cache = codebuild.Cache.local(codebuild.LocalCacheMode.CUSTOM);

    const adminSiteUrl = ssm.StringParameter.fromStringParameterName(
      this,
      'AdminSiteUrlParam2',
      'dev-anyupp-backend-AdminSiteUrl',
    ).stringValue;

    const build = new codebuild.PipelineProject(this, 'Build', {
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

    // Build + deploy project
    //new codebuild.PipelineProject(this, 'Deploy', {
    //  buildSpec: codebuild.BuildSpec.fromObject({
    //    version: '0.2',
    //    phases: {
    //      install: {
    //        commands: ['yarn'],
    //      },
    //      pre_build: {
    //        commands: ['yarn nx config shared-config'],
    //      },
    //      build: {
    //        commands: [
    //          'yarn nx run-many --target build --projects admin,infrastructure-anyupp-backend-stack',
    //          'yarn nx target deploy --projects infrastructure-anyupp-backend-stack',
    //        ],
    //      },
    //      post_build: {
    //        commands: [
    //          `yarn nx e2e admin-e2e --headless --baseUrl=${adminSiteUrl}`,
    //        ],
    //      },
    //    },
    //  }),
    //  environment: {
    //    buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_3,
    //  },
    //});

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
        // deploy test stack
        // test the test stack
        // create change set
        // deploy
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
          stageName: 'Deploy',
          actions: [
            new codepipeline_actions.CloudFormationCreateUpdateStackAction({
              actionName: 'ParamsStackDeploy',
              templatePath: buildOutput.atPath(
                'apps/infrastructure/anyupp-backend-stack/cdk.out/dev-anyupp-backend-ParamsStack.template.json',
              ),
              stackName: 'dev-anyupp-backend-ParamsStack',
              adminPermissions: true,
              extraInputs: [buildOutput],
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
