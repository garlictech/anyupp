import * as sst from '@serverless-stack/resources';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import * as utils from './utils';

export class QABuildPipelineStack extends sst.Stack {
  constructor(app: sst.App, id: string, props: utils.PipelineStackProps) {
    super(app, id, props);

    const sourceOutput = new codepipeline.Artifact();
    const buildOutput = new codepipeline.Artifact();
    const cache = codebuild.Cache.local(codebuild.LocalCacheMode.CUSTOM);

    const stage = 'qa';
    const { adminSiteUrl } = utils.configurePipeline(this, stage);
    const build = utils.createBuildProject(this, cache, stage);
    const e2eTest = utils.createE2eTestProject(this, cache, adminSiteUrl);
    const prefix = utils.projectPrefix(stage);

    utils.configurePermissions(this, props.secretsManager, build, prefix);

    const pipeline = new codepipeline.Pipeline(this, 'Pipeline', {
      stages: [
        {
          stageName: 'CloneSource',
          actions: [
            new codepipeline_actions.GitHubSourceAction({
              actionName: 'CodeCommit_CloneSource',
              oauthToken: props.secretsManager.githubOauthToken.secretValue,
              output: sourceOutput,
              owner: props.repoOwner,
              repo: props.repoName,
              branch: props.repoBranch,
            }),
          ],
        },
        {
          stageName: 'Build',
          actions: [
            new codepipeline_actions.CodeBuildAction({
              actionName: 'Build',
              project: build,
              input: sourceOutput,
              outputs: [buildOutput],
            }),
          ],
        },
        {
          stageName: 'StackCreation',
          actions: [
            new codepipeline_actions.CloudFormationCreateUpdateStackAction({
              actionName: `CreateStack`,
              templatePath: buildOutput.atPath(
                `apps/infrastructure/anyupp-backend-stack/cdk.out/${stage}-${utils.appConfig.name}-anyupp.template.json`,
              ),
              stackName: `${utils.projectPrefix}-anyupp`,
              adminPermissions: true,
              extraInputs: [buildOutput],
              replaceOnFailure: true,
            }),
          ],
        },
        {
          stageName: 'e2eTest',
          actions: [
            new codepipeline_actions.CodeBuildAction({
              actionName: 'e2eTest',
              project: e2eTest,
              input: sourceOutput,
            }),
          ],
        },
      ],
    });

    utils.configurePipelineNotifications(
      this,
      pipeline.pipelineArn,
      props.chatbot,
      stage,
    );
  }
}
