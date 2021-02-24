import * as sst from '@serverless-stack/resources';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as utils from './utils';

export class QAPullRequestBuildStack extends sst.Stack {
  constructor(app: sst.App, id: string, props: utils.PipelineStackProps) {
    super(app, id, props);

    const prevStage = 'dev';
    const stage = 'qa';
    const testStage = 'qa-test';
    const prefix = utils.projectPrefix(stage);

    ['stripePublishableKey', 'googleClientId'].forEach(name =>
      utils.copyParameter(name, stage, testStage, this),
    );

    const githubPrSource = codebuild.Source.gitHub({
      owner: props.repoOwner,
      repo: props.repoName,
      webhook: true,
      webhookFilters: [
        codebuild.FilterGroup.inEventOf(
          codebuild.EventAction.PULL_REQUEST_CREATED,
        )
          .andBranchIs(prevStage)
          .andBaseBranchIs(stage),
        codebuild.FilterGroup.inEventOf(
          codebuild.EventAction.PULL_REQUEST_UPDATED,
        )
          .andBranchIs(prevStage)
          .andBaseBranchIs(stage),
      ],
    });

    const { adminSiteUrl } = utils.configurePipeline(this, stage);
    const cache = codebuild.Cache.local(codebuild.LocalCacheMode.CUSTOM);

    const project = new codebuild.Project(
      this,
      'AnyUpp:QA Verify Pull Request',
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
                `yarn nx affected:build --base=${stage} --with-deps --exclude="infrastructure-build-pipeline-stack" --stage=${stage} --app=${utils.appConfig.name} --configuration=${stage}`,
                `yarn nx deploy infrastructure-anyupp-backend-stack --stage="${testStage}"`,
                `yarn nx e2e-remote admin-e2e --headless --baseUrl=${adminSiteUrl}`,
              ],
            },
            post_build: {
              commands: [
                `yarn nx remove infrastructure-anyupp-backend-stack --stage="${testStage}"`,
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
      },
    );

    utils.configurePermissions(this, props.secretsManager, project, prefix);

    utils.configurePRNotifications(
      this,
      project.projectArn,
      props.chatbot,
      stage,
    );
  }
}
