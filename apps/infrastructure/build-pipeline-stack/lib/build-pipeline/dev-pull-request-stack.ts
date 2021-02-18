import * as ssm from '@aws-cdk/aws-ssm';
import * as sst from '@serverless-stack/resources';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codestarnotifications from '@aws-cdk/aws-codestarnotifications';
import { SecretsManagerStack } from './secretsmanager-stack';
import * as chatbot from '@aws-cdk/aws-chatbot';
import { configurePermissions } from './utils';

export interface DevPullRequestBuildStackProps extends sst.StackProps {
  readonly chatbot: chatbot.SlackChannelConfiguration;
  readonly repoName: string;
  readonly repoOwner: string;
  readonly repoBranch: string;
  readonly secretsManager: SecretsManagerStack;
}

export class DevPullRequestBuildStack extends sst.Stack {
  constructor(app: sst.App, id: string, props: DevPullRequestBuildStackProps) {
    super(app, id, props);

    const githubPrSource = codebuild.Source.gitHub({
      owner: props.repoOwner,
      repo: props.repoName,
      webhook: true,
      webhookFilters: [
        codebuild.FilterGroup.inEventOf(
          codebuild.EventAction.PULL_REQUEST_CREATED
        ),
        codebuild.FilterGroup.inEventOf(
          codebuild.EventAction.PULL_REQUEST_UPDATED
        )
      ]
    });

    const project = new codebuild.Project(this, 'AnyUpp Verify Pull Request', {
      source: githubPrSource,
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        env: {
          variables: {
            NODE_OPTIONS: '--unhandled-rejections=strict'
          }
        },
        phases: {
          install: {
            commands: ['yarn']
          },
          pre_build: {
            commands: ['yarn nx config shared-config']
          },
          build: {
            commands: [
              'yarn nx affected:lint --base=dev --with-deps',
              'yarn nx affected:test --base=dev --with-deps --exclude="anyupp-mobile"',
              'yarn nx affected:build --base=dev --with-deps --exclude="infrastructure-build-pipeline-stack"'
            ]
          }
        }
      }),
      environment: {
        buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_3
      }
    });

    configurePermissions(
      this,
      props.secretsManager,
      project,
      'dev-anyupp-backend'
    );

    new codestarnotifications.CfnNotificationRule(
      this,
      'PullRequestNotification',
      {
        detailType: 'FULL',
        eventTypeIds: [
          'codebuild-project-build-state-in-progress',
          'codebuild-project-build-state-failed',
          'codebuild-project-build-state-succeeded'
        ],
        name: 'AnyUppDevPRNotification',
        resource: project.projectArn,
        targets: [
          {
            targetAddress: props.chatbot.slackChannelConfigurationArn,
            targetType: 'AWSChatbotSlack'
          }
        ]
      }
    );

    new ssm.StringParameter(this, 'DevPullRequestBuildStackArn', {
      allowedPattern: '.*',
      description: 'ARN of the PR build project',
      parameterName: app.logicalPrefixedName('DevPullRequestBuildStackArn'),
      stringValue: project.projectArn
    });
  }
}
