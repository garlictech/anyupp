import * as sst from '@serverless-stack/resources';
import * as sm from '@aws-cdk/aws-secretsmanager';

export interface SecretsManagerStackProps extends sst.StackProps {
  projectSecretsManagerArn: string;
  pipelineSecretsManagerArn: string;
}

export class SecretsManagerStack extends sst.Stack {
  public githubOauthToken: sm.ISecret;
  public projectSecrets: sm.ISecret;
  public pipelineSecrets: sm.ISecret;

  constructor(scope: sst.App, id: string, props: SecretsManagerStackProps) {
    super(scope, id, props);

    this.githubOauthToken = sm.Secret.fromSecretAttributes(
      this,
      'GithubOauthTokenSecret',
      {
        secretArn:
          'arn:aws:secretsmanager:eu-west-1:568276182587:secret:GithubAccessToken-2xxxSw',
      },
    );

    this.projectSecrets = sm.Secret.fromSecretAttributes(
      this,
      'ProjectSecrets',
      {
        secretArn: props.projectSecretsManagerArn,
      },
    );

    this.pipelineSecrets = sm.Secret.fromSecretAttributes(
      this,
      'PipelineSecrets',
      {
        secretArn: props.pipelineSecretsManagerArn,
      },
    );
  }
}
