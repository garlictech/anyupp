import 'package:catcher/catcher.dart';
import 'package:fa_prev/app.dart';
import 'package:flutter/material.dart';

void configureCatcherAndRunZonedApp(Widget mainApp) {
  final customParameters = {'stage': 'anyupp'};

  print('configureCatcherAndRunZonedApp().awsConfig=$awsConfig');
  bool useSlack = awsConfig['SlackErrorWebhookUrl'] != null;

  final slackHandler = SlackHandler(
      (awsConfig['SlackErrorWebhookUrl'] ?? ''), '#' + (awsConfig['SlackErrorChannel'] ?? 'anyupp-errors'),
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
        if (useSlack) slackHandler
      ],
      customParameters: customParameters);

  Catcher(mainApp, debugConfig: debugOptions, releaseConfig: releaseOptions);
}
