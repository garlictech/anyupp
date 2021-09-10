import * as sst from '@serverless-stack/resources';
import * as utils from './utils';

export class ProdBuildPipelineStack extends sst.Stack {
  constructor(app: sst.App, id: string, props: utils.PipelineStackProps) {
    super(app, id, props);
    const stage = 'prod';

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
          commands: [`apps/cicd/scripts/prod-build.sh ${stage} $CI`],
        },
        post_build: {
          commands: [
            `apps/cicd/scripts/prod-post_build.sh ${stage} ${utils.getAppcenterArtifactBucketName(
              stage,
            )}`,
          ],
        },
      },
    });
  }
}
