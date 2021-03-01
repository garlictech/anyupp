import * as sst from '@serverless-stack/resources';
import * as sm from '@aws-cdk/aws-secretsmanager';

export interface SecretsManagerStackProps extends sst.StackProps {
  secretsManagerArn: string;
}

export class SecretsManagerStack extends sst.Stack {
  public githubOauthToken: sm.ISecret;
  public secrets: sm.ISecret;

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

    this.secrets = sm.Secret.fromSecretAttributes(this, 'Secrets', {
      secretArn: props.secretsManagerArn,
    });
  }
}
