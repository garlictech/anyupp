import 'package:fa_prev/shared/locale.dart';
import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';

class MockMaterialApp extends MaterialApp {
  final Widget child;

  MockMaterialApp({Key? key, required this.child})
      : super(
          themeMode: ThemeMode.light,
          title: 'AnyUpp',
          key: const Key('anyupp-main-app'),
          theme: ThemeData(
            primaryColor: Colors.green,
          ),
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
