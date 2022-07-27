import '/core/core.dart';
import '/graphql/generated/crud-api.dart';
import '/models.dart';
import '/modules/cart/cart.dart';
import '/modules/payment/payment.dart';
import '/modules/takeaway/bloc/takeaway_bloc.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';

import '../mock/mock_data_faker.dart';
import 'mock/mocks.dart';
import 'utils/boilerplate_app.dart';
import 'utils/widget_utils.dart';

void main() {
  setUpAll(() async {
    GoogleFonts.config.allowRuntimeFetching = false;

    GeoUnit mockUnit = MockGenerator.generateUnit(
      name: 'TEST UNIT',
      currency: 'huf',
    );

    Cart mockCart = MockGenerator.generateBasicCart(
      servingMode: ServingMode.takeAway,
    );
    mockCart = mockCart.copyWith(
      items: [
        MockGenerator.generateOrderItem(
          name: 'Hamburger',
          variantName: 'Dupla',
          price: 500.0,
          packagingFee: 100.0,
          status: OrderStatus.placed,
        ),
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
    getIt.registerSingleton<CartRepository>(MockCartRepository(mockCart));
    getIt.registerSingleton<CartBloc>(MockCartBloc(cart: mockCart));
    getIt.registerSingleton<UnitSelectBloc>(MockUnitSelectBloc(mockUnit));
    getIt.registerSingleton<StripePaymentBloc>(MockStripePaymentBloc());
  });

  Widget _createBoilerPlateApp({required Widget child}) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(create: (_) => getIt<ThemeBloc>()),
        BlocProvider(create: (_) => getIt<TakeAwayBloc>()),
        BlocProvider(create: (_) => getIt<UnitSelectBloc>()),
        BlocProvider(create: (_) => getIt<StripePaymentBloc>()),
        BlocProvider(create: (_) => getIt<CartBloc>()),
      ],
      child: MockMaterialApp(
        child: child,
      ),
    );
  }

  testWidgets('Test Cart Screen', (WidgetTester tester) async {
    await tester.runAsync(() async {
      tester.binding.window.physicalSizeTestValue = Size(1080, 2048);

      await tester.pumpWidget(
        _createBoilerPlateApp(
          child: CartScreen(),
        ),
      );

      await tester.pump();

      expect(find.byType(CartScreen), findsOneWidget);

      // Wait to complete the animations of the cart items
      await tester.pumpAndSettle(Duration(milliseconds: 1000));

      expect(find.byType(CartListItemWidget), findsNWidgets(2));

      // Character \xa0 is a non-breaking-space
      checkTextValue('cart-packagingfee-text', '210\xa0Ft'); // 2 x (100 + 5)
      checkTextValue('cart-totalprice-text', 'FIZETEK (1\xa0210\xa0Ft)');
    });
  });
}
