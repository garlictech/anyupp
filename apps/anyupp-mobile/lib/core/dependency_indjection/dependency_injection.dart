import 'package:fa_prev/app-config.dart';
import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/graphql/graphql.dart';
import 'package:fa_prev/modules/cart/cart.dart';
import 'package:fa_prev/modules/favorites/favorites.dart';
import 'package:fa_prev/modules/login/login.dart';
import 'package:fa_prev/modules/main/main.dart';
import 'package:fa_prev/modules/menu/menu.dart';
import 'package:fa_prev/modules/orders/orders.dart';
import 'package:fa_prev/modules/payment/stripe/stripe.dart';
import 'package:fa_prev/modules/rating_tipping/rating_tipping.dart';
import 'package:fa_prev/modules/takeaway/takeaway.dart';
import 'package:fa_prev/modules/transactions/transactions.dart';
import 'package:fa_prev/shared/auth.dart';
import 'package:fa_prev/shared/connectivity.dart';
import 'package:fa_prev/shared/exception.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/location.dart';
import 'package:fa_prev/shared/notifications/notifications.dart';
import 'package:fa_prev/shared/user-details/user_details.dart';
import 'package:get_it/get_it.dart';
import 'package:stripe_sdk/stripe_sdk.dart';

// This is our global ServiceLocator
GetIt getIt = GetIt.instance;

Future<void> initDependencyInjection() async {
  _initCommon();
  _initProviders();
  _initRepositories();
  _initServices();
  _initBlocs();
}

void _initCommon() async {
  // log.d('AWS CONFIG=${AppConfig.config}');

  final Stripe stripe = Stripe(
    AppConfig.StripePublishableKey,
    returnUrlForSca: 'anyupp://stripe',
  );

  getIt.registerLazySingleton<AppConstants>(() => AppConstants(
        paginationSize: 100,
      ));

  final CognitoService cognitoService = CognitoService(
    region: AppConfig.Region,
    userPoolId: AppConfig.UserPoolId,
    identityPoolId: AppConfig.IdentityPoolId,
    clientId: AppConfig.UserPoolClientId,
  );
  getIt.registerLazySingleton<CognitoService>(() => cognitoService);
  getIt.registerLazySingleton<Stripe>(() => stripe);
}

void _initProviders() {
  // Providers
  getIt.registerLazySingleton<IAuthProvider>(
      () => AwsAuthProvider(getIt<CognitoService>()));
  getIt.registerLazySingleton<IFavoritesProvider>(
      () => AwsFavoritesProvider(getIt<IAuthProvider>()));
  getIt.registerLazySingleton<ICartProvider>(
      () => AwsCartMemoryProvider(getIt<IAuthProvider>()));
  getIt.registerFactory<IOrdersProvider>(
      () => AwsOrderProvider(getIt<IAuthProvider>()));
  getIt.registerLazySingleton<IProductProvider>(() => AwsProductProvider());
  getIt.registerLazySingleton<IUnitProvider>(() => AwsUnitProvider());
  getIt.registerLazySingleton<IStripePaymentProvider>(() =>
      GraphQLStripePaymentProvider(getIt<Stripe>(), getIt<ICartProvider>()));
  getIt.registerLazySingleton<IExternalPaymentProvider>(
      () => ExternalPaymentProvider(getIt<ICartProvider>()));

  getIt
      .registerLazySingleton<ICommonLoginProvider>(() => AwsCommonLoginProvider(
            getIt<IAuthProvider>(),
            getIt<CognitoService>(),
          ));
  getIt.registerLazySingleton<IPhoneLoginProvider>(
      () => AwsPhoneLoginProvider());
  getIt.registerLazySingleton<IEmailLoginProvider>(() => AwsEmailLoginProvider(
        getIt<IAuthProvider>(),
        getIt<CognitoService>(),
      ));
  getIt.registerLazySingleton<AwsTransactionsProvider>(
      () => AwsTransactionsProvider(getIt<IAuthProvider>()));

  // Login providers AWS
  getIt.registerLazySingleton<ISocialLoginProvider>(
      () => AwsSocialLoginProvider(getIt<IAuthProvider>()));

  // User details
  getIt.registerLazySingleton<IUserDetailsProvider>(
      () => AwsUserDetailsProvider(getIt<IAuthProvider>()));

  // Rating and Tip
  getIt.registerLazySingleton<IRatingProvider>(() => AwsRatingProvider());
}

