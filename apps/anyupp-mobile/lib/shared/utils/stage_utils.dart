import 'package:fa_prev/app-config.dart';

bool get isDev => !['staging', 'prod'].contains(AppConfig.Stage);
