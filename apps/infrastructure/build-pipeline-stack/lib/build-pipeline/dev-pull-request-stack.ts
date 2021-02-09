import * as iam from '@aws-cdk/aws-iam';
import * as sst from '@serverless-stack/resources';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codestarnotifications from '@aws-cdk/aws-codestarnotifications';
import { SecretsManagerStack } from './secretsmanager-stack';
import * as chatbot from '@aws-cdk/aws-chatbot';
import { v1 as uuid } from 'uuid';

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
              'yarn nx affected:test --base=dev --with-deps',
              'yarn nx ffected:build --base=dev --with-deps'
            ]
          }
        }
      }),
      environment: {
        buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_3
      }
    });

    const role = new iam.Role(this, 'CodeBuildRole', {
      assumedBy: project.grantPrincipal
    });

    role.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        resources: [props.secretsManager.secretsManagerArn],
        actions: ['secretsmanager:GetSecretValue']
      })
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
        name: 'AnyUppDevPRNotification-' + uuid(),
        resource: project.projectArn,
        targets: [
          {
            targetAddress: props.chatbot.slackChannelConfigurationArn,
            targetType: 'AWSChatbotSlack'
          }
        ]
      }
    );
  }
}
