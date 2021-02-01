import * as sst from '@serverless-stack/resources';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import { SecretsManagerStack } from './secretsmanager-stack';

export { SecretsManagerStack };

export interface PipelineStackProps extends sst.StackProps {
  readonly secretsManager: SecretsManagerStack;
  readonly repoName: string;
  readonly repoOwner: string;
  readonly repoBranch: string;
}

export class DevBuildPipelineStack extends sst.Stack {
  constructor(app: sst.App, id: string, props: PipelineStackProps) {
    super(app, id, props);

    const buildOutput = new codepipeline.Artifact('BuildOutput');
    const sourceOutput = new codepipeline.Artifact('SourceOutput');

    // Build project
    const build = new codebuild.PipelineProject(this, 'Build', {
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          install: {
            commands: ['yarn']
          },
          build: {
            commands: [
              'yarn nx run-many --target build --projects admin,infrastructure-anyupp-backend-stack'
            ]
          }
        },
        artifacts: {
          files: [
            'dist/apps/admin/**/*',
            'apps/infrastructure/anyupp-backend-stack/.serverless',
            'node_modules/**/*'
          ]
        }
      }),
      environment: {
        buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_3
      }
    });

    // Deploy project
    const deploy = new codebuild.PipelineProject(this, 'DeployBuild', {
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          install: {
            commands: ['yarn']
          },
          build: {
            commands: ['nx deploy']
          }
        }
      }),
      environment: {
        buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_3
      }
    });

    new codepipeline.Pipeline(this, 'Pipeline', {
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
              branch: props.repoBranch
            })
          ]
        },
        {
          stageName: 'Build',
          actions: [
            new codepipeline_actions.CodeBuildAction({
              actionName: 'Build',
              project: build,
              input: sourceOutput,
              outputs: [buildOutput]
            })
          ]
        },
        {
          stageName: 'Deploy',
          actions: [
            new codepipeline_actions.CodeBuildAction({
              actionName: 'Deploy',
              project: deploy,
              input: buildOutput
            })
          ]
        }
      ]
    });
  }
}
