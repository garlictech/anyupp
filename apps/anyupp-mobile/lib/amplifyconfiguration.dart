const amplifyconfig = ''' {
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
                            "PoolId": "eu-west-1:06f2a3a8-cff3-4b07-99b8-e922e1a4ad71",
                            "Region": "eu-west-1"
                        }
                    }
                },
                "CognitoUserPool": {
                    "Default": {
                        "PoolId": "eu-west-1_abs0ttfYt",
                        "AppClientId": "73htrfi8bl3pivhj3b75ta0gmn",
                        "Region": "eu-west-1"
                    }
                },
                "Auth": {
                    "Default": {
                        "OAuth": {
                            "WebDomain": "anyuppmobile-dev.auth.eu-west-1.amazoncognito.com",
                            "AppClientId": "73htrfi8bl3pivhj3b75ta0gmn",
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
                        "ApiUrl": "https://654j7yrj2zclzccqhja75nrnmi.appsync-api.eu-west-1.amazonaws.com/graphql",
                        "Region": "eu-west-1",
                        "AuthMode": "AMAZON_COGNITO_USER_POOLS",
                        "ClientDatabasePrefix": "anyuppmobile_AMAZON_COGNITO_USER_POOLS"
                    }
                }
            }
        }
    },
    "api": {
        "plugins": {
            "awsAPIPlugin": {
                "anyuppmobile": {
                    "endpointType": "GraphQL",
                    "endpoint": "https://654j7yrj2zclzccqhja75nrnmi.appsync-api.eu-west-1.amazonaws.com/graphql",
                    "region": "eu-west-1",
                    "authorizationType": "AMAZON_COGNITO_USER_POOLS"
                }
            }
        }
    }
}''';