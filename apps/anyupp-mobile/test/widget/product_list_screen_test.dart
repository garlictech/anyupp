import 'package:anyupp/core/core.dart';
import 'package:anyupp/graphql/generated/crud-api.dart';
import 'package:anyupp/models.dart';
import 'package:anyupp/modules/cart/cart.dart';
import 'package:anyupp/modules/favorites/favorites.dart';
import 'package:anyupp/modules/menu/menu.dart';
import 'package:anyupp/modules/takeaway/takeaway.dart';
import 'package:anyupp/shared/auth/auth.dart';
import 'package:anyupp/shared/exception.dart';
import 'package:faker/faker.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';

import '../mock/mock_data_faker.dart';
import '../unit/mock/mock_auth_provider.dart';
import 'mock/mocks.dart';
import 'utils/boilerplate_app.dart';

void main() {
  late User _mockUser;
  // late ExceptionBloc _mockExceptionBloc;

  setUpAll(() async {
    GoogleFonts.config.allowRuntimeFetching = false;
    _mockUser = User(
      id: faker.guid.guid(),
      email: 'test_user_profile@anyupp.com',
      name: 'John Doe',
    );
    Unit mockUnit = MockGenerator.generateUnit(
      name: 'Test Unit',
      currency: 'huf',
    ).copyWith(
      packagingTaxPercentage: 10,
    );
    Cart mockCart = MockGenerator.generateBasicCart(
      unitId: mockUnit.id,
      userId: _mockUser.id,
      servingMode: ServingMode.takeAway,
    ).copyWith(items: [
      MockGenerator.generateOrderItem(
        name: 'Hamburger',
        variantName: 'Sajtos',
        price: 500.0,
        status: OrderStatus.none,
      ),
    ]);

    getIt.registerSingleton<CartRepository>(MockCartRepository(mockCart));
    getIt.registerSingleton<ThemeBloc>(MockThemeBloc());
    getIt.registerSingleton<AuthRepository>(
        AuthRepository(MockAuthProvider(user: _mockUser)));
    getIt.registerSingleton<CartBloc>(MockCartBloc(
      stateToSend: EmptyCartState(),
    ));
    getIt.registerSingleton<TakeAwayBloc>(MockTakeAwayBloc(
      servingMode: ServingMode.inPlace,
    ));
    getIt.registerSingleton<UnitSelectBloc>(MockUnitSelectBloc(mockUnit));
    getIt.registerSingleton<FavoritesBloc>(MockFavoritesBloc());
    getIt.registerSingleton<ExceptionBloc>(MockExceptionBloc());

    getIt.registerSingleton<ProductListBloc>(
        MockProductListBloc(ProductListLoaded(
      products: [],
    )));
  });

  Widget _createBoilerPlateApp({required Widget child}) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(create: (_) => getIt<ThemeBloc>()),
        BlocProvider(create: (_) => getIt<CartBloc>()),
        BlocProvider(create: (_) => getIt<TakeAwayBloc>()),
        BlocProvider(create: (_) => getIt<UnitSelectBloc>()),
        BlocProvider(create: (_) => getIt<FavoritesBloc>()),
        BlocProvider(create: (_) => getIt<ExceptionBloc>()),
        BlocProvider(create: (_) => getIt<ProductListBloc>()),
      ],
      child: MockMaterialApp(
        child: child,
      ),
    );
  }

  group('Select Unit Screen test', () {
    testWidgets('Test Select Unit screen to be displayed correctly.',
        (WidgetTester tester) async {
      await tester.runAsync(() async {
        tester.binding.window.physicalSizeTestValue = Size(1080, 1920);

        await tester.pumpWidget(
          _createBoilerPlateApp(child: MenuScreen()),
        );

        await tester.pump();

        expect(find.byType(MenuScreen), findsOneWidget);
        expect(find.byType(ProductMenuAppBar), findsOneWidget);

        // Wait to complete the animations
        await tester.pumpAndSettle(Duration(milliseconds: 1000));
      });
    });
  }, skip: false);
}
