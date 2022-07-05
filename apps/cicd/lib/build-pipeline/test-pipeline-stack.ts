import { App, Stack } from '@serverless-stack/resources';
import { createCommonDevPipeline, PipelineStackProps } from './utils';

export class TestBuildPipelineStack extends Stack {
  constructor(app: App, id: string, props: PipelineStackProps) {
    super(app, id, props);

    createCommonDevPipeline(this, 'test', props);
  }
}
