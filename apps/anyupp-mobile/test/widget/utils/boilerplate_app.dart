import 'package:anyupp/shared/locale.dart';
import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';

class MockMaterialApp extends MaterialApp {
  final Widget child;
  final GlobalKey<NavigatorState>? navigatorKey;

  MockMaterialApp({Key? key, required this.child, this.navigatorKey})
      : super(
          themeMode: ThemeMode.light,
          title: 'AnyUpp',
          key: const Key('anyupp-main-app'),
          theme: ThemeData(
            primaryColor: Colors.green,
          ),
          navigatorKey: navigatorKey,
          home: child,
          locale: Locale.fromSubtags(countryCode: 'hu', languageCode: 'hu'),
          localizationsDelegates: [
            GlobalMaterialLocalizations.delegate,
            GlobalWidgetsLocalizations.delegate,
            GlobalCupertinoLocalizations.delegate,
            AppLocalizations.delegate,
          ],
          supportedLocales: SupportedLocales.locales,
        );
}
