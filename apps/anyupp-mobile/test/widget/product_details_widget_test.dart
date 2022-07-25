import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/cart/cart.dart';
import 'package:fa_prev/modules/favorites/favorites.dart';
import 'package:fa_prev/modules/menu/menu.dart';
import 'package:fa_prev/modules/takeaway/takeaway.dart';
import 'package:fa_prev/shared/auth.dart';
import 'package:fa_prev/shared/connectivity.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mocktail/mocktail.dart';

import '../unit/mock/mock_auth_provider.dart';
import '../mock/mock_data_faker.dart';
import 'mock/mocks.dart';

GeoUnit _unit = MockGenerator.generateUnit(
  name: 'TEST UNIT',
  currency: 'HUF',
);

class MockFavoritesBloc extends Fake implements FavoritesBloc {
  FavoritesState get state => ProductIsFavorite(true);
  void add(FavoritesEvent event) {}
  Stream<FavoritesState> get stream => Stream.value(ProductIsFavorite(true));
  Future<void> close() async => {};
}

class FakeFavoritesState extends Fake implements FavoritesState {}

class FakeFavoritesEvent extends Fake implements FavoritesEvent {}

class MockConfigsetBloc extends Fake implements ConfigsetBloc {
  Stream<ConfigsetState> get stream => Stream.value(ConfigsetUpdated(
        totalPrice: 1.0,
        unit: _unit,
        orderItem: MockGenerator.generateOrderItem(
          name: 'ORDER_ITEM',
          price: 1.0,
          productId: 'ORDER_ITEM_PRODUCT_ID',
          status: OrderStatus.none,
          variantName: 'ORDER_ITEM_VARIANT',
          quantity: 1,
        ),
      ));
  void add(ConfigsetEvent event) {}
  ConfigsetState get state => ConfigsetUpdated(
        totalPrice: 1.0,
        unit: _unit,
        orderItem: MockGenerator.generateOrderItem(
          name: 'ORDER_ITEM',
          price: 1.0,
          productId: 'ORDER_ITEM_PRODUCT_ID',
          status: OrderStatus.none,
          variantName: 'ORDER_ITEM_VARIANT',
          quantity: 1,
        ),
      );
  Future<void> close() async => {};
}

class FakeConfigsetState extends Fake implements ConfigsetState {}

class FakeConfigsetEvent extends Fake implements ConfigsetEvent {}

class MockNetworkStatusBloc extends Fake implements NetworkStatusBloc {
  Stream<NetworkState> get stream => Stream.value(NetworkState(
        ConnectivityResult.wifi,
        true,
        false,
        false,
      ));

  NetworkState get state => NetworkState(
        ConnectivityResult.wifi,
        true,
        false,
        false,
      );
  Future<void> close() async => {};
}

class FakeNetworkStatusEvent extends Fake implements NetworkStatusEvent {}

class FakeNetworkState extends Fake implements NetworkState {}

void main() {
  setUpAll(() {
    registerFallbackValue(FakeFavoritesState());
    registerFallbackValue(FakeFavoritesEvent());
    registerFallbackValue(FakeNetworkState());
    registerFallbackValue(FakeNetworkStatusEvent());
    registerFallbackValue(FakeConfigsetState());
    registerFallbackValue(FakeConfigsetEvent());
  });

  setUp(() {
    GoogleFonts.config.allowRuntimeFetching = false;
    MockThemeBloc themeBloc = MockThemeBloc();

    var mockFavorites = MockFavoritesBloc();
    var mockCartRepository = MockCartRepository(null);
    var mockNetworkBloc = MockNetworkStatusBloc();

    getIt.registerSingleton<NetworkStatusBloc>(mockNetworkBloc);
    getIt.registerSingleton<ThemeBloc>(themeBloc);
    getIt.registerSingleton<UnitSelectBloc>(MockUnitSelectBloc(_unit));
    getIt.registerSingleton<FavoritesBloc>(mockFavorites);
    getIt.registerSingleton<CartRepository>(mockCartRepository);
    getIt.registerSingleton<ConfigsetBloc>(MockConfigsetBloc());
    getIt.registerSingleton<TakeAwayBloc>(MockTakeAwayBloc());
    getIt.registerSingleton<IAuthProvider>(MockAuthProvider());
  });

  Widget _createBoilerPlateApp({required Widget child}) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(
            create: (BuildContext context) => getIt<NetworkStatusBloc>()),
        BlocProvider(create: (BuildContext context) => getIt<ThemeBloc>()),
        BlocProvider(create: (BuildContext context) => getIt<UnitSelectBloc>()),
        BlocProvider(create: (BuildContext context) => getIt<FavoritesBloc>()),
        BlocProvider(create: (BuildContext context) => getIt<ConfigsetBloc>()),
        BlocProvider(create: (BuildContext context) => getIt<TakeAwayBloc>()),
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

  testWidgets('Test Product Details widget', (WidgetTester tester) async {
    tester.binding.window.physicalSizeTestValue = Size(1080, 2000);

    await tester.runAsync(() async {
      GeneratedProduct product = MockGenerator.generateProduct(
        name: 'Hamburger',
        variantCount: 1,
        servingModes: [ServingMode.inPlace],
      );

      await tester.pumpWidget(
        _createBoilerPlateApp(
          child: ProductDetailsScreen(
            item: product,
            unit: _unit,
            displayState: ProductItemDisplayState.NORMAL,
            servingMode: ServingMode.takeAway,
          ),
        ),
      );

      await tester.pump(Duration(seconds: 5));

      expect(find.byType(ProductDetailsScreen), findsOneWidget);
      expect(find.byType(ProductDetailsWidget), findsOneWidget);
      expect(find.byType(AddToCartPanelWidget), findsOneWidget);
    });
  });
}
