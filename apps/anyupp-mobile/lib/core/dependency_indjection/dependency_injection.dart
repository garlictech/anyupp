// import 'package:cloud_functions/cloud_functions.dart';
import 'package:fa_prev/core/units/units.dart';
import 'package:fa_prev/graphql/graphql_client.dart';
import 'package:fa_prev/modules/cart/cart.dart';
import 'package:fa_prev/modules/demo-datastore/demo-datastore.dart';
import 'package:fa_prev/modules/favorites/favorites.dart';
import 'package:fa_prev/modules/login/login.dart';
import 'package:fa_prev/modules/menu/menu.dart';
import 'package:fa_prev/modules/orders/orders.dart';
import 'package:fa_prev/modules/payment/simplepay/simplepay.dart';
import 'package:fa_prev/modules/payment/stripe/stripe.dart';
import 'package:fa_prev/shared/affiliate.dart';
import 'package:fa_prev/shared/connectivity.dart';
import 'package:fa_prev/shared/face.dart';
import 'package:fa_prev/shared/auth.dart';
import 'package:fa_prev/shared/exception.dart';
import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/location.dart';
import 'package:flutter/foundation.dart';
// import 'package:fa_prev/shared/providers.dart';
// import 'package:fa_prev/shared/providers/function_provider_interface.dart';
// import 'package:firebase_auth/firebase_auth.dart';
// import 'package:firebase_database/firebase_database.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_login_facebook/flutter_login_facebook.dart';
import 'package:get_it/get_it.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:stripe_sdk/stripe_sdk.dart';

// This is our global ServiceLocator
GetIt getIt = GetIt.instance;
DotEnv dotEnv = DotEnv();

Future<void> initDependencyInjection() async {
  _initCommon();
  _initProviders();
  _initRepositories();
  _initBlocs();
}

void _initCommon() {
  // FirebaseDatabase database = FirebaseDatabase.instance;
  // FirebaseAuth auth = FirebaseAuth.instance;
  // CloudFunctions functions = CloudFunctions(region: dotEnv.env['region']);
  ValueNotifier<GraphQLClient> graphQLClient = getGraphQLClient(url: dotEnv.env['graphql-url'], websocketUrl: dotEnv.env['graphql-ws-url'], apiKey: dotEnv.env['graphql-api-key']);
  final Stripe stripe = Stripe(
    dotEnv.env['stripe_pulblishable_key'],
    // stripeAccount: dotEnv.env['stripe_merchant_id'],
    returnUrlForSca: dotEnv.env['stripe_return_url_for_sca'],
  );

  // database.setPersistenceEnabled(true);

  // getIt.registerLazySingleton<DatabaseReference>(() => database.reference());
  // getIt.registerLazySingleton<FirebaseAuth>(() => auth);
  // getIt.registerLazySingleton<CloudFunctions>(() => functions);
  getIt.registerLazySingleton<GoogleSignIn>(() => GoogleSignIn());
  getIt.registerLazySingleton<FacebookLogin>(() => FacebookLogin());
  getIt.registerLazySingleton<ValueNotifier<GraphQLClient>>(() => graphQLClient);
  getIt.registerLazySingleton<Stripe>(() => stripe);
}

void _initProviders() {
  // Providers
  // getIt.registerLazySingleton<IUserProvider>(() => AwsUserProvider());
  // getIt.registerLazySingleton<IAuthProvider>(
  //     () => FirebaseAuthProvider(getIt<FirebaseAuth>(), getIt<DatabaseReference>()));
  getIt.registerLazySingleton<IAuthProvider>(() => AwsAuthProvider());
  // getIt.registerLazySingleton<IFunctionProvider>(() => FirebaseFunctionsProvider(getIt<CloudFunctions>()));
  getIt.registerLazySingleton<IFavoritesProvider>(
      () => AwsFavoritesProvider(getIt<IAuthProvider>()));
  getIt.registerLazySingleton<IOrdersProvider>(
      () => AwsOrderProvider(getIt<IAuthProvider>(), getIt<ValueNotifier<GraphQLClient>>(), ));
  getIt.registerLazySingleton<IProductProvider>(() => AwsProductProvider());
  getIt.registerLazySingleton<IUnitProvider>(() => AwsUnitProvider());
  getIt.registerLazySingleton<IStripePaymentProvider>(() => GraphQLStripePaymentProvider(getIt<ValueNotifier<GraphQLClient>>(), getIt<Stripe>()));
  getIt.registerLazySingleton<ISimplePayProvider>(() => AwsSimplepayProvider());

  // Login providers
  // getIt.registerLazySingleton<ICommonLoginProvider>(() => FirebaseCommonLoginProvider(
  //       getIt<FirebaseAuth>(),
  //       getIt<IUserProvider>(),
  //     ));
  // getIt.registerLazySingleton<ISocialLoginProvider>(() => FirebaseSocialLoginProvider(
  //       getIt<FirebaseAuth>(),
  //       getIt<GoogleSignIn>(),
  //       getIt<FacebookLogin>(),
  //       getIt<IUserProvider>(),
  //       getIt<ICommonLoginProvider>(),
  //     ));
  getIt.registerLazySingleton<ICommonLoginProvider>(() => AwsCommonLoginProvider());
  getIt.registerLazySingleton<IPhoneLoginProvider>(() => AwsPhoneLoginProvider());
  getIt.registerLazySingleton<IEmailLoginProvider>(() => AwsEmailLoginProvider(
        getIt<IAuthProvider>(),
      ));

  // Login providers AWS
  getIt.registerLazySingleton<ISocialLoginProvider>(
      () => AwsSocialLoginProvider(getIt<GoogleSignIn>(), getIt<FacebookLogin>(), getIt<IAuthProvider>()));
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
  getIt.registerLazySingleton<FaceRepository>(() => FaceRepository());
  getIt.registerLazySingleton<CartRepository>(() => CartRepository(getIt<IOrdersProvider>()));
  getIt.registerLazySingleton<StripePaymentRepository>(() => StripePaymentRepository(getIt<IStripePaymentProvider>()));

  // TODO!!! AZ AMPLIFY DATASTORE DEMO MIATT!!!
  getIt.registerLazySingleton<AmplifyUnitRepository>(() => AmplifyUnitRepository());
  
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
  getIt.registerLazySingleton(() => FaceDetectionBloc(getIt<FaceRepository>()));
  getIt.registerLazySingleton(() => NetworkStatusBloc());
  getIt.registerLazySingleton(() => PaymentBloc(getIt<OrderRepository>()));
  getIt.registerLazySingleton(() => AffiliateBloc(getIt<AffiliateRepository>()));
  getIt.registerLazySingleton(() => StripePaymentBloc(getIt<StripePaymentRepository>()));
  getIt.registerLazySingleton(() => OrderBloc(getIt<OrderRepository>()));

  // TODO!!! AZ AMPLIFY DATASTORE DEMO MIATT!!!
  getIt.registerLazySingleton(() => AmplifyUnitBloc(getIt<AmplifyUnitRepository>()));
 
}
