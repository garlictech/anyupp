import * as sst from '@serverless-stack/resources';
import * as sm from '@aws-cdk/aws-secretsmanager';

export class SecretsManagerStack extends sst.Stack {
  public githubOauthToken: sm.ISecret;
  public anyuppDevSecret: sm.ISecret;

  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

    this.githubOauthToken = sm.Secret.fromSecretAttributes(
      this,
      'GithubOauthTokenSecret',
      {
        secretArn:
          'arn:aws:secretsmanager:eu-west-1:568276182587:secret:GithubAccessToken-2xxxSw'
      }
    );

    this.anyuppDevSecret = sm.Secret.fromSecretAttributes(this, 'DevSecret', {
      secretArn:
        'arn:aws:secretsmanager:eu-west-1:568276182587:secret:anyupp-dev-secrets-WtbZ0k'
    });
  }
}
