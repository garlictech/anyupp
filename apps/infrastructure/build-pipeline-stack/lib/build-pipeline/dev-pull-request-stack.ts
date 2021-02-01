import * as sst from '@serverless-stack/resources';
import * as codebuild from '@aws-cdk/aws-codebuild';
import { SecretsManagerStack } from './secretsmanager-stack';

export { SecretsManagerStack };

export interface PipelineStackProps extends sst.StackProps {
  readonly secretsManager: SecretsManagerStack;
  readonly repoName: string;
  readonly repoOwner: string;
  readonly repoBranch: string;
}

export class DevPullRequestBuildStack extends sst.Stack {
  constructor(app: sst.App, id: string, props: PipelineStackProps) {
    super(app, id, props);

    new codebuild.GitHubSourceCredentials(this, 'CodeBuildGitHubCreds', {
      accessToken: props.secretsManager.githubOauthToken.secretValue
    });

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

    new codebuild.Project(this, 'PullRequestClone', {
      source: githubPrSource,
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          install: {
            commands: ['yarn']
          },
          build: {
            commands: [
              'yarn nx affected:lint --base=dev',
              'yarn nx affected:test --base=dev',
              'yarn nx affected:build --base=dev'
            ]
          }
        }
      }),
      environment: {
        buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_3
      }
    });
  }
}
