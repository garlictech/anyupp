export const secretsManagerArns: Record<string, string> = {
  dev: 'arn:aws:secretsmanager:eu-west-1:568276182587:secret:anyupp-dev-secrets-WtbZ0k',
  qa: 'arn:aws:secretsmanager:eu-west-1:568276182587:secret:anyupp-qa-secrets-4cFY1U',
  staging:
    'arn:aws:secretsmanager:eu-west-1:568276182587:secret:anyupp-staging-secrets-4rGQUb',
  prod: 'arn:aws:secretsmanager:eu-west-1:486782650003:secret:anyupp-prod-secrets-OQjuwn',
  appleSigninKey:
    'arn:aws:secretsmanager:eu-west-1:568276182587:secret:apple-signin-private-key-eHFjFn',
  appleSigninKeyProd:
    'arn:aws:secretsmanager:eu-west-1:486782650003:secret:apple-signin-private-key-oejVJN',
};
