import * as utils from './utils';
import * as sst from '@serverless-stack/resources';
import * as codebuild from '@aws-cdk/aws-codebuild';
import {PipelineStackProps} from './utils';

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
                `yarn nx config shared-config --app=${utils.appConfig.name} --stage=${stage}`,
                `yarn nx config crud-backend --app=${utils.appConfig.name} --stage=${stage}`,
                `yarn nx build anyupp-gql-api --skip-nx-cache`,
              ],
            },
            build: {
              commands: [
                `yarn nx build-schema crud-backend --skip-nx-cache --stage=${stage}`,
                `yarn nx affected:lint --base=${stage} --with-deps`,
                `yarn nx affected:test --base=${stage} --with-deps --exclude="anyupp-mobile" --exclude="integration-tests-angular" --exclude="integration-tests-universal" --codeCoverage --coverageReporters=clover`,
                `yarn nx build admin --skip-nx-cache`,
                `yarn nx build anyupp-backend --skip-nx-cache --stage=${stage} --app=${utils.appConfig.name}`,
                `yarn nx buildApk anyupp-mobile`,
              ],
            },
          },
          env: {
            'secrets-manager': {
              AWS_ACCESS_KEY_ID: 'codebuild:codebuild-aws_access_key_id',
              AWS_SECRET_ACCESS_KEY:
                'codebuild:codebuild-aws_secret_access_key',
            },
            variables: {
              NODE_OPTIONS:
                '--unhandled-rejections=strict --max_old_space_size=8196',
            },
          },
        }),
        environment: {
          buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_3,
          computeType: codebuild.ComputeType.MEDIUM,

          //          buildImage: utils.getBuildImage(this),
        },
      },
    );

    utils.configurePermissions(this, props.secretsManager, [project], prefix);

    utils.configurePRNotifications(
      this,
      project.projectArn,
      props.chatbot,
      stage,
    );
  }
}
