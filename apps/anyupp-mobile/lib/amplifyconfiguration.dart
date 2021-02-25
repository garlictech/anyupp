const amplifyconfig = ''' {
    "UserAgent": "aws-amplify-cli/2.0",
    "Version": "1.0",
    "api": {
        "plugins": {
            "awsAPIPlugin": {
                "AdminQueries": {
                    "endpointType": "REST",
                    "endpoint": "https://9t94q9zapf.execute-api.eu-west-1.amazonaws.com/dev",
                    "region": "eu-west-1",
                    "authorizationType": "AWS_IAM"
                },
                "anyuppmobile": {
                    "endpointType": "GraphQL",
                    "endpoint": "https://vqawgl3psjf5vcq4ee2ugzvwbq.appsync-api.eu-west-1.amazonaws.com/graphql",
                    "region": "eu-west-1",
                    "authorizationType": "AMAZON_COGNITO_USER_POOLS"
                }
            }
        }
    },
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
                            "PoolId": "eu-west-1:395f2f88-88de-4515-bfe2-427d35edfb6c",
                            "Region": "eu-west-1"
                        }
                    }
                },
                "CognitoUserPool": {
                    "Default": {
                        "PoolId": "eu-west-1_4MLlR0MFF",
                        "AppClientId": "18gfhqv1b4u7a2e6tqlqnmmhaj",
                        "Region": "eu-west-1"
                    }
                },
                "Auth": {
                    "Default": {
                        "OAuth": {
                            "WebDomain": "anyuppmobile-dev.auth.eu-west-1.amazoncognito.com",
                            "AppClientId": "18gfhqv1b4u7a2e6tqlqnmmhaj",
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
                        "ApiUrl": "https://vqawgl3psjf5vcq4ee2ugzvwbq.appsync-api.eu-west-1.amazonaws.com/graphql",
                        "Region": "eu-west-1",
                        "AuthMode": "AMAZON_COGNITO_USER_POOLS",
                        "ClientDatabasePrefix": "anyuppmobile_AMAZON_COGNITO_USER_POOLS"
                    }
                }
            }
        }
    }
}''';
