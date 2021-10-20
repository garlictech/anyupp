import 'package:fa_prev/app-config.dart';

bool get isDev => !['staging', 'qa', 'prod'].contains(AppConfig.Stage);
