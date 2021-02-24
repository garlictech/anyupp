import * as utils from './utils';
import * as sst from '@serverless-stack/resources';
import * as codebuild from '@aws-cdk/aws-codebuild';
import { PipelineStackProps } from './utils';

export class DevPullRequestBuildStack extends sst.Stack {
  constructor(app: sst.App, id: string, props: PipelineStackProps) {
    super(app, id, props);

    const stage = 'dev';
    const prefix = utils.projectPrefix(stage);

    const githubPrSource = codebuild.Source.gitHub({
      owner: props.repoOwner,
      repo: props.repoName,
      webhook: true,
      webhookFilters: [
        codebuild.FilterGroup.inEventOf(
          codebuild.EventAction.PULL_REQUEST_CREATED,
        ).andBaseBranchIs(stage),
        codebuild.FilterGroup.inEventOf(
          codebuild.EventAction.PULL_REQUEST_UPDATED,
        ).andBaseBranchIs(stage),
      ],
    });

    const project = new codebuild.Project(
      this,
      'AnyUpp:DEV Verify Pull Request',
      {
        source: githubPrSource,
        buildSpec: codebuild.BuildSpec.fromObject({
          version: '0.2',
          phases: {
            install: {
              commands: ['yarn'],
            },
            pre_build: {
              commands: [
                `yarn nx config shared-config --app=${utils.appConfig.name} --stage=${stage}`,
              ],
            },
            build: {
              commands: [
                `yarn nx affected:lint --base=${stage} --with-deps`,
                `yarn nx affected:test --base=${stage} --with-deps --exclude="anyupp-mobile" --codeCoverage --coverageReporters=clover`,
                `yarn nx affected:build --base=${stage} --with-deps --exclude="infrastructure-*" --stage=${stage} --app=${utils.appConfig.name} --configuration=${stage}`,
                `yarn nx build infrastructure-anyupp-backend-stack" --stage=${stage} --app=${utils.appConfig.name}`,
              ],
            },
          },
          reports: {
            coverage: {
              files: ['coverage/**/*'],
              'file-format': 'CLOVERXML',
            },
          },
        }),
        environment: {
          buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_3,
        },
      },
    );

    utils.configurePermissions(this, props.secretsManager, project, prefix);

    utils.configurePRNotifications(
      this,
      project.projectArn,
      props.chatbot,
      stage,
    );
    //new ssm.StringParameter(this, 'DevPullRequestBuildStackArn', {
    //  allowedPattern: '.*',
    //  description: 'ARN of the PR build project',
    //  parameterName: app.logicalPrefixedName('DevPullRequestBuildStackArn'),
    //  stringValue: project.projectArn,
    //});
  }
}
