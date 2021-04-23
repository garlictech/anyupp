import 'package:fa_prev/app-config.dart';

String getAmplifyConfig() {
  String webDomain = Uri.parse(AppConfig.UserPoolDomain).host;
  return '''{
    "UserAgent": "aws-amplify-cli/2.0",
    "Version": "1.0",
    "auth": {
        "plugins": {
            "awsCognitoAuthPlugin": {
                "UserAgent": "aws-amplify-cli/0.1.0",
                "Version": "0.1.0",
                "IdentityManager": {
                    "Default": {}
                },
                "CredentialsProvider": {
                    "CognitoIdentity": {
                        "Default": {
                            "PoolId": "${AppConfig.IdentityPoolId}",
                            "Region": "${AppConfig.Region}"
                        }
                    }
                },
                "CognitoUserPool": {
                    "Default": {
                        "PoolId": "${AppConfig.UserPoolId}",
                        "AppClientId": "${AppConfig.UserPoolClientId}",
                        "Region": "${AppConfig.Region}"
                    }
                },
                "Auth": {
                    "Default": {
                        "OAuth": {
                            "WebDomain": "$webDomain",
                            "AppClientId": "${AppConfig.UserPoolClientId}",
                            "SignInRedirectURI": "anyupp://signin/",
                            "SignOutRedirectURI": "anyupp://signout/",
                            "Scopes": [
                                "phone",
                                "email",
                                "openid",
                                "profile",
                                "aws.cognito.signin.user.admin"
                            ]
                        },
                        "authenticationFlowType": "USER_SRP_AUTH"
                    }
                },
                "AppSync": {
                    "Default": {
                        "ApiUrl": "${AppConfig.CrudGraphqlApiUrl}",
                        "Region": "${AppConfig.Region}",
                        "AuthMode": "AMAZON_COGNITO_USER_POOLS",
                        "ClientDatabasePrefix": "anyuppbackend_AMAZON_COGNITO_USER_POOLS"
                    }
                }
            }
        }
    },
    "storage": {
        "plugins": {
            "awsS3StoragePlugin": {
                "bucket": "${AppConfig.S3BucketName}",
                "region": "${AppConfig.Region}",
                "defaultAccessLevel": "guest"
            }
        }
    }
}''';
}
