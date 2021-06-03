import * as sst from '@serverless-stack/resources';
import * as utils from './utils';

export class QABuildPipelineStack extends sst.Stack {
  constructor(app: sst.App, id: string, props: utils.PipelineStackProps) {
    super(app, id, props);
    utils.createCommonDevPipeline(this, 'qa', props);
  }
}
