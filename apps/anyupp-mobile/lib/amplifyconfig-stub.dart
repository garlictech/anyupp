String getAmplifyConfig(Map<String, dynamic> config) {
  String webDomain = Uri.parse(config['consumerUserPoolDomain']).host;
  print('getAmplifyConfig().webDomain=$webDomain');

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
                            "PoolId": "${config['IdentityPoolId']}",
                            "Region": "${config['region']}"
                        }
                    }
                },
                "CognitoUserPool": {
                    "Default": {
                        "PoolId": "${config['consumerUserPoolId']}",
                        "AppClientId": "${config['consumerWebUserPoolClientId']}",
                        "Region": "${config['region']}"
                    }
                },
                "Auth": {
                    "Default": {
                        "OAuth": {
                            "WebDomain": "$webDomain",
                            "AppClientId": "${config['consumerWebUserPoolClientId']}",
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
                        "ApiUrl": "${config['GraphqlApiUrl']}",
                        "Region": "${config['region']}",
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
                "bucket": "${config['s3BucketName']}",
                "region": "${config['region']}",
                "defaultAccessLevel": "guest"
            }
        }
    }
}''';
}
