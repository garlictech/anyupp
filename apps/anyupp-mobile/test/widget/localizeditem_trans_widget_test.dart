import 'package:fa_prev/models/LocalizedItem.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_test/flutter_test.dart';

class LocalizationsTestWidget extends StatelessWidget {
  final LocalizedItem item;

  const LocalizationsTestWidget({Key? key, required this.item})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    print(
        'LocalizationsTestWidget.getLocalizedText().text=${getLocalizedText(context, item)}');
    return Column(
      children: [
        Text(getLocalizedText(context, item)),
      ],
    );
  }
}

void main() {
  testWidgets('LocalizedItem translation flow test - valid HU translation',
      (WidgetTester tester) async {
    // Create the widget by telling the tester to build it.
    await tester.runAsync(() async {
      await tester.pumpWidget(MaterialApp(
        locale: Locale.fromSubtags(countryCode: 'hu', languageCode: 'hu'),
        localizationsDelegates: [
          GlobalMaterialLocalizations.delegate,
          GlobalWidgetsLocalizations.delegate,
          GlobalCupertinoLocalizations.delegate,
          AppLocalizations.delegate,
        ],
        supportedLocales: SupportedLocales.locales,
        home: LocalizationsTestWidget(
          item: LocalizedItem(
            hu: 'Magyar',
            en: 'Hungarian',
            de: 'Ungarisch',
          ),
        ),
      ));

      await tester.pumpAndSettle();

      final huFinder = find.text('Magyar');
      final enFinder = find.text('Hungarian');
      final deFinder = find.text('Ungarisch');

      expect(huFinder, findsOneWidget);
      expect(enFinder, findsNothing);
      expect(deFinder, findsNothing);
    });
  }, skip: false);

  testWidgets(
      'LocalizedItem translation flow test - fallback HU translation to EN',
      (WidgetTester tester) async {
    // Create the widget by telling the tester to build it.
    await tester.runAsync(() async {
      await tester.pumpWidget(MaterialApp(
        locale: Locale.fromSubtags(countryCode: 'hu', languageCode: 'hu'),
        localizationsDelegates: [
          GlobalMaterialLocalizations.delegate,
          GlobalWidgetsLocalizations.delegate,
          GlobalCupertinoLocalizations.delegate,
          AppLocalizations.delegate,
        ],
        supportedLocales: SupportedLocales.locales,
        home: LocalizationsTestWidget(
          item: LocalizedItem(
            hu: null,
            en: 'Hungarian',
            de: 'Ungarisch',
          ),
        ),
      ));

      await tester.pumpAndSettle();

      final huFinder = find.text('Magyar');
      final enFinder = find.text('Hungarian');
      final deFinder = find.text('Ungarisch');

      expect(huFinder, findsNothing);
      expect(enFinder, findsOneWidget);
      expect(deFinder, findsNothing);
    });
  }, skip: false);

  testWidgets('LocalizedItem translation flow test - fallback to empty',
      (WidgetTester tester) async {
    // Create the widget by telling the tester to build it.
    await tester.runAsync(() async {
      await tester.pumpWidget(MaterialApp(
        locale: Locale.fromSubtags(countryCode: 'en', languageCode: 'en'),
        localizationsDelegates: [
          GlobalMaterialLocalizations.delegate,
          GlobalWidgetsLocalizations.delegate,
          GlobalCupertinoLocalizations.delegate,
          AppLocalizations.delegate,
        ],
        supportedLocales: SupportedLocales.locales,
        home: LocalizationsTestWidget(
          item: LocalizedItem(
            hu: null,
            en: null,
            de: 'Ungarisch',
          ),
        ),
      ));
    });

    await tester.pumpAndSettle();

    final huFinder = find.text('Magyar');
    final enFinder = find.text('Hungarian');
    final deFinder = find.text('Ungarisch');
    final emptyFinder = find.text('-');

    expect(huFinder, findsNothing);
    expect(enFinder, findsNothing);
    expect(deFinder, findsNothing);
    expect(emptyFinder, findsOneWidget);
  }, skip: false);
}
