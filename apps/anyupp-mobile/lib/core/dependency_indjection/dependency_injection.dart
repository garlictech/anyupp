import 'package:cloud_functions/cloud_functions.dart';
import 'package:fa_prev/core/units/units.dart';
import 'package:fa_prev/graphql/graphql_client.dart';
import 'package:fa_prev/modules/cart/cart.dart';
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
import 'package:fa_prev/shared/providers.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_database/firebase_database.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_login_facebook/flutter_login_facebook.dart';
import 'package:get_it/get_it.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:stripe_sdk/stripe_sdk.dart';

// This is our global ServiceLocator
GetIt getIt = GetIt.instance;
DotEnv dotEnv = DotEnv();

void initDependencyInjection() {
  // 3rd party
  FirebaseDatabase database = FirebaseDatabase.instance;
  FirebaseAuth auth = FirebaseAuth.instance;
  CloudFunctions functions = CloudFunctions(region: dotEnv.env['region']);
  GraphQLClient graphQLClient = getGraphQLClient(url: dotEnv.env['graphql-url']);
  final Stripe stripe = Stripe(
    dotEnv.env['stripe_pulblishable_key'],
    // stripeAccount: dotEnv.env['stripe_merchant_id'],
    returnUrlForSca: dotEnv.env['stripe_return_url_for_sca'],
  );

  // database.setPersistenceEnabled(true);

  getIt.registerLazySingleton<DatabaseReference>(() => database.reference());
  getIt.registerLazySingleton<FirebaseAuth>(() => auth);
  getIt.registerLazySingleton<CloudFunctions>(() => functions);
  getIt.registerLazySingleton<GoogleSignIn>(() => GoogleSignIn());
  getIt.registerLazySingleton<FacebookLogin>(() => FacebookLogin());

  // Providers
  getIt.registerLazySingleton<FirebaseUserProvider>(() => FirebaseUserProvider());
  getIt.registerLazySingleton<FirebaseAuthProvider>(
      () => FirebaseAuthProvider(getIt<FirebaseAuth>(), getIt<DatabaseReference>()));
  getIt.registerLazySingleton<FirebaseFunctionsProvider>(() => FirebaseFunctionsProvider(getIt<CloudFunctions>()));
  getIt.registerLazySingleton<FirebaseFavoritesProvider>(
      () => FirebaseFavoritesProvider(getIt<DatabaseReference>(), getIt<FirebaseAuthProvider>()));
  getIt.registerLazySingleton<FirebaseOrderProvider>(() => FirebaseOrderProvider(
      getIt<DatabaseReference>(), getIt<FirebaseAuthProvider>(), getIt<FirebaseFunctionsProvider>()));
  getIt.registerLazySingleton<FirebaseProductProvider>(() => FirebaseProductProvider(getIt<DatabaseReference>()));
  getIt.registerLazySingleton<FirebaseUnitProvider>(() => FirebaseUnitProvider(getIt<FirebaseFunctionsProvider>()));
  getIt.registerLazySingleton<GraphQLStripePaymentProvider>(() => GraphQLStripePaymentProvider(graphQLClient, stripe));
  getIt.registerLazySingleton<FirebaseSimplepayProvider>(() => FirebaseSimplepayProvider(getIt<FirebaseFunctionsProvider>()));
  getIt.registerLazySingleton<FirebaseCartProvider>(() => FirebaseCartProvider(getIt<DatabaseReference>(), getIt<FirebaseAuthProvider>(), getIt<FirebaseFunctionsProvider>()));

  // Login providers
  getIt.registerLazySingleton<FirebaseCommonLoginProvider>(() => FirebaseCommonLoginProvider(
    getIt<FirebaseAuth>(),
    getIt<FirebaseUserProvider>(),));
  getIt.registerLazySingleton<FirebaseSocialLoginProvider>(() => FirebaseSocialLoginProvider(
    getIt<FirebaseAuth>(),
    getIt<GoogleSignIn>(),
    getIt<FacebookLogin>(),
    getIt<FirebaseUserProvider>(),
    ));
  getIt.registerLazySingleton<FirebasePhoneLoginProvider>(() => FirebasePhoneLoginProvider(
    getIt<FirebaseAuth>(),
    getIt<FirebaseUserProvider>(),
    getIt<FirebaseCommonLoginProvider>(),
    ));
   getIt.registerLazySingleton<FirebaseEmailLoginProvider>(() => FirebaseEmailLoginProvider(
    getIt<FirebaseAuth>(),
    getIt<FirebaseUserProvider>(),
    ));

  // Firebase Login Repository
  getIt.registerLazySingleton<LoginRepository>(() => LoginRepository(
        getIt<FirebaseUserProvider>(),
        getIt<FirebaseCommonLoginProvider>(),
        getIt<FirebaseSocialLoginProvider>(),
        getIt<FirebaseEmailLoginProvider>(),
        getIt<FirebasePhoneLoginProvider>(),
      ));
  getIt.registerLazySingleton<ProductRepository>(() => ProductRepository(getIt<FirebaseProductProvider>()));
  getIt.registerLazySingleton<OrderRepository>(() => OrderRepository(getIt<FirebaseOrderProvider>()));
  getIt.registerLazySingleton<FirebaseUnitRepository>(() => FirebaseUnitRepository(getIt<FirebaseUnitProvider>()));
  getIt.registerLazySingleton<FavoritesRepository>(() => FavoritesRepository(getIt<FirebaseFavoritesProvider>()));
  getIt.registerLazySingleton<SimplePayRepository>(() => SimplePayRepository(getIt<FirebaseSimplepayProvider>()));

  // Affiliate repository + provider
  getIt.registerLazySingleton<AffiliateFirebaseProvider>(() => AffiliateFirebaseProvider(getIt<DatabaseReference>()));
  getIt.registerLazySingleton<AffiliateRepository>(() => AffiliateRepository(getIt<AffiliateFirebaseProvider>()));

  // Repostories
  getIt.registerLazySingleton<AuthRepository>(() => AuthRepository(getIt<FirebaseAuthProvider>()));
  getIt.registerLazySingleton<OrderNotificationService>(() => OrderNotificationService());
  getIt.registerLazySingleton<LocationRepository>(() => LocationRepository());
  getIt.registerLazySingleton<FaceRepository>(() => FaceRepository());
  getIt.registerLazySingleton<CartRepository>(() => CartRepository(getIt<FirebaseCartProvider>()));
  getIt.registerLazySingleton<StripePaymentRepository>(
      () => StripePaymentRepository(getIt<GraphQLStripePaymentProvider>()));

  // Blocs
  getIt.registerLazySingleton(() => AuthBloc(getIt<AuthRepository>()));
  getIt.registerLazySingleton(() => ExceptionBloc());
  getIt.registerLazySingleton(() => UnitSelectBloc());
  getIt.registerLazySingleton(() => UnitsBloc(getIt<FirebaseUnitRepository>(), getIt<LocationRepository>()));
  // TODO ide lehetne vajon registerLazySingleton?
  getIt.registerLazySingleton(() => ProductCategoriesBloc(getIt<UnitSelectBloc>(), getIt<ProductRepository>()));
  getIt.registerLazySingleton(() => FavoritesBloc(getIt<FavoritesRepository>()));
  getIt.registerLazySingleton(() => LocaleBloc());
  getIt.registerLazySingleton(() => LoginBloc(getIt<LoginRepository>()));
  getIt.registerLazySingleton(() => SimplePayBloc(getIt<SimplePayRepository>()));
  getIt.registerLazySingleton(() => ThemeBloc(getIt<UnitSelectBloc>()));
  getIt.registerLazySingleton(() => CartBloc(getIt<CartRepository>()));
  getIt.registerLazySingleton(() => FaceDetectionBloc(getIt<FaceRepository>()));
  getIt.registerLazySingleton<NetworkStatusBloc>(() => NetworkStatusBloc());
  getIt.registerLazySingleton(() => PaymentBloc(getIt<OrderRepository>()));
  getIt.registerLazySingleton(() => AffiliateBloc(getIt<AffiliateRepository>()));
  getIt.registerLazySingleton<StripePaymentBloc>(() => StripePaymentBloc(getIt<StripePaymentRepository>()));
}
