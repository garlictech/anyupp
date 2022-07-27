import 'dart:io';

import '/app.dart';
import 'package:flutter/material.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';

import 'core/core.dart';
import 'shared/utils/stage_utils.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  if (isDev && Platform.isAndroid) {
    await AndroidInAppWebViewController.setWebContentsDebuggingEnabled(true);
  }
  await initDependencyInjection();
  configureCatcherAndRunZonedApp(MyApp());
  //runApp(MyApp());
}
