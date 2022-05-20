import 'package:catcher/catcher.dart';
import 'package:fa_prev/app-config.dart';
import 'package:fa_prev/core/core.dart';
import 'package:flutter/material.dart';

void configureCatcherAndRunZonedApp(Widget mainApp) {
  final customParameters = {'stage': 'anyupp'};

  log.d('configureCatcherAndRunZonedApp().awsConfig=${AppConfig.config}');
  bool useSlack = AppConfig.SlackErrorWebhookUrl != null;

  final slackHandler = SlackHandler((AppConfig.SlackErrorWebhookUrl ?? ''),
      '#' + (AppConfig.SlackErrorChannel ?? 'anyupp-errors'),
      username: "ErrorCatcher",
      iconEmoji: ":bug:",
      enableDeviceParameters: true,
      enableApplicationParameters: true,
      enableCustomParameters: true,
      enableStackTrace: true,
      printLogs: true);

  final consoleHandler = ConsoleHandler(enableCustomParameters: true);

  /// Debug configuration with dialog report mode and console handler. It will show dialog and once user accepts it, error will be shown   /// in console.
  CatcherOptions debugOptions = CatcherOptions(
      SilentReportMode(), [consoleHandler],
      customParameters: customParameters);
  // CatcherOptions(DialogReportMode(), [ConsoleHandler()]);

  /// Release configuration. Same as above, but once user accepts dialog, user will be prompted to send email with crash to support.
  CatcherOptions releaseOptions = CatcherOptions(
      SilentReportMode(),
      [
        // EmailManualHandler(["ERROR@3fa.com"])
        if (useSlack) slackHandler
      ],
      customParameters: customParameters);

  Catcher(
      rootWidget: mainApp,
      debugConfig: debugOptions,
      releaseConfig: releaseOptions);
}
