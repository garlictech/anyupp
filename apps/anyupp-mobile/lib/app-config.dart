import 'dart:convert';

import 'awsconfiguration.dart';

class AppConfig {
  static String get Region => _config['Region'];

  static String get Stage => _config['Stage'];

  static String get StripePublishableKey => _config['StripePublishableKey'];

  static String get AnyuppGraphqlApiUrl => _config['AnyuppGraphqlApiUrl'];

  static String get AnyuppGraphqlApiKey => _config['AnyuppGraphqlApiKey'];

  static String get CrudGraphqlApiUrl => _config['CrudGraphqlApiUrl'];

  static String get CrudGraphqlApiKey => _config['CrudGraphqlApiKey'];

  static String get IdentityPoolId => _config['IdentityPoolId'];

  static String get UserPoolId => _config['ConsumerUserPoolId'];

  static String get UserPoolClientId => _config['ConsumerWebUserPoolClientId'];

  static String get UserPoolDomain => _config['ConsumerUserPoolDomain'];

  static String get S3BucketName => _config['S3BucketName'];

  static String get SlackErrorWebhookUrl => _config['SlackErrorWebhookUrl'];

  static String get SlackErrorChannel => _config['SlackErrorChannel'];

  static Map<String, dynamic> _config = jsonDecode(AWSCONFIG);

  static Map<String, dynamic> get config => _config;

  // Private constructor
  AppConfig._();

  @override
  String toString() {
    return 'AwsConfig[config=$_config]';
  }
}
