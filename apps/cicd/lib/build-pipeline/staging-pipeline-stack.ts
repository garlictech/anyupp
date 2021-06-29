import * as sst from '@serverless-stack/resources';
import * as utils from './utils';

export class StagingBuildPipelineStack extends sst.Stack {
  constructor(app: sst.App, id: string, props: utils.PipelineStackProps) {
    super(app, id, props);
    const stage = 'staging';

    utils.createPipeline(this, stage, {
      ...props,
      buildProjectPhases: {
        install: {
          commands: [
            'chmod +x ./tools/*.sh',
            `./tools/setup-aws-environment.sh`,
            './tools/install-nodejs-14.sh',
            'yarn --frozen-lockfile',
            'npm install -g @aws-amplify/cli appcenter-cli',
          ],
        },
        build: {
          commands: [
            `./tools/build-workspace.sh ${utils.appConfig.name} ${stage}`,
            'git clone https://github.com/flutter/flutter.git -b stable --depth 1 /tmp/flutter',
            `yarn nx deploy crud-backend --stage=${stage} --app=${utils.appConfig.name}`,
            `yarn nx deploy anyupp-backend --stage=${stage} --app=${utils.appConfig.name}`,
            'export PATH=$PATH:/tmp/flutter/bin',
            'flutter doctor',
            `yarn nx buildApk anyupp-mobile`,
          ],
        },
        post_build: {
          commands: [
            'tar -cvf ${CODEBUILD_RESOLVED_SOURCE_VERSION}.tgz apps/anyupp-mobile/lib/awsconfiguration.dart',
            `aws s3 cp \${CODEBUILD_RESOLVED_SOURCE_VERSION}.tgz s3://${utils.getAppcenterArtifactBucketName(
              stage,
            )}/`,
            `echo 'Pushing Android APK to appcenter'`,
            `./tools/publish-to-appcenter.sh ${stage} android`,
            `echo 'Triggering ios app build in appcenter...'`,
            `./tools/trigger-appcenter-builds.sh ${stage} ios`,
          ],
        },
      },
    });
  }
}
