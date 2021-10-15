
import 'package:fa_prev/app.dart';
import 'package:flutter/material.dart';

import 'core/core.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await initDependencyInjection();
  configureCatcherAndRunZonedApp(MyApp());
  //runApp(MyApp());
}
