import 'package:anyupp/core/core.dart';
import 'package:anyupp/shared/locale.dart';
import 'package:anyupp/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';

import 'mock/mocks.dart';

void main() {
  setUp(() {
    GoogleFonts.config.allowRuntimeFetching = false;
    getIt.registerSingleton<ThemeBloc>(MockThemeBloc());
  });

  testWidgets('Test Common Error widget', (WidgetTester tester) async {
    // Create the widget by telling the tester to build it.
    await tester.pumpWidget(MaterialApp(
      locale: Locale.fromSubtags(countryCode: 'hu', languageCode: 'hu'),
      localizationsDelegates: [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
        AppLocalizations.delegate,
      ],
      supportedLocales: SupportedLocales.locales,
      home: CommonErrorWidget(
        error: 'TEST_ERROR_CODE',
        description: 'TEST_ERROR_DESCRIPTION',
        errorDetails: 'TEST_ERROR_DETAILS',
      ),
    ));

    await tester.pumpAndSettle();

    final errorFinder = find.text('TEST_ERROR_CODE');
    final descriptionFinder = find.text('TEST_ERROR_DESCRIPTION');
    final detailsFinder = find.text('TEST_ERROR_DETAILS');

    // Use the `findsOneWidget` matcher provided by flutter_test to verify
    // that the Text widgets appear exactly once in the widget tree.
    expect(errorFinder, findsOneWidget);
    expect(descriptionFinder, findsOneWidget);
    expect(detailsFinder, findsOneWidget);
  });
}