void _initRepositories() {
  // Login Repository
  getIt.registerLazySingleton<LoginRepository>(() => LoginRepository(
        getIt<ICommonLoginProvider>(),
        getIt<ISocialLoginProvider>(),
        getIt<IEmailLoginProvider>(),
      ));
  getIt.registerLazySingleton<ProductRepository>(
      () => ProductRepository(getIt<IProductProvider>()));
  getIt.registerFactory<OrderRepository>(
      () => OrderRepository(getIt<IOrdersProvider>()));
  getIt.registerLazySingleton<UnitRepository>(
      () => UnitRepository(getIt<IUnitProvider>()));
  getIt.registerLazySingleton<FavoritesRepository>(
      () => FavoritesRepository(getIt<IFavoritesProvider>()));
  getIt.registerLazySingleton<TransactionsRepository>(
      () => TransactionsRepository(getIt<AwsTransactionsProvider>()));

  // Repostories
  getIt.registerLazySingleton<AuthRepository>(
      () => AuthRepository(getIt<IAuthProvider>()));
  getIt.registerLazySingleton<OrderNotificationService>(
      () => OrderNotificationService());
  getIt.registerLazySingleton<LocationRepository>(() => LocationRepository());
  getIt.registerLazySingleton<CartRepository>(
      () => CartRepository(getIt<ICartProvider>(), getIt<IAuthProvider>()));
  getIt.registerLazySingleton<StripePaymentRepository>(() =>
      StripePaymentRepository(
          getIt<IStripePaymentProvider>(), getIt<IExternalPaymentProvider>()));

  getIt.registerLazySingleton<UserDetailsRepository>(
      () => UserDetailsRepository(getIt<IUserDetailsProvider>()));

  // Rating and Tip
  getIt.registerLazySingleton<RatingRepository>(
      () => RatingRepository(getIt<IRatingProvider>()));
}

void _initServices() {
  getIt.registerLazySingleton<GraphQLClientService>(() => GraphQLClientService(
        authProvider: getIt<IAuthProvider>(),
        amplifyApiUrl: AppConfig.CrudGraphqlApiUrl,
        amplifyApiKey: AppConfig.CrudGraphqlApiKey,
      ));
}

void _initBlocs() {
// Blocs
  getIt.registerLazySingleton(() => AuthBloc(getIt<AuthRepository>()));
  getIt.registerLazySingleton(() => ExceptionBloc());
  getIt.registerLazySingleton(() => UnitSelectBloc());
  getIt.registerLazySingleton(() => TakeAwayBloc());
  getIt.registerLazySingleton(
      () => TransactionsBloc(getIt<TransactionsRepository>()));
  getIt.registerLazySingleton(
      () => UnitsBloc(getIt<UnitRepository>(), getIt<LocationRepository>()));
  getIt.registerFactory(() => ProductCategoriesBloc(
      getIt<UnitSelectBloc>(), getIt<ProductRepository>()));
  getIt.registerFactory(() => ProductListBloc(
      getIt<ProductRepository>(), getIt<FavoritesRepository>()));
  getIt
      .registerLazySingleton(() => FavoritesBloc(getIt<FavoritesRepository>()));
  getIt.registerLazySingleton(() => LocaleBloc());
  getIt.registerLazySingleton(() => LoginBloc(getIt<LoginRepository>()));
  getIt.registerLazySingleton(() => ThemeBloc(getIt<UnitSelectBloc>()));
  getIt.registerLazySingleton(() => CartBloc(getIt<CartRepository>(),
      getIt<OrderRepository>(), getIt<TakeAwayBloc>()));
  getIt.registerLazySingleton(() => NetworkStatusBloc());
  getIt.registerLazySingleton(() => StripePaymentBloc(
      getIt<StripePaymentRepository>(), getIt<CartRepository>()));
  getIt.registerLazySingleton(() => OrderBloc(getIt<OrderRepository>()));
  getIt.registerLazySingleton(() => OrderCounterBloc(getIt<OrderRepository>()));
  getIt.registerLazySingleton(() => OrderRefreshBloc());
  getIt.registerLazySingleton(() => OrderHistoryBloc(getIt<OrderRepository>()));
  getIt.registerLazySingleton(() => OrderDetailsBloc(getIt<OrderRepository>()));
  getIt.registerLazySingleton(() => MainNavigationBloc());
  getIt.registerLazySingleton(() => ConfigsetBloc());
  getIt.registerLazySingleton(
      () => UserDetailsBloc(getIt<UserDetailsRepository>()));

  // Rating and Tip
  getIt.registerLazySingleton(() => RatingBloc(
        getIt<RatingRepository>(),
        getIt<OrderRepository>(),
      ));
  getIt.registerLazySingleton(() => RatingOrderNotificationBloc(
        getIt<OrderRepository>(),
      ));

  // Local notifications
  getIt.registerLazySingleton(() => NotificationsBloc());
}
