import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/orders/bloc/order_refresh_bloc.dart';
import 'package:fa_prev/modules/screens.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';

import '../mock/mock_data_faker.dart';
import 'mock/mock_theme_bloc.dart';

void main() {
  setUp(() {
    GoogleFonts.config.allowRuntimeFetching = false;
    MockThemeBloc themeBloc = MockThemeBloc();
    getIt.registerSingleton(OrderRefreshBloc());
    getIt.registerSingleton<ThemeBloc>(themeBloc);
  });

  Widget _createBoilerPlateApp({required Widget child}) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(
            create: (BuildContext context) => getIt<OrderRefreshBloc>()),
      ],
      child: MaterialApp(
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
      ),
    );
  }

  testWidgets('Test Order details widget', (WidgetTester tester) async {
    await tester.runAsync(() async {
      Order order = MockGenerator.generateOrder(
        name: 'TEST_ORDER',
        method: PaymentMethod.cash,
        paymentType: PaymentType.cash,
        status: OrderStatus.none,
        price: 1000,
      );

      GeoUnit unit = MockGenerator.generateUnit(
        name: 'TEST UNIT',
        currency: 'HUF',
      );

      await tester.pumpWidget(
        _createBoilerPlateApp(
          child: OrderDetailsScreen(
            order: order,
            unit: unit,
          ),
        ),
      );

      await tester.pump();

      expect(find.text('TEST_ORDER_I_0'), findsOneWidget);
      expect(find.text('TEST_ORDER_V_0'), findsOneWidget);

      Order refreshedOrder = order.copyWith(items: [
        order.items[0].copyWith(
          productName: LocalizedItem(
            hu: 'TEST_ORDER_I_0_X',
            en: 'TEST_ORDER_I_0_X',
            de: 'TEST_ORDER_I_0_X',
          ),
          variantName: LocalizedItem(
            hu: 'TEST_ORDER_V_0_X',
            en: 'TEST_ORDER_V_0_X',
            de: 'TEST_ORDER_V_0_X',
          ),
        ),
      ]);

      getIt<OrderRefreshBloc>().add(RefreshOrder(refreshedOrder));

      // Wait a little
      await tester.pumpAndSettle(Duration(seconds: 1));

      expect(find.text('TEST_ORDER_I_0_X'), findsOneWidget);
      expect(find.text('TEST_ORDER_V_0_X'), findsOneWidget);
    });
  });
}
