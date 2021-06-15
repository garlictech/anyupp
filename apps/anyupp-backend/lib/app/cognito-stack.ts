import * as lambda from '@aws-cdk/aws-lambda';
import * as cognito from '@aws-cdk/aws-cognito';
import * as iam from '@aws-cdk/aws-iam';
import * as ssm from '@aws-cdk/aws-ssm';
import { CfnOutput, Duration, RemovalPolicy } from '@aws-cdk/core';
import { App, Stack, StackProps } from '@serverless-stack/resources';
import path from 'path';
import { commonLambdaProps } from './lambda-common';
import { getFQParamName } from './utils';

export interface CognitoStackProps extends StackProps {
  adminSiteUrl: string;
  googleClientId: string;
  googleClientSecret: string;
  facebookClientId: string;
  facebookClientSecret: string;
  appleSigninKey: string;
  appleTeamId: string;
  appleKeyId: string;
  appleServiceId: string;
}

type poolLabel = 'Admin' | 'Consumer';

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
      'Consumer',
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
          birthdate: cognito.ProviderAttribute.GOOGLE_BIRTHDAYS,
          fullname: cognito.ProviderAttribute.GOOGLE_NAME,
          phoneNumber: cognito.ProviderAttribute.GOOGLE_PHONE_NUMBERS,
          profilePicture: cognito.ProviderAttribute.GOOGLE_PICTURE,
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
          birthdate: cognito.ProviderAttribute.FACEBOOK_BIRTHDAY,
          fullname: cognito.ProviderAttribute.FACEBOOK_NAME,
        },
        scopes: ['public_profile', 'email', 'openid'],
      },
    );

    const appleIdProvider = new cognito.UserPoolIdentityProviderApple(
      this,
      'Apple',
      {
        userPool: this.consumerUserPool,
        clientId: props.appleServiceId,
        attributeMapping: {
          email: cognito.ProviderAttribute.APPLE_EMAIL,
          fullname: cognito.ProviderAttribute.APPLE_NAME,
        },
        teamId: props.appleTeamId,
        keyId: props.appleKeyId,
        privateKey: props.appleSigninKey,
        scopes: ['name', 'email', 'openid'],
      },
    );

    const { consumerWebClient, consumerNativeClient } =
      this.createConsumerUserPoolClient(app, this.consumerUserPool);

    consumerWebClient.node.addDependency(googleIdProvider);
    consumerWebClient.node.addDependency(facebookIdProvider);
    consumerWebClient.node.addDependency(appleIdProvider);
    consumerNativeClient.node.addDependency(googleIdProvider);
    consumerNativeClient.node.addDependency(facebookIdProvider);
    consumerNativeClient.node.addDependency(appleIdProvider);

    // Export values
    this.createUserPoolOutputs(
      app,
      this.consumerUserPool,
      consumerDomain,
      'Consumer',
    );

    // Admin resources
    this.adminUserPool = this.createAdminUserPool(app);
    const adminDomain = this.createDomain(app, 'Admin', this.adminUserPool);
    const { adminNativeClient, adminWebClient } =
      this.createAdminUserPoolClients(
        app,
        this.adminUserPool,
        props.adminSiteUrl,
      );

    this.createUserPoolOutputs(app, this.adminUserPool, adminDomain, 'Admin');

    // The common identity pool
    const identityPool = new cognito.CfnIdentityPool(this, 'IdentityPool', {
      allowUnauthenticatedIdentities: true,
      cognitoIdentityProviders: [
        {
          clientId: consumerNativeClient.userPoolClientId,
          providerName: this.consumerUserPool.userPoolProviderName,
        },
        {
          clientId: consumerWebClient.userPoolClientId,
          providerName: this.consumerUserPool.userPoolProviderName,
        },
        {
          clientId: adminNativeClient.userPoolClientId,
          providerName: this.adminUserPool.userPoolProviderName,
        },
        {
          clientId: adminWebClient.userPoolClientId,
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
      parameterName: getFQParamName(app, identityPoolId),
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
      parameterName: getFQParamName(app, userPoolId),
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
      parameterName: getFQParamName(app, userPoolDomainId),
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
      parameterName: getFQParamName(app, userPoolClientId),
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
    const logoutUrls = [`${adminSiteUrl}/auth/login`];

    if (app.stage === 'dev') {
      callbackUrls.push(`http://localhost:4200/admin/dashboard`);
      logoutUrls.push(`http://localhost:4200/auth/login`);
    }

    const commonProps = (callbackUrls: string[], logoutUrls: string[]) => ({
      oAuth: {
        flows: {
          authorizationCodeGrant: true,
        },
        scopes: [cognito.OAuthScope.OPENID, cognito.OAuthScope.COGNITO_ADMIN],
        callbackUrls,
        logoutUrls,
      },
      supportedIdentityProviders: [
        cognito.UserPoolClientIdentityProvider.COGNITO,
      ],
    });

    // We need both native and web clients, see https://docs.amplify.aws/cli/auth/import#import-an-existing-cognito-user-pool
    const adminNativeClient = new cognito.UserPoolClient(
      this,
      'AdminUserPoolClientNative',
      {
        ...this.commonUserPoolProps(userPool, true),
        ...commonProps(callbackUrls, logoutUrls),
      },
    );

    this.createUserPoolClientOutput(app, adminNativeClient, 'AdminNative');

    const adminWebClient = new cognito.UserPoolClient(
      this,
      'AdminUserPoolClientWeb',
      {
        ...this.commonUserPoolProps(userPool, false),
        ...commonProps(callbackUrls, logoutUrls),
      },
    );

    new cognito.CfnUserPoolUICustomizationAttachment(this, 'AdminUserPoolUI', {
      clientId: adminWebClient.userPoolClientId,
      userPoolId: userPool.userPoolId,
      css: `
        .banner-customizable {
          background: #464646;
        }
        .submitButton-customizable {
          height: 32px;
          background-color: #3366ff;
        }
        .submitButton-customizable:hover {
          background-color: #598bff;
        }
        .inputField-customizable {
          border: 1px solid #e4e9f2;
        }
      `,
    });

    this.createUserPoolClientOutput(app, adminWebClient, 'AdminWeb');

    return { adminWebClient, adminNativeClient };
  }

  private createConsumerUserPoolClient(app: App, userPool: cognito.UserPool) {
    const commonProps = {
      oAuth: {
        flows: {
          authorizationCodeGrant: true,
        },
        scopes: [
          cognito.OAuthScope.OPENID,
          cognito.OAuthScope.PHONE,
          cognito.OAuthScope.EMAIL,
          cognito.OAuthScope.COGNITO_ADMIN,
          cognito.OAuthScope.PROFILE,
        ],
        callbackUrls: ['anyupp://signin/'],
        logoutUrls: ['anyupp://signout/'],
      },
      supportedIdentityProviders: [
        cognito.UserPoolClientIdentityProvider.GOOGLE,
        cognito.UserPoolClientIdentityProvider.FACEBOOK,
        cognito.UserPoolClientIdentityProvider.COGNITO,
        cognito.UserPoolClientIdentityProvider.APPLE,
      ],
    };

    // We need both native and web clients, see https://docs.amplify.aws/cli/auth/import#import-an-existing-cognito-user-pool
    const consumerWebClient = new cognito.UserPoolClient(
      this,
      'ConsumerUserPoolClientWeb',
      {
        ...this.commonUserPoolProps(userPool, false),
        ...commonProps,
      },
    );

    this.createUserPoolClientOutput(app, consumerWebClient, 'ConsumerWeb');

    const consumerNativeClient = new cognito.UserPoolClient(
      this,
      'ConsumerUserPoolClientNative',
      {
        ...this.commonUserPoolProps(userPool, true),
        ...commonProps,
      },
    );
    this.createUserPoolClientOutput(
      app,
      consumerNativeClient,
      'ConsumerNative',
    );

    return { consumerNativeClient, consumerWebClient };
  }

  private createDomain(app: App, label: poolLabel, userPool: cognito.UserPool) {
    return new cognito.UserPoolDomain(this, `CognitoDomain-${label}`, {
      userPool,
      cognitoDomain: {
        domainPrefix: `${app.stage}-${app.name}-${label.toLowerCase()}`,
      },
    });
  }

  private createConsumerUserPool(app: App) {
    const preSignUp = this.createConsumerPreSignupTriggerLambda();

    return new cognito.UserPool(this, 'ConsumerUserPool', {
      userPoolName: app.logicalPrefixedName('consumer-user-pool'),
      ...this.getCommonUserPoolProperties(),
      selfSignUpEnabled: true,
      autoVerify: { email: true },
      userVerification: {
        emailSubject: 'Verify your email for AnyUPP',
        emailBody:
          'Hello, thanks for signing up to AnyUPP! Your verification code is {####}',
        emailStyle: cognito.VerificationEmailStyle.CODE,
        smsMessage:
          'Hello thanks for signing up to AnyUPP! Your verification code is {####}',
      },
      mfa: cognito.Mfa.OPTIONAL,
      mfaSecondFactor: {
        sms: true,
        otp: true,
      },
      standardAttributes: {
        email: {
          mutable: true,
          required: true,
        },
        fullname: {
          mutable: true,
          required: false,
        },
        phoneNumber: {
          mutable: true,
          required: false,
        },
        profilePicture: {
          mutable: true,
          required: false,
        },
        address: {
          mutable: true,
          required: false,
        },
        birthdate: {
          mutable: false,
          required: false,
        },
        nickname: {
          mutable: false,
          required: false,
        },
      },
      lambdaTriggers: {
        preSignUp,
      },
    });
  }

  private createAdminUserPool(app: App) {
    const pretokenTriggerLambda = this.createPretokenTriggerLambda();

    const userPool = new cognito.UserPool(this, 'AdminUserPool', {
      userPoolName: app.logicalPrefixedName('admin-user-pool'),
      ...this.getCommonUserPoolProperties(),
      selfSignUpEnabled: false,
      standardAttributes: {
        email: {
          mutable: true,
          required: true,
        },
        fullname: {
          mutable: true,
          required: true,
        },
        phoneNumber: {
          mutable: true,
          required: true,
        },
        profilePicture: {
          mutable: true,
          required: false,
        },
      },
      customAttributes: {
        context: new cognito.StringAttribute({
          minLen: 1,
          maxLen: 256,
          mutable: true,
        }),
      },
      lambdaTriggers: {
        preTokenGeneration: pretokenTriggerLambda,
      },
    });

    return userPool;
  }

  private createPretokenTriggerLambda() {
    const lambdaFn = new lambda.Function(
      this,
      'AdminPreTokenGenerationLambda',
      {
        ...commonLambdaProps,
        // It must be relative to the serverless.yml file
        handler: 'lib/lambda/pre-token-generation/index.handler',
        code: lambda.Code.fromAsset(
          path.join(__dirname, '../../.serverless/pre-token-generation.zip'),
        ),
      },
    );

    if (lambdaFn.role) {
      lambdaFn.role.addToPrincipalPolicy(
        new iam.PolicyStatement({
          actions: ['cognito-idp:AdminUpdateUserAttributes'],
          resources: ['*'],
        }),
      );
    }

    return lambdaFn;
  }

  private createConsumerPreSignupTriggerLambda() {
    const lambdaFn = new lambda.Function(this, 'AdminPreSignupTriggerLambda', {
      ...commonLambdaProps,
      // It must be relative to the serverless.yml file
      handler: 'lib/lambda/consumer-pre-signup/index.handler',
      code: lambda.Code.fromAsset(
        path.join(__dirname, '../../.serverless/consumer-pre-signup.zip'),
      ),
    });

    if (lambdaFn.role) {
      lambdaFn.role.addToPrincipalPolicy(
        new iam.PolicyStatement({
          actions: ['cognito-idp:ListUsers'],
          resources: ['*'],
        }),
      );
    }

    return lambdaFn;
  }

  private configureIdentityPool(identityPool: cognito.CfnIdentityPool) {
    const authenticatedRole = new iam.Role(
      this,
      'CognitoDefaultAuthenticatedRole2',
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

    const unauthenticatedRole = new iam.Role(
      this,
      'CognitoDefaultUnauthenticatedRole',
      {
        assumedBy: new iam.FederatedPrincipal(
          'cognito-identity.amazonaws.com',
          {
            StringEquals: {
              'cognito-identity.amazonaws.com:aud': identityPool.ref,
            },
            'ForAnyValue:StringLike': {
              'cognito-identity.amazonaws.com:amr': 'unauthenticated',
            },
          },
          'sts:AssumeRoleWithWebIdentity',
        ),
      },
    );

    unauthenticatedRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['mobileanalytics:PutEvents', 'cognito-sync:*'],
        resources: ['*'],
      }),
    );
    new cognito.CfnIdentityPoolRoleAttachment(
      this,
      'IdentityPoolRoleAttachment',
      {
        identityPoolId: identityPool.ref,
        roles: {
          authenticated: authenticatedRole.roleArn,
          unauthenticated: unauthenticatedRole.roleArn,
        },
      },
    );
  }

  private getCommonUserPoolProperties() {
    return {
      signInAliases: {
        username: true,
        phone: true,
        email: true,
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
      signInCaseSensitive: false,
      removalPolicy:
        this.stage === 'prod' ? RemovalPolicy.SNAPSHOT : RemovalPolicy.DESTROY,
    };
  }
}
