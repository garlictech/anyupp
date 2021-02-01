import { App } from '@serverless-stack/resources';
import {
  DevBuildPipelineStack,
  PipelineStackProps
} from './build-pipeline/pipeline-stack';
import { SecretsManagerStack } from './build-pipeline/secretsmanager-stack';
import { DevPullRequestBuildStack } from './build-pipeline/dev-pull-request-stack';

export { App };

export default function main(app: App): void {
  const secretsManagerStack = new SecretsManagerStack(app, 'secretsmanager');

  const repoConfig: PipelineStackProps = {
    repoOwner: 'bgap',
    repoName: 'anyupp',
    repoBranch: 'dev',
    secretsManager: secretsManagerStack
  };

  new DevBuildPipelineStack(app, 'DevBuildPipelineStack', repoConfig);

  new DevPullRequestBuildStack(app, 'DevPullRequestBuildStack', repoConfig);
}
