import '/app-config.dart';

bool get isDev => !['staging', 'prod'].contains(AppConfig.Stage);
