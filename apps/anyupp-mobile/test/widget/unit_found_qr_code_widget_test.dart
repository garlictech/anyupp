import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/screens.dart';
import 'package:fa_prev/shared/auth.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';

import '../unit/mock/mock_auth_provider.dart';
import 'mock/mock_data_faker.dart';
import 'mock/mock_theme_bloc.dart';
import 'mock/mock_unit_bloc.dart';

GeoUnit _unit = MockGenerator.generateUnit(
  name: 'TEST QR UNIT',
  currency: 'HUF',
);

void main() {
  setUpAll(() {});

  setUp(() {
    GoogleFonts.config.allowRuntimeFetching = false;
    MockThemeBloc themeBloc = MockThemeBloc();

    getIt.registerSingleton<ThemeBloc>(themeBloc);
    getIt.registerSingleton<UnitsBloc>(MockUnitsBloc());
    // getIt.registerSingleton<UnitSelectBloc>(MockUnitSelectBloc(_unit));
    getIt.registerSingleton<IAuthProvider>(MockAuthProvider());
  });

  Widget _createBoilerPlateApp({required Widget child}) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(create: (BuildContext context) => getIt<ThemeBloc>()),
        BlocProvider(create: (BuildContext context) => getIt<UnitsBloc>()),
        // BlocProvider(create: (BuildContext context) => getIt<UnitSelectBloc>()),
      ],
      child: MaterialApp(
        themeMode: ThemeMode.light,
        title: 'QR code test',
        key: const Key('anyupp-main-qr-app'),
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
      ),
    );
  }

  testWidgets('Test QR code found widget', (WidgetTester tester) async {
    tester.binding.window.physicalSizeTestValue = Size(1080, 1920);

    await tester.runAsync(() async {
      await tester.pumpWidget(
        _createBoilerPlateApp(
          child: UnitFoundByQRCodeScreen(
            place: Place(seat: '01', table: '01'),
            unitId: _unit.id,
            loadUnits: false,
            navigateToCart: false,
          ),
        ),
      );

      await tester.pump(Duration(seconds: 5));

      expect(find.byType(UnitFoundByQRCodeScreen), findsOneWidget);
    });
  });
}
