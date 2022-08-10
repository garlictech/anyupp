import 'package:anyupp/core/core.dart';
import 'package:anyupp/graphql/generated/crud-api.dart';
import 'package:anyupp/models.dart';
import 'package:anyupp/modules/orders/bloc/order_refresh_bloc.dart';
import 'package:anyupp/modules/rating_tipping/rating_tipping.dart';
import 'package:anyupp/modules/screens.dart';
import 'package:anyupp/shared/locale.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';

import '../mock/mock_api_values.dart';
import '../mock/mock_data_faker.dart';
import 'mock/mock_unit_bloc.dart';
import 'mock/mocks.dart';

void main() {
  setUpAll(() {
    GoogleFonts.config.allowRuntimeFetching = false;
    MockThemeBloc themeBloc = MockThemeBloc();
    RatingBloc ratingBloc = RatingBloc(
      RatingRepository(MockRatingProvider()),
      MockOrderRepository(),
    );
    getIt.registerSingleton(OrderRefreshBloc());
    getIt.registerSingleton<ThemeBloc>(themeBloc);
    getIt.registerSingleton<RatingBloc>(ratingBloc);
    getIt.registerSingleton<UnitsBloc>(MockUnitsBloc(UnitsLoaded(units: [
      MockGenerator.generateUnit(
        name: 'TEST UNIT',
        currency: 'HUF',
      )
    ])));
  });

  Widget _createBoilerPlateApp({required Widget child}) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(create: (_) => getIt<OrderRefreshBloc>()),
        BlocProvider(create: (_) => getIt<RatingBloc>()),
        BlocProvider(create: (_) => getIt<UnitsBloc>()),
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
    late Unit _unit;

    setUp(() {
      _unit = MockGenerator.generateUnit(
        name: 'TEST UNIT',
        currency: 'HUF',
      );
      _unit = _unit.copyWith(
        ratingPolicies: [
          TestMock.mockRatingPolicy()!,
        ],
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
          method: PaymentMethod.inapp,
          paymentType: PaymentType.stripe,
          status: OrderStatus.served,
          price: 1000,
        ).copyWith(
          ratingPolicies: [
            TestMock.mockRatingPolicy()!,
          ],
        );

        await tester.pumpWidget(
          _createBoilerPlateApp(
            child: OrderDetailsScreen(
              order: order,
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
    late Unit _unit;

    setUp(() {
      _unit = MockGenerator.generateUnit(
        name: 'TEST UNIT',
        currency: 'HUF',
      );
      _unit = _unit.copyWith(
        tipPolicy: TestMock.mockTipPolicy(),
      );
      getIt.registerSingleton<UnitSelectBloc>(MockUnitSelectBloc(_unit));
    });

    tearDown(() {
      getIt.unregister<UnitSelectBloc>();
    });

    testWidgets('Test Order details widget with rating and tip',
        (WidgetTester tester) async {
      await tester.runAsync(() async {
        Order order = MockGenerator.generateOrder(
          name: 'TEST_ORDER',
          method: PaymentMethod.inapp,
          paymentType: PaymentType.stripe,
          status: OrderStatus.served,
          price: 1000,
        ).copyWith(
          transaction: MockGenerator.generateTransaction()
              .copyWith(externalTransactionId: 'STRIPE_PAYMENT_INTENT_ID'),
          ratingPolicies: [
            TestMock.mockRatingPolicy()!,
          ],
        );

        await tester.pumpWidget(
          _createBoilerPlateApp(
            child: OrderDetailsScreen(
              order: order,
            ),
          ),
        );

        await tester.pumpAndSettle();

        expect(find.text('TEST_ORDER_I_0'), findsOneWidget);
        expect(find.text('TEST_ORDER_V_0'), findsOneWidget);
        // Tip button + invoice button
        expect(find.byType(ElevatedButton), findsNWidgets(2));
      });
    }, skip: false);
  });

  group('Order Screen test with rating AND tip button', () {
    late Unit _unit;

    setUp(() {
      _unit = MockGenerator.generateUnit(
        name: 'TEST UNIT',
        currency: 'HUF',
      );
      _unit = _unit.copyWith(
        ratingPolicies: [
          TestMock.mockRatingPolicy()!,
        ],
        tipPolicy: TestMock.mockTipPolicy(),
      );
      getIt.registerSingleton<UnitSelectBloc>(MockUnitSelectBloc(_unit));
    });

    tearDown(() {
      getIt.unregister<UnitSelectBloc>();
    });

    testWidgets('Test Order details widget with rating and tiping',
        (WidgetTester tester) async {
      await tester.runAsync(() async {
        Order order = MockGenerator.generateOrder(
          name: 'TEST_ORDER',
          method: PaymentMethod.inapp,
          paymentType: PaymentType.stripe,
          status: OrderStatus.served,
          price: 1000,
        ).copyWith(
          transaction: MockGenerator.generateTransaction()
              .copyWith(externalTransactionId: 'STRIPE_PAYMENT_INTENT_ID'),
          ratingPolicies: [
            TestMock.mockRatingPolicy()!,
          ],
          tipPolicy: TestMock.mockTipPolicy(),
        );

        await tester.pumpWidget(
          _createBoilerPlateApp(
            child: OrderDetailsScreen(
              order: order,
            ),
          ),
        );

        await tester.pumpAndSettle();

        expect(find.text('TEST_ORDER_I_0'), findsOneWidget);
        expect(find.text('TEST_ORDER_V_0'), findsOneWidget);
        expect(find.byType(ElevatedButton), findsNWidgets(3));
      });
    }, skip: false);
  });

  group('Order Screen test hide tip and rating', () {
    late Unit _unit;

    setUp(() {
      _unit = MockGenerator.generateUnit(
        name: 'TEST UNIT',
        currency: 'HUF',
      );
      _unit = _unit.copyWith(
        ratingPolicies: [
          TestMock.mockRatingPolicy()!,
        ],
        tipPolicy: TestMock.mockTipPolicy(),
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
          method: PaymentMethod.inapp,
          paymentType: PaymentType.stripe,
          status: OrderStatus.served,
          price: 1000,
        );
        order = order.copyWith(
          hasRated: true,
          rating: OrderRating(
            key: 'TETS_QUESTION_1',
            value: 1,
          ),
          tip: Tip(
            TipType.none,
            0,
          ),
          ratingPolicies: [
            TestMock.mockRatingPolicy()!,
          ],
        );

        await tester.pumpWidget(
          _createBoilerPlateApp(
            child: OrderDetailsScreen(
              order: order,
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

  group('Order Screen test tip amount info section', () {
    late Unit _unit;

    setUp(() {
      _unit = MockGenerator.generateUnit(
        name: 'TEST UNIT',
        currency: 'HUF',
      );
      _unit = _unit.copyWith(
        ratingPolicies: [
          TestMock.mockRatingPolicy()!,
        ],
        tipPolicy: TestMock.mockTipPolicy(),
      );
      getIt.registerSingleton<UnitSelectBloc>(MockUnitSelectBloc(_unit));
    });

    tearDown(() {
      getIt.unregister<UnitSelectBloc>();
    });

    testWidgets('Test Order details widget - display tip amount',
        (WidgetTester tester) async {
      await tester.runAsync(() async {
        Order order = MockGenerator.generateOrder(
          name: 'TEST_ORDER',
          method: PaymentMethod.inapp,
          paymentType: PaymentType.stripe,
          status: OrderStatus.served,
          price: 1000,
        );
        order = order.copyWith(
          hasRated: true,
          rating: OrderRating(
            key: 'TETS_QUESTION_1',
            value: 1,
          ),
          tip: Tip(
            TipType.amount,
            500,
          ),
          ratingPolicies: [
            TestMock.mockRatingPolicy()!,
          ],
        );

        await tester.pumpWidget(
          _createBoilerPlateApp(
            child: OrderDetailsScreen(
              order: order,
            ),
          ),
        );

        await tester.pumpAndSettle();

        expect(find.byType(OrderDetailsTipAndServingFeeWidget), findsOneWidget);
        expect(find.text('500\xa0Ft'), findsOneWidget);
      });
    }, skip: false);
  });
}
