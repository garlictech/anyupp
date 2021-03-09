import * as ssm from '@aws-cdk/aws-ssm';
import { CfnOutput, Duration } from '@aws-cdk/core';
import * as cognito from '@aws-cdk/aws-cognito';
import * as iam from '@aws-cdk/aws-iam';
import { App, Stack, StackProps } from '@serverless-stack/resources';

export interface CognitoStackProps extends StackProps {
  adminSiteUrl: string;
  googleClientId: string;
  googleClientSecret: string;
  facebookClientId: string;
  facebookClientSecret: string;
}

type poolLabel = 'admin' | 'consumer';

export class CognitoStack extends Stack {
  public adminUserPool: cognito.UserPool;
  public consumerUserPool: cognito.UserPool;

  constructor(scope: App, id: string, props: CognitoStackProps) {
    super(scope, id, props);
    const app = this.node.root as App;

    // Consumer resources
    this.consumerUserPool = this.createConsumerUserPool(app);

    const consumerDomain = this.createDomain(
      app,
      'consumer',
      this.consumerUserPool,
    );

    const googleIdProvider = new cognito.UserPoolIdentityProviderGoogle(
      this,
      'Google',
      {
        userPool: this.consumerUserPool,
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
        userPool: this.consumerUserPool,
        clientId: props.facebookClientId,
        clientSecret: props.facebookClientSecret,
        attributeMapping: {
          email: cognito.ProviderAttribute.FACEBOOK_EMAIL,
        },
        scopes: ['public_profile', 'email', 'openid'],
      },
    );

    const consumerUserPoolClient = this.createConsumerUserPoolClient(
      this.consumerUserPool,
    );

    consumerUserPoolClient.node.addDependency(googleIdProvider);
    consumerUserPoolClient.node.addDependency(facebookIdProvider);

    // Export values
    this.createUserPoolOutputs(
      app,
      this.consumerUserPool,
      consumerDomain,
      'consumer',
    );

    this.createUserPoolClientOutput(app, consumerUserPoolClient, 'consumer');

    // Admin resources
    this.adminUserPool = this.createAdminUserPool(app);
    const adminDomain = this.createDomain(app, 'admin', this.adminUserPool);
    const adminUserPoolClient = this.createAdminUserPoolClients(
      app,
      this.adminUserPool,
      props.adminSiteUrl,
    );

    this.createUserPoolOutputs(app, this.adminUserPool, adminDomain, 'admin');

    // The common identity pool
    const identityPool = new cognito.CfnIdentityPool(this, 'IdentityPool', {
      allowUnauthenticatedIdentities: false,
      cognitoIdentityProviders: [
        {
          clientId: consumerUserPoolClient.userPoolClientId,
          providerName: this.consumerUserPool.userPoolProviderName,
        },
        {
          clientId: adminUserPoolClient.userPoolClientId,
          providerName: this.adminUserPool.userPoolProviderName,
        },
      ],
    });

    this.configureIdentityPool(identityPool);

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
  }

  private createUserPoolOutputs(
    app: App,
    userPool: cognito.UserPool,
    domain: cognito.UserPoolDomain,
    label: poolLabel,
  ) {
    const userPoolId = label + 'UserPoolId';
    new CfnOutput(this, userPoolId, {
      value: userPool.userPoolId,
      exportName: app.logicalPrefixedName(userPoolId),
    });
    new ssm.StringParameter(this, userPoolId + 'Param', {
      allowedPattern: '.*',
      description: 'The user pool ID for ' + label,
      parameterName: app.logicalPrefixedName(userPoolId),
      stringValue: userPool.userPoolId,
    });

    const userPoolDomainId = label + 'UserPoolDomain';
    new CfnOutput(this, userPoolDomainId, {
      value: domain.baseUrl(),
      exportName: app.logicalPrefixedName(userPoolDomainId),
    });
    new ssm.StringParameter(this, userPoolDomainId + 'Param', {
      allowedPattern: '.*',
      description: 'The user pool domain for ' + label,
      parameterName: app.logicalPrefixedName(userPoolDomainId),
      stringValue: domain.baseUrl(),
    });
  }

  private createUserPoolClientOutput(
    app: App,
    userPoolClient: cognito.UserPoolClient,
    label: string,
  ) {
    const userPoolClientId = label + 'UserPoolClientId';

    new CfnOutput(this, userPoolClientId, {
      value: userPoolClient.userPoolClientId,
      exportName: app.logicalPrefixedName(userPoolClientId),
    });

    new ssm.StringParameter(this, userPoolClientId + 'Param', {
      allowedPattern: '.*',
      description: 'The user pool client ID for ' + label,
      parameterName: app.logicalPrefixedName(userPoolClientId),
      stringValue: userPoolClient.userPoolClientId,
    });
  }

  private commonUserPoolProps(
    userPool: cognito.UserPool,
    generateSecret: boolean,
  ) {
    return {
      userPool,
      generateSecret,
      preventUserExistenceErrors: true,
      authFlows: {
        userPassword: true,
        userSrp: true,
      },
      supportedIdentityProviders: [
        cognito.UserPoolClientIdentityProvider.COGNITO,
      ],
    };
  }

