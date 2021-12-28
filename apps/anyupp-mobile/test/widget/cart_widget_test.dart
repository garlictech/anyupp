import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/cart/cart.dart';
import 'package:fa_prev/modules/payment/payment.dart';
import 'package:fa_prev/modules/takeaway/bloc/takeaway_bloc.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';

import '../mock/mock_data_faker.dart';
import 'mock/mock_theme_bloc.dart';
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
    mockCart = mockCart.copyWith(items: [
      MockGenerator.generateOrderItem(
        name: 'Hamburger',
        variantName: 'Dupla',
        price: 500.0,
        packagingFee: 100.0,
        status: OrderStatus.placed,
      ),
    ]);

    getIt.registerSingleton<ThemeBloc>(MockThemeBloc());
    getIt.registerSingleton<TakeAwayBloc>(MockTakeAwayBloc(
      servingMode: ServingMode.takeAway,
    ));
    getIt.registerSingleton<CartRepository>(MockCartRepository(mockCart));
    getIt.registerSingleton<CartBloc>(MockCartBloc(mockCart));
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

      // Character \xa0 is a non-breaking-space
      checkTextValue('cart-packagingfee-text', '100\xa0Ft');
      checkTextValue('cart-totalprice-text', 'FIZETEK (600\xa0Ft)');
    });
  });
}
