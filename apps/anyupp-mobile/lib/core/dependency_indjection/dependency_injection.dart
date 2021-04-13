import 'package:fa_prev/app.dart';
import 'package:fa_prev/core/units/units.dart';
import 'package:fa_prev/graphql/graphql.dart';
import 'package:fa_prev/modules/cart/cart.dart';
import 'package:fa_prev/modules/favorites/favorites.dart';
import 'package:fa_prev/modules/login/login.dart';
import 'package:fa_prev/modules/menu/menu.dart';
import 'package:fa_prev/modules/orders/orders.dart';
import 'package:fa_prev/modules/payment/simplepay/simplepay.dart';
import 'package:fa_prev/modules/payment/stripe/stripe.dart';
import 'package:fa_prev/shared/affiliate.dart';
import 'package:fa_prev/shared/connectivity.dart';
import 'package:fa_prev/shared/auth.dart';
import 'package:fa_prev/shared/exception.dart';
import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/location.dart';
import 'package:flutter/foundation.dart';
import 'package:get_it/get_it.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
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

void _initCommon() {
  print('AWS CONFIG=$awsConfig');

  final Stripe stripe = Stripe(
    awsConfig['stripePublishableKey'],
    returnUrlForSca: awsConfig['stripeReturnUrlForSca'] ?? 'todo',
  );

  // final CognitoService cognitoService = CognitoService(
  //   region: awsConfig['region'],
  //   userPoolId: awsConfig['consumerUserPoolId'],
  //   identityPoolId: awsConfig['IdentityPoolId'],
  //   clientId: awsConfig['consumerWebUserPoolClientId'],
  // );
  // getIt.registerLazySingleton<CognitoService>(() => cognitoService);
  getIt.registerLazySingleton<Stripe>(() => stripe);
}

void _initProviders() {
  // Providers
  getIt.registerLazySingleton<IAuthProvider>(() => AwsAuthProvider());
  getIt.registerLazySingleton<IFavoritesProvider>(() => AwsFavoritesProvider(getIt<IAuthProvider>()));
  getIt.registerLazySingleton<IOrdersProvider>(() => AwsOrderProvider(
        getIt<IAuthProvider>(),
      ));
  getIt.registerLazySingleton<IProductProvider>(() => AwsProductProvider());
  getIt.registerLazySingleton<IUnitProvider>(() => AwsUnitProvider());
  getIt.registerLazySingleton<IStripePaymentProvider>(
      () => GraphQLStripePaymentProvider(getIt<ValueNotifier<GraphQLClient>>(), getIt<Stripe>()));
  getIt.registerLazySingleton<ISimplePayProvider>(() => AwsSimplepayProvider());

  getIt.registerLazySingleton<ICommonLoginProvider>(() => AwsCommonLoginProvider(getIt<IAuthProvider>()));
  getIt.registerLazySingleton<IPhoneLoginProvider>(() => AwsPhoneLoginProvider());
  getIt.registerLazySingleton<IEmailLoginProvider>(() => AwsEmailLoginProvider(
        getIt<IAuthProvider>(),
      ));

  // Login providers AWS
  getIt.registerLazySingleton<ISocialLoginProvider>(() => AwsSocialLoginProvider(getIt<IAuthProvider>()));
  getIt.registerLazySingleton<IAffiliateProvider>(() => AwsAffiliateProvider());
}

void _initRepositories() {
  // Login Repository
  getIt.registerLazySingleton<LoginRepository>(() => LoginRepository(
        getIt<ICommonLoginProvider>(),
        getIt<ISocialLoginProvider>(),
        getIt<IEmailLoginProvider>(),
        getIt<IPhoneLoginProvider>(),
      ));
  getIt.registerLazySingleton<ProductRepository>(() => ProductRepository(getIt<IProductProvider>()));
  getIt.registerLazySingleton<OrderRepository>(() => OrderRepository(getIt<IOrdersProvider>()));
  getIt.registerLazySingleton<UnitRepository>(() => UnitRepository(getIt<IUnitProvider>()));
  getIt.registerLazySingleton<FavoritesRepository>(() => FavoritesRepository(getIt<IFavoritesProvider>()));
  getIt.registerLazySingleton<SimplePayRepository>(() => SimplePayRepository(getIt<ISimplePayProvider>()));

  // Repostories
  getIt.registerLazySingleton<AffiliateRepository>(() => AffiliateRepository(getIt<IAffiliateProvider>()));
  getIt.registerLazySingleton<AuthRepository>(() => AuthRepository(getIt<IAuthProvider>()));
  getIt.registerLazySingleton<OrderNotificationService>(() => OrderNotificationService());
  getIt.registerLazySingleton<LocationRepository>(() => LocationRepository());
  getIt.registerLazySingleton<CartRepository>(() => CartRepository(getIt<IOrdersProvider>(), getIt<IAuthProvider>()));
  getIt.registerLazySingleton<StripePaymentRepository>(() => StripePaymentRepository(getIt<IStripePaymentProvider>()));
}

void _initServices() {
  getIt.registerLazySingleton<GraphQLClientService>(() => GraphQLClientService(
        authProvider: getIt<IAuthProvider>(),
        graphqlApiUrl: awsConfig['GraphqlApiUrl'],
        graphqlApiKey: awsConfig['GraphqlApiKey'],
        graphqlAdminApiUrl: awsConfig['GraphqlAdminApiUrl'],
        graphqlAdminApiKey: awsConfig['GraphqlAdminApiKey'],
      ));
}

void _initBlocs() {
// Blocs
  getIt.registerLazySingleton(() => AuthBloc(getIt<AuthRepository>()));
  getIt.registerLazySingleton(() => ExceptionBloc());
  getIt.registerLazySingleton(() => UnitSelectBloc());
  getIt.registerLazySingleton(() => UnitsBloc(getIt<UnitRepository>(), getIt<LocationRepository>()));
  getIt.registerLazySingleton(() => ProductCategoriesBloc(getIt<UnitSelectBloc>(), getIt<ProductRepository>()));
  getIt.registerLazySingleton(() => FavoritesBloc(getIt<FavoritesRepository>()));
  getIt.registerLazySingleton(() => LocaleBloc());
  getIt.registerLazySingleton(() => LoginBloc(getIt<LoginRepository>()));
  getIt.registerLazySingleton(() => SimplePayBloc(getIt<SimplePayRepository>()));
  getIt.registerLazySingleton(() => ThemeBloc(getIt<UnitSelectBloc>()));
  getIt.registerLazySingleton(() => CartBloc(getIt<CartRepository>()));
  getIt.registerLazySingleton(() => NetworkStatusBloc());
  getIt.registerLazySingleton(() => PaymentBloc(getIt<OrderRepository>()));
  getIt.registerLazySingleton(() => AffiliateBloc(getIt<AffiliateRepository>()));
  getIt.registerLazySingleton(() => StripePaymentBloc(getIt<StripePaymentRepository>()));
  getIt.registerLazySingleton(() => OrderBloc(getIt<OrderRepository>()));
}
