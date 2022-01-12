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
import 'mock/mocks.dart';

void main() {
  RatingPolicy _dummyRatingPolicy() {
    return RatingPolicy(ratings: [
      RatingPolicyItem(value: 1),
      RatingPolicyItem(value: 2),
      RatingPolicyItem(value: 3),
      RatingPolicyItem(value: 4),
      RatingPolicyItem(value: 5),
    ]);
  }

  TipPolicy _dummyTipPolicy() {
    return TipPolicy(percents: [5, 10, 15, 20, 25]);
  }

  setUpAll(() {
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

  group('Order Screen test', () {
    late GeoUnit _unit;
    setUp(() {
      _unit = MockGenerator.generateUnit(
        name: 'TEST UNIT',
        currency: 'HUF',
      );
      getIt.registerSingleton<UnitSelectBloc>(MockUnitSelectBloc(_unit));
    });

    tearDown(() {
      getIt.unregister<UnitSelectBloc>();
    });

    testWidgets('Test Order details widget', (WidgetTester tester) async {
      await tester.runAsync(() async {
        Order order = MockGenerator.generateOrder(
          name: 'TEST_ORDER',
          method: PaymentMethod.cash,
          paymentType: PaymentType.cash,
          status: OrderStatus.none,
          price: 1000,
        );

        await tester.pumpWidget(
          _createBoilerPlateApp(
            child: OrderDetailsScreen(
              order: order,
              unit: _unit,
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
        expect(find.byType(ElevatedButton), findsNothing);
      });
    }, skip: false);
  });

  group('Order Screen test with rating button', () {
    late GeoUnit _unit;

    setUp(() {
      _unit = MockGenerator.generateUnit(
        name: 'TEST UNIT',
        currency: 'HUF',
      );
      _unit = _unit.copyWith(
        ratingPolicy: _dummyRatingPolicy(),
      );
      getIt.registerSingleton<UnitSelectBloc>(MockUnitSelectBloc(_unit));
    });

    tearDown(() {
      getIt.unregister<UnitSelectBloc>();
    });

    testWidgets('Test Order details widget with rating',
        (WidgetTester tester) async {
      await tester.runAsync(() async {
        Order order = MockGenerator.generateOrder(
          name: 'TEST_ORDER',
          method: PaymentMethod.cash,
          paymentType: PaymentType.cash,
          status: OrderStatus.served,
          price: 1000,
        );

        await tester.pumpWidget(
          _createBoilerPlateApp(
            child: OrderDetailsScreen(
              order: order,
              unit: _unit,
            ),
          ),
        );

        await tester.pumpAndSettle();

        expect(find.text('TEST_ORDER_I_0'), findsOneWidget);
        expect(find.text('TEST_ORDER_V_0'), findsOneWidget);
        expect(find.byType(ElevatedButton), findsOneWidget);
      });
    }, skip: false);
  });

  group('Order Screen test with tip button', () {
    late GeoUnit _unit;

    setUp(() {
      _unit = MockGenerator.generateUnit(
        name: 'TEST UNIT',
        currency: 'HUF',
      );
      _unit = _unit.copyWith(
        tipPolicy: _dummyTipPolicy(),
      );
      getIt.registerSingleton<UnitSelectBloc>(MockUnitSelectBloc(_unit));
    });

    tearDown(() {
      getIt.unregister<UnitSelectBloc>();
    });

    testWidgets('Test Order details widget with rating',
        (WidgetTester tester) async {
      await tester.runAsync(() async {
        Order order = MockGenerator.generateOrder(
          name: 'TEST_ORDER',
          method: PaymentMethod.cash,
          paymentType: PaymentType.cash,
          status: OrderStatus.served,
          price: 1000,
        );

        await tester.pumpWidget(
          _createBoilerPlateApp(
            child: OrderDetailsScreen(
              order: order,
              unit: _unit,
            ),
          ),
        );

        await tester.pumpAndSettle();

        expect(find.text('TEST_ORDER_I_0'), findsOneWidget);
        expect(find.text('TEST_ORDER_V_0'), findsOneWidget);
        expect(find.byType(ElevatedButton), findsOneWidget);
      });
    }, skip: false);
  });

  group('Order Screen test with rating AND tip button', () {
    late GeoUnit _unit;

    setUp(() {
      _unit = MockGenerator.generateUnit(
        name: 'TEST UNIT',
        currency: 'HUF',
      );
      _unit = _unit.copyWith(
        ratingPolicy: _dummyRatingPolicy(),
        tipPolicy: _dummyTipPolicy(),
      );
      getIt.registerSingleton<UnitSelectBloc>(MockUnitSelectBloc(_unit));
    });

    tearDown(() {
      getIt.unregister<UnitSelectBloc>();
    });

    testWidgets('Test Order details widget with rating',
        (WidgetTester tester) async {
      await tester.runAsync(() async {
        Order order = MockGenerator.generateOrder(
          name: 'TEST_ORDER',
          method: PaymentMethod.cash,
          paymentType: PaymentType.cash,
          status: OrderStatus.served,
          price: 1000,
        );

        await tester.pumpWidget(
          _createBoilerPlateApp(
            child: OrderDetailsScreen(
              order: order,
              unit: _unit,
            ),
          ),
        );

        await tester.pumpAndSettle();

        expect(find.text('TEST_ORDER_I_0'), findsOneWidget);
        expect(find.text('TEST_ORDER_V_0'), findsOneWidget);
        expect(find.byType(ElevatedButton), findsNWidgets(2));
      });
    }, skip: false);
  });

  group('Order Screen test hide tip and rating', () {
    late GeoUnit _unit;

    setUp(() {
      _unit = MockGenerator.generateUnit(
        name: 'TEST UNIT',
        currency: 'HUF',
      );
      _unit = _unit.copyWith(
        ratingPolicy: _dummyRatingPolicy(),
        tipPolicy: _dummyTipPolicy(),
      );
      getIt.registerSingleton<UnitSelectBloc>(MockUnitSelectBloc(_unit));
    });

    tearDown(() {
      getIt.unregister<UnitSelectBloc>();
    });

    testWidgets(
        'Test Order details widget - hide tips and rating buttons if already rated or tipped',
        (WidgetTester tester) async {
      await tester.runAsync(() async {
        Order order = MockGenerator.generateOrder(
          name: 'TEST_ORDER',
          method: PaymentMethod.cash,
          paymentType: PaymentType.cash,
          status: OrderStatus.served,
          price: 1000,
        );
        order = order.copyWith(
          rating: 1,
          tip: Tip(
            TipType.none,
            0,
          ),
        );

        await tester.pumpWidget(
          _createBoilerPlateApp(
            child: OrderDetailsScreen(
              order: order,
              unit: _unit,
            ),
          ),
        );

        await tester.pumpAndSettle();

        expect(find.text('TEST_ORDER_I_0'), findsOneWidget);
        expect(find.text('TEST_ORDER_V_0'), findsOneWidget);
        expect(find.byType(ElevatedButton), findsNothing);
      });
    }, skip: false);
  });
}