  private createAdminUserPoolClients(
    app: App,
    userPool: cognito.UserPool,
    adminSiteUrl: string,
  ) {
    const callbackUrls = [`${adminSiteUrl}/admin/dashboard`];
    const logoutUrls = [`${adminSiteUrl}/auth/logout`];

    if (app.stage === 'dev') {
      callbackUrls.push(`http://localhost:4200/admin/dashboard`);
      logoutUrls.push(`http://localhost:4200/auth/logout`);
    }

    const commonProps = (callbackUrls: string[], logoutUrls: string[]) => ({
      oAuth: {
        flows: {
          authorizationCodeGrant: true,
        },
        scopes: [cognito.OAuthScope.OPENID],
        callbackUrls,
        logoutUrls,
      },
      supportedIdentityProviders: [
        cognito.UserPoolClientIdentityProvider.COGNITO,
      ],
    });

    // We need both native and web clients, see https://docs.amplify.aws/cli/auth/import#import-an-existing-cognito-user-pool
    const nativeClient = new cognito.UserPoolClient(
      this,
      'AdminUserPoolClientNative',
      {
        ...this.commonUserPoolProps(userPool, true),
        ...commonProps(callbackUrls, logoutUrls),
      },
    );

    this.createUserPoolClientOutput(app, nativeClient, 'adminNative');

    const webClient = new cognito.UserPoolClient(
      this,
      'AdminUserPoolClientWeb',
      {
        ...this.commonUserPoolProps(userPool, false),
        ...commonProps(callbackUrls, logoutUrls),
      },
    );

    this.createUserPoolClientOutput(app, webClient, 'adminWeb');

    // Clients for local development (callbacks are localhost)
    //if (app.stage === 'dev') {
    //  const localCallbackUrl = `http://localhost:4200/admin/dashboard`;
    //  const localLogoutUrl = `http://localhost:4200/auth/logout`;

    //  const webLocalClient = new cognito.UserPoolClient(
    //    this,
    //    'AdminUserPoolClientWebLocal',
    //    {
    //      ...this.commonUserPoolProps(userPool, false),
    //      ...commonProps(localCallbackUrl, localLogoutUrl),
    //    },
    //  );

    //  this.createUserPoolClientOutput(app, webLocalClient, 'adminWebLocal');

    //  const nativeLocalClient = new cognito.UserPoolClient(
    //    this,
    //    'AdminUserPoolClientNativeLocal',
    //    {
    //      ...this.commonUserPoolProps(userPool, true),
    //      ...commonProps(callbackUrl, logoutUrl),
    //    },
    //  );

    //  this.createUserPoolClientOutput(
    //    app,
    //    nativeLocalClient,
    //    'adminNativeLocal',
    //  );
    //}

    return webClient;
  }

  private createConsumerUserPoolClient(userPool: cognito.UserPool) {
    const commonProps = {
      oAuth: {
        flows: {
          authorizationCodeGrant: true,
        },
        scopes: [cognito.OAuthScope.OPENID],
        callbackUrls: ['anyupp://signin/'],
        logoutUrls: ['anyupp://signout/'],
      },
      supportedIdentityProviders: [
        cognito.UserPoolClientIdentityProvider.GOOGLE,
        cognito.UserPoolClientIdentityProvider.FACEBOOK,
        cognito.UserPoolClientIdentityProvider.COGNITO,
      ],
    };

    // We need both native and web clients, see https://docs.amplify.aws/cli/auth/import#import-an-existing-cognito-user-pool
    new cognito.UserPoolClient(this, 'ConsumerUserPoolClientWeb', {
      ...this.commonUserPoolProps(userPool, false),
      ...commonProps,
    });

    return new cognito.UserPoolClient(this, 'ConsumerUserPoolClientNative', {
      ...this.commonUserPoolProps(userPool, true),
      ...commonProps,
    });
  }

  private createDomain(app: App, label: poolLabel, userPool: cognito.UserPool) {
    return new cognito.UserPoolDomain(this, `CognitoDomain-${label}`, {
      userPool,
      cognitoDomain: {
        domainPrefix: `${app.stage}-${app.name}-${label}`,
      },
    });
  }

  private createConsumerUserPool(app: App) {
    return new cognito.UserPool(this, 'ConsumerUserPool', {
      userPoolName: app.logicalPrefixedName('consumer-user-pool'),
      selfSignUpEnabled: true,
      autoVerify: { email: true },
      userVerification: {
        emailSubject: 'Verify your email for AnyUpp',
        emailBody:
          'Hello, thanks for signing up to AnyUpp! Your verification code is {####}',
        emailStyle: cognito.VerificationEmailStyle.CODE,
        smsMessage:
          'Hello thanks for signing up to AnyUpp! Your verification code is {####}',
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
  }

  private createAdminUserPool(app: App) {
    return new cognito.UserPool(this, 'AdminUserPool', {
      userPoolName: app.logicalPrefixedName('admin-user-pool'),
      selfSignUpEnabled: false,
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
  }

  private configureIdentityPool(identityPool: cognito.CfnIdentityPool) {
    const authenticatedRole = new iam.Role(
      this,
      'CognitoDefaultAuthenticatedRole',
      {
        assumedBy: new iam.FederatedPrincipal(
          'cognito-identity.amazonaws.com',
          {
            StringEquals: {
              'cognito-identity.amazonaws.com:aud': identityPool.ref,
            },
            'ForAnyValue:StringLike': {
              'cognito-identity.amazonaws.com:amr': 'authenticated',
            },
          },
          'sts:AssumeRoleWithWebIdentity',
        ),
      },
    );

    authenticatedRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          'mobileanalytics:PutEvents',
          'cognito-sync:*',
          'cognito-identity:*',
        ],
        resources: ['*'],
      }),
    );

    new cognito.CfnIdentityPoolRoleAttachment(
      this,
      'IdentityPoolRoleAttachment',
      {
        identityPoolId: identityPool.ref,
        roles: { authenticated: authenticatedRole.roleArn },
      },
    );
  }
}
