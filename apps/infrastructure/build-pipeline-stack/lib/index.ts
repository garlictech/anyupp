import { App } from '@serverless-stack/resources';
import { PipelineStack } from './build-pipeline/pipeline-stack';
import { SecretsManagerStack } from './build-pipeline/secretsmanager-stack';

export { App };

export default function main(app: App): void {
  const secretsManagerStack = new SecretsManagerStack(app, 'secretsmanager');

  new PipelineStack(app, 'PipelineStack', {
    repoOwner: 'bgap',
    repoName: 'anyupp',
    repoBranch: 'dev',
    secretsManager: secretsManagerStack
  });
}
