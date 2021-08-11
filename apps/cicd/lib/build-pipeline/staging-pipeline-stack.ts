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
          commands: ['apps/cicd/scripts/stage-install.sh'],
          'runtime-versions': {
            nodejs: 14,
          },
        },
        build: {
          commands: [
            `./tools/build-workspace.sh ${utils.appConfig.name} ${stage}`,
            `yarn nx deploy crud-backend --stage=${stage} --app=${utils.appConfig.name}`,
            `yarn nx deploy anyupp-backend --stage=${stage} --app=${utils.appConfig.name}`,
            `yarn nx buildApk-ci anyupp-mobile`,
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
