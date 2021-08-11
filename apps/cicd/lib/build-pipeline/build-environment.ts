import * as sst from '@serverless-stack/resources';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as chatbot from '@aws-cdk/aws-chatbot';
import * as iam from '@aws-cdk/aws-iam';

// Info: https://aws.amazon.com/blogs/devops/creating-multi-architecture-docker-images-to-support-graviton2-using-aws-codebuild-and-aws-codepipeline/

export interface BuildEnvironmentStackProps extends sst.StackProps {
  readonly repoName: string;
  readonly repoOwner: string;
  readonly repoBranch: string;
  readonly x86SourceDir: string;
  readonly armSourceDir: string;
  readonly imageName: string;
  readonly chatbot: chatbot.SlackChannelConfiguration;
}

export class BuildEnvironmentStack extends sst.Stack {
  constructor(app: sst.App, id: string, props: BuildEnvironmentStackProps) {
    super(app, id, props);

    const githubSource = codebuild.Source.gitHub({
      owner: props.repoOwner,
      repo: props.repoName,
      branchOrRef: props.repoBranch,
      webhook: true,
    });

    const commonEnvVars = {
      AWS_ACCOUNT_ID: { value: this.account },
      AWS_DEFAULT_REGION: { value: this.region },
      IMAGE_REPO_NAME: {
        value: props.imageName,
      },
    };

    const x86Image = new codebuild.Project(this, 'AnyUpp: Docker Dev X86', {
      source: githubSource,
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_5_0,
        privileged: true,
      },
      environmentVariables: {
        ...commonEnvVars,
        IMAGE_TAG: {
          value: 'latest-amd64',
        },
        SRC_DIR: {
          value: props.x86SourceDir,
        },
      },
      cache: codebuild.Cache.local(codebuild.LocalCacheMode.DOCKER_LAYER),
    });

    const armImage = new codebuild.Project(this, 'AnyUpp: Docker Dev ARM', {
      source: githubSource,
      environment: {
        buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_ARM,
        privileged: true,
      },
      environmentVariables: {
        ...commonEnvVars,
        IMAGE_TAG: {
          value: 'latest-arm64v8',
        },
        SRC_DIR: {
          value: props.armSourceDir,
        },
      },
    });

    // For the manifest list
    const manifestBuild = new codebuild.Project(
      this,
      'AnyUpp: Docker Dev manifest',
      {
        source: githubSource,
        buildSpec: codebuild.BuildSpec.fromSourceFilename(
          'buildspec-manifest.yml',
        ),
        environment: {
          buildImage: codebuild.LinuxBuildImage.STANDARD_5_0,
          privileged: true,
        },
        environmentVariables: {
          ...commonEnvVars,
          IMAGE_TAG: {
            value: 'latest',
          },
        },
        cache: codebuild.Cache.local(codebuild.LocalCacheMode.DOCKER_LAYER),
      },
    );

    [
      [armImage, 'arm'],
      [x86Image, 'x86'],
      [manifestBuild, 'manifest'],
    ].forEach(([project_, label]) => {
      const project = project_ as codebuild.Project;
      project.role &&
        project.role.attachInlinePolicy(
          new iam.Policy(this, 'ArmImagePolicy' + label, {
            statements: [
              new iam.PolicyStatement({
                effect: iam.Effect.ALLOW,
                actions: ['ecr:*'],
                resources: ['*'],
              }),
            ],
          }),
        );
    });
  }
}
