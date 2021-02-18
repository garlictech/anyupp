// Catcher configuration https://pub.dev/packages/catcher

import 'package:catcher/catcher.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

void configureCatcherAndRunZonedApp(Widget mainApp) {
  final customParameters = {'stage': DotEnv().env['stage']};

  final slackHandler = SlackHandler(
      DotEnv().env['SLACK_ERROR_WEBHOOK_URL'], '#' + DotEnv().env['SLACK_ERROR_CHANNEL_NAME'],
      username: "ErrorCatcher",
      iconEmoji: ":bug:",
      enableDeviceParameters: true,
      enableApplicationParameters: true,
      enableCustomParameters: true,
      enableStackTrace: true,
      printLogs: true);

  final consoleHandler = ConsoleHandler(enableCustomParameters: true);

  /// Debug configuration with dialog report mode and console handler. It will show dialog and once user accepts it, error will be shown   /// in console.
  CatcherOptions debugOptions =
      CatcherOptions(SilentReportMode(), [consoleHandler], customParameters: customParameters);
  // CatcherOptions(DialogReportMode(), [ConsoleHandler()]);

  /// Release configuration. Same as above, but once user accepts dialog, user will be prompted to send email with crash to support.
  CatcherOptions releaseOptions = CatcherOptions(
      SilentReportMode(),
      [
        // EmailManualHandler(["ERROR@3fa.com"])
        slackHandler
      ],
      customParameters: customParameters);

  Catcher(mainApp, debugConfig: debugOptions, releaseConfig: releaseOptions);
}
