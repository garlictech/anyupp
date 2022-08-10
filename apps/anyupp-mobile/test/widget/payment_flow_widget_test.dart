import 'package:anyupp/core/core.dart';
import 'package:anyupp/graphql/generated/crud-api.dart';
import 'package:anyupp/models.dart';
import 'package:anyupp/modules/cart/cart.dart';
import 'package:anyupp/modules/cart/screens/select_payment_method_screen.dart';
import 'package:anyupp/modules/main/main.dart';
import 'package:anyupp/modules/payment/payment.dart';
import 'package:anyupp/modules/takeaway/bloc/takeaway_bloc.dart';
import 'package:anyupp/shared/user-details/user_details.dart';
import 'package:anyupp/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';
import 'mock/mock_user_details_provider.dart';
import 'mock/mocks.dart';
import 'utils/boilerplate_app.dart';
import '../mock/mock_data_faker.dart';

void main() {
  // 1. placeOnly
  // 2. placeWithPaymentType
  // 3. full
  late Cart _mockCart;
  late Unit _mockUnit;

  setUpAll(() async {
    GoogleFonts.config.allowRuntimeFetching = false;

    _mockUnit = MockGenerator.generateUnit(
      name: 'TEST UNIT',
      currency: 'huf',
      orderPolicy: OrderPolicy.placeOnly,
    );
    _mockUnit = _mockUnit.copyWith(
      paymentModes: [
        PaymentMode(type: PaymentType.stripe, method: PaymentMethod.inapp),
        PaymentMode(type: PaymentType.cash, method: PaymentMethod.cash),
        PaymentMode(type: PaymentType.card, method: PaymentMethod.card),
      ],
    );

    _mockCart = MockGenerator.generateBasicCart(
      servingMode: ServingMode.takeAway,
    );
    _mockCart = _mockCart.copyWith(
      place: Place(seat: '01', table: '01'),
      items: [
        MockGenerator.generateOrderItem(
          name: 'Hamburger',
          variantName: 'Dupla',
          price: 500.0,
          packagingFee: 100.0,
          status: OrderStatus.placed,
        ),
      ],
    );

    getIt.registerSingleton<ThemeBloc>(MockThemeBloc());
    getIt.registerSingleton<TakeAwayBloc>(MockTakeAwayBloc(
      servingMode: ServingMode.takeAway,
    ));
    getIt.registerSingleton<CartRepository>(MockCartRepository(_mockCart));
    getIt.registerSingleton<CartBloc>(MockCartBloc(
      cart: _mockCart,
      stateToSend: EmptyCartState(),
    ));
    getIt.registerSingleton<UnitSelectBloc>(MockUnitSelectBloc(_mockUnit));
    getIt.registerSingleton<StripePaymentBloc>(MockStripePaymentBloc(
      initialState: StripePaymentMethodsList([]),
    ));
    getIt.registerSingleton<UserDetailsBloc>(
        UserDetailsBloc(UserDetailsRepository(MockUserDetailsProvider(null))));

    getIt.registerSingleton<MainNavigationBloc>(MainNavigationBloc());
  });

  Widget _createBoilerPlateApp({required Widget child}) {
    var navigatorKey = GlobalKey<NavigatorState>();
    AppContext.init(navigatorKey);

    return MultiBlocProvider(
      providers: [
        BlocProvider(create: (_) => getIt<ThemeBloc>()),
        BlocProvider(create: (_) => getIt<TakeAwayBloc>()),
        BlocProvider(create: (_) => getIt<UnitSelectBloc>()),
        BlocProvider(create: (_) => getIt<StripePaymentBloc>()),
        BlocProvider(create: (_) => getIt<CartBloc>()),
        BlocProvider(create: (_) => getIt<UserDetailsBloc>()),
        BlocProvider(create: (_) => getIt<MainNavigationBloc>()),
      ],
      child: MockMaterialApp(
        child: child,
        navigatorKey: navigatorKey,
      ),
    );
  }

  group('Simplified Payment flow test: policy: placeOnly', () {
    setUpAll(() async {
      _mockCart = _mockCart.copyWith(
        orderPolicy: OrderPolicy.placeOnly,
      );
      _mockUnit = _mockUnit.copyWith(
        orderPolicy: OrderPolicy.placeOnly,
      );

      await getIt.unregister<CartBloc>();
      getIt.registerSingleton<CartBloc>(MockCartBloc(
        cart: _mockCart,
        stateToSend: EmptyCartState(),
      ));
    });

    testWidgets(
        'Test Simplified Payment flow screen with placeOnly order policy.',
        (WidgetTester tester) async {
      await tester.runAsync(() async {
        tester.binding.window.physicalSizeTestValue = Size(1080, 2048);

        Widget root = _createBoilerPlateApp(
          child: SelectPaymentMethodScreen(
            // cart: _mockCart,
            unit: _mockUnit,
          ),
        );

        await tester.pumpWidget(
          root,
        );

        await tester.pump();

        expect(find.byType(SelectPaymentMethodScreen), findsOneWidget);

        // Wait to complete the animations
        await tester.pumpAndSettle(Duration(milliseconds: 1000));

        expect(find.text('Készpénz'), findsNothing);
        expect(find.text('Pincérnél fizetek'), findsNothing);
      });
    });
  }, skip: false);

  group('Simplified Payment flow test: policy: placeWithPaymentType', () {
    setUpAll(() async {
      _mockCart = _mockCart.copyWith(
        orderPolicy: OrderPolicy.placeWithPaymentType,
      );
      _mockUnit = _mockUnit.copyWith(
        orderPolicy: OrderPolicy.placeWithPaymentType,
      );

      getIt.unregister<CartBloc>();
      getIt.registerSingleton<CartBloc>(MockCartBloc(
        cart: _mockCart,
        // stateToSend: EmptyCartState(),
      ));
    });

    testWidgets(
        'Test Simplified Payment flow screen with placeWithPaymentType order policy.',
        (WidgetTester tester) async {
      await tester.runAsync(() async {
        tester.binding.window.physicalSizeTestValue = Size(1080, 2048);

        await tester.pumpWidget(
          _createBoilerPlateApp(
            child: SelectPaymentMethodScreen(
              // cart: _mockCart,
              unit: _mockUnit,
            ),
          ),
        );

        await tester.pump();

        expect(find.byType(SelectPaymentMethodScreen), findsOneWidget);

        // Wait to complete the animations
        await tester.pumpAndSettle(Duration(milliseconds: 1000));

        // expect(find.byKey(Key('select-payment-item-inapp')), findsOneWidget);
        expect(find.byKey(Key('select-payment-item-cash')), findsOneWidget);
        expect(find.byKey(Key('select-payment-item-card')), findsOneWidget);
        expect(find.text('Készpénz'), findsOneWidget);
        expect(find.text('Kártya, SZÉP kártya'), findsOneWidget);
        expect(find.text('Pincérnél fizetek'), findsNWidgets(2));

        expect(find.text('MEGRENDELEM'), findsOneWidget);
      });
    });
  }, skip: false);

  group('Simplified Payment flow test: policy: full', () {
    setUpAll(() async {
      _mockCart = _mockCart.copyWith(
        orderPolicy: OrderPolicy.full,
      );
      _mockUnit = _mockUnit.copyWith(
        orderPolicy: OrderPolicy.full,
      );

      await getIt.unregister<StripePaymentBloc>();
      getIt.registerSingleton<StripePaymentBloc>(MockStripePaymentBloc(
        initialState: StripePaymentMethodsList([]),
      ));

      await getIt.unregister<CartBloc>();
      getIt.registerSingleton<CartBloc>(MockCartBloc(
        cart: _mockCart,
        // stateToSend: EmptyCartState(),
      ));
    });

    testWidgets('Test Simplified Payment flow screen with full order policy.',
        (WidgetTester tester) async {
      await tester.runAsync(() async {
        tester.binding.window.physicalSizeTestValue = Size(1080, 2048);

        await tester.pumpWidget(
          _createBoilerPlateApp(
            child: SelectPaymentMethodScreen(
              // cart: _mockCart,
              unit: _mockUnit,
            ),
          ),
        );

        await tester.pump();

        expect(find.byType(SelectPaymentMethodScreen), findsOneWidget);

        // Wait to complete the animations
        await tester.pumpAndSettle(Duration(milliseconds: 1000));

        expect(find.byKey(Key('select-payment-item-inapp')), findsOneWidget);
        expect(find.byKey(Key('select-payment-item-cash')), findsOneWidget);
        expect(find.byKey(Key('select-payment-item-card')), findsOneWidget);

        expect(find.text('Készpénz'), findsOneWidget);
        expect(find.text('Kártya, SZÉP kártya'), findsOneWidget);
        expect(find.text('Pincérnél fizetek'), findsNWidgets(2));

        expect(find.text('ÁFÁ-S SZÁMLA'), findsOneWidget);
        expect(find.text('Áfás számlát kérek'), findsOneWidget);
        expect(find.text('MEGRENDELEM'), findsOneWidget);
      });
    });
  }, skip: false);

  group('Simplified Payment flow test: testing error widget.', () {
    setUpAll(() async {
      _mockCart = _mockCart.copyWith(
        orderPolicy: OrderPolicy.placeOnly,
      );
      _mockUnit = _mockUnit.copyWith(
        orderPolicy: OrderPolicy.placeOnly,
      );

      await getIt.unregister<CartBloc>();
      getIt.registerSingleton<CartBloc>(MockCartBloc(
        cart: _mockCart,
        stateToSend: CartErrorState(
          code: CartException.UNKNOWN_ERROR,
          message: 'TEST ERROR MESSAGE',
        ),
      ));
    });

    testWidgets('Test Simplified Payment flow: error test.',
        (WidgetTester tester) async {
      await tester.runAsync(() async {
        tester.binding.window.physicalSizeTestValue = Size(1080, 2048);

        await tester.pumpWidget(
          _createBoilerPlateApp(
            child: SelectPaymentMethodScreen(
              // cart: _mockCart,
              unit: _mockUnit,
            ),
          ),
        );

        await tester.pump();

        expect(find.byType(SelectPaymentMethodScreen), findsOneWidget);

        await tester.pumpAndSettle(Duration(milliseconds: 1000));

        // Check errors
        expect(find.byType(CommonErrorWidget), findsOneWidget);
        expect(
            find.text(
              'Sikertelen rendelés.',
            ),
            findsOneWidget);
        expect(
            find.text(
              'Hiba lépett fel, kérlek fordulj csapatunkhoz segítségért!',
            ),
            findsOneWidget);
      });
    });
  }, skip: true);
}
