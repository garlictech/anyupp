import * as ssm from '@aws-cdk/aws-ssm';
import { CfnOutput, Duration } from '@aws-cdk/core';
import * as cognito from '@aws-cdk/aws-cognito';
import { App, Stack, StackProps } from '@serverless-stack/resources';

export interface CognitoStackProps extends StackProps {
  adminSiteUrl: string;
  googleClientId: string;
  googleClientSecret: string;
  facebookClientId: string;
  facebookClientSecret: string;
}

export class CognitoStack extends Stack {
  public userPool: cognito.UserPool;
  constructor(scope: App, id: string, props: CognitoStackProps) {
    super(scope, id, props);
    const app = this.node.root as App;

    this.userPool = new cognito.UserPool(this, 'UserPool', {
      userPoolName: app.logicalPrefixedName('user-pool'),
      selfSignUpEnabled: true, // Allow users to sign up
      autoVerify: { email: true }, // Verify email addresses by sending a verification code
      userVerification: {
        emailSubject: 'Verify your email for AnyUpp',
        emailBody:
          'Hello {username}, Thanks for signing up to AnyUpp! Your verification code is {####}',
        emailStyle: cognito.VerificationEmailStyle.CODE,
        smsMessage:
          'Hello {username}, Thanks for signing up to AnyUpp! Your verification code is {####}',
      },
      signInAliases: {
        phone: true,
        email: true,
      },
      mfa: cognito.Mfa.OPTIONAL,
      mfaSecondFactor: {
        sms: true,
        otp: true,
      },
      passwordPolicy: {
        minLength: 12,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: false,
        tempPasswordValidity: Duration.days(3),
      },
      accountRecovery: cognito.AccountRecovery.PHONE_WITHOUT_MFA_AND_EMAIL,
    });

    const domain = new cognito.UserPoolDomain(this, 'CognitoDomain', {
      userPool: this.userPool,
      cognitoDomain: {
        domainPrefix: app.stage + '-' + app.name,
      },
    });

    const googleIdProvider = new cognito.UserPoolIdentityProviderGoogle(
      this,
      'Google',
      {
        userPool: this.userPool,
        clientId: props.googleClientId,
        clientSecret: props.googleClientSecret,
        attributeMapping: {
          email: cognito.ProviderAttribute.GOOGLE_EMAIL,
        },
        scopes: ['profile', 'email', 'openid'],
      },
    );

    const facebookIdProvider = new cognito.UserPoolIdentityProviderFacebook(
      this,
      'Facebook',
      {
        userPool: this.userPool,
        clientId: props.facebookClientId,
        clientSecret: props.facebookClientSecret,
        attributeMapping: {
          email: cognito.ProviderAttribute.FACEBOOK_EMAIL,
        },
        scopes: ['public_profile', 'email', 'openid'],
      },
    );

    let callbackUrls = [props.adminSiteUrl];
    let logoutUrls = [props.adminSiteUrl];

    if (app.stage === 'dev') {
      callbackUrls.push('http://localhost:4200');
      logoutUrls.push('http://localhost:4200');
    }

    callbackUrls = callbackUrls.map(url => `${url}/admin/dashboard`);
    logoutUrls = logoutUrls.map(url => `${url}/auth/logout`);

    const userPoolClient = new cognito.UserPoolClient(this, 'UserPoolClient', {
      userPool: this.userPool,
      generateSecret: false, // Don't need to generate secret for web app running on browsers
      preventUserExistenceErrors: true,
      authFlows: {
        userPassword: true,
        userSrp: true,
      },
      oAuth: {
        flows: {
          authorizationCodeGrant: true,
        },
        scopes: [cognito.OAuthScope.OPENID],
        callbackUrls,
        logoutUrls,
      },
      supportedIdentityProviders: [
        cognito.UserPoolClientIdentityProvider.GOOGLE,
        cognito.UserPoolClientIdentityProvider.FACEBOOK,
        cognito.UserPoolClientIdentityProvider.COGNITO,
      ],
    });

    userPoolClient.node.addDependency(googleIdProvider);
    userPoolClient.node.addDependency(facebookIdProvider);

    const identityPool = new cognito.CfnIdentityPool(this, 'IdentityPool', {
      allowUnauthenticatedIdentities: false, // Don't allow unathenticated users
      cognitoIdentityProviders: [
        {
          clientId: userPoolClient.userPoolClientId,
          providerName: this.userPool.userPoolProviderName,
        },
      ],
    });

    // Exportvalues
    const userPoolId = 'UserPoolId';
    new CfnOutput(this, userPoolId, {
      value: this.userPool.userPoolId,
      exportName: app.logicalPrefixedName(userPoolId),
    });
    new ssm.StringParameter(this, userPoolId + 'Param', {
      allowedPattern: '.*',
      description: 'The user pool ID',
      parameterName: app.logicalPrefixedName(userPoolId),
      stringValue: this.userPool.userPoolId,
    });

    const userPoolClientId = 'UserPoolClientId';
    new CfnOutput(this, userPoolClientId, {
      value: userPoolClient.userPoolClientId,
      exportName: app.logicalPrefixedName(userPoolClientId),
    });
    new ssm.StringParameter(this, userPoolClientId + 'Param', {
      allowedPattern: '.*',
      description: 'The user pool client ID',
      parameterName: app.logicalPrefixedName(userPoolClientId),
      stringValue: userPoolClient.userPoolClientId,
    });

    const identityPoolId = 'IdentityPoolId';
    new CfnOutput(this, identityPoolId, {
      value: identityPool.ref,
      exportName: app.logicalPrefixedName(identityPoolId),
    });
    new ssm.StringParameter(this, identityPoolId + 'Param', {
      allowedPattern: '.*',
      description: 'The identity pool ID',
      parameterName: app.logicalPrefixedName(identityPoolId),
      stringValue: identityPool.ref,
    });

    const userPoolDomainId = 'UserPoolDomain';
    new CfnOutput(this, userPoolDomainId, {
      value: domain.baseUrl(),
      exportName: app.logicalPrefixedName(userPoolDomainId),
    });
    new ssm.StringParameter(this, userPoolDomainId + 'Param', {
      allowedPattern: '.*',
      description: 'The user pool domain',
      parameterName: app.logicalPrefixedName(userPoolDomainId),
      stringValue: domain.baseUrl(),
    });
  }
}
