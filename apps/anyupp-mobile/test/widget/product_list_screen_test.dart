import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/cart/cart.dart';
import 'package:fa_prev/modules/favorites/favorites.dart';
import 'package:fa_prev/modules/menu/menu.dart';
import 'package:fa_prev/modules/takeaway/takeaway.dart';
import 'package:fa_prev/shared/auth/auth.dart';
import 'package:fa_prev/shared/exception.dart';
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
    GeoUnit mockUnit = MockGenerator.generateUnit(
      name: 'Test Unit',
      currency: 'huf',
    ).copyWith(
      packagingTax: 10,
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
