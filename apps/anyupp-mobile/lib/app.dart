import 'dart:async';

import 'package:catcher/catcher.dart';
import 'package:fa_prev/core/units/bloc/unit_select_bloc.dart';
import 'package:fa_prev/core/units/bloc/units_bloc.dart';
import 'package:firebase_dynamic_links/firebase_dynamic_links.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:uni_links/uni_links.dart';

// import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/modules/login/login.dart';
import 'package:fa_prev/shared/affiliate.dart';
import 'package:fa_prev/shared/auth.dart';
import 'package:fa_prev/shared/connectivity.dart';
import 'package:fa_prev/shared/exception.dart';
import 'package:fa_prev/shared/face.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/widgets.dart';

import 'core/dependency_indjection/dependency_injection.dart';
import 'core/exception/exception.dart';
// import 'core/simple_bloc_delegate.dart';
import 'core/theme/theme.dart';
// import 'core/units/units.dart';
import 'modules/cart/cart.dart';
import 'modules/favorites/favorites.dart';
import 'modules/payment/simplepay/simplepay.dart';
import 'modules/payment/stripe/stripe.dart';
import 'modules/screens.dart';
import 'shared/utils/deeplink_utils.dart';

void runAppByStage({String stage = 'dev'}) {
  runZoned(() async {
    print('main().stage=$stage');
    await DotEnv().load('env/.env.$stage');
    initDependencyInjection();
    // BlocSupervisor.delegate = SimpleBlocDelegate();
    // WidgetsFlutterBinding.ensureInitialized();
    configureCatcherAndRunZonedApp(MyApp());
    // runApp(MyApp());
  }, onError: (error, stackTrace) {
    Catcher.reportCheckedError(error, stackTrace);
  });
}

class MyApp extends StatefulWidget {
  @override
  _MyAppState createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> with WidgetsBindingObserver {
  StreamSubscription _deeplinkSubscription;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _initDeepLinks();
  }

  @override
  void dispose() {
    if (_deeplinkSubscription != null) {
      _deeplinkSubscription.cancel();
    }
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) async {
    print('didChangeAppLifecycleState()=$state');
    if (state == AppLifecycleState.resumed) {
      final PendingDynamicLinkData data = await FirebaseDynamicLinks.instance.getInitialLink();
      print('didChangeAppLifecycleState().PendingDynamicLinkData=$data');
      if (data?.link != null) {
        handleLink(data?.link);
      }
      FirebaseDynamicLinks.instance.onLink(onSuccess: (PendingDynamicLinkData dynamicLink) async {
        final Uri deepLink = dynamicLink?.link;
        print('didChangeAppLifecycleState().onLink.deepLink=$deepLink');
        handleLink(deepLink);
      }, onError: (OnLinkErrorException e) async {
        print('onLinkError');
        print(e.message);
      });
    }
  }

  void handleLink(Uri link) async {
    print('handleLink()=$link');
     _handleEmailLoginLink(link);
  }

  Future<void> _initDeepLinks() async {
    try {
      Uri uri = await getInitialUri();
      print('_initDeepLinks().uri=$uri');

      _handleEmailLoginLink(uri);

      if (isValidUrl(uri)) {
        handleUrl(uri);
      }
    } on Exception catch (e) {
      print('***** _initDeepLinks().exception=$e');
    }

    // try to listen
    _deeplinkSubscription = getUriLinksStream().listen((Uri uri) {
      print('_initDeepLinks().stream().uri=$uri');
      _handleEmailLoginLink(uri);

      if (isValidUrl(uri)) {
        handleUrl(uri);
      }
    }, onError: (e) {
      // Handle exception by warning the user their action did not succeed
      print('***** _initDeepLinks().stream().exception=$e');
      showErrorDialog(context, 'DEEPLINK_ERROR', e.toString());
    });
  }

  Future<void> _handleEmailLoginLink(Uri uri) async {
    String emailLink = uri.toString();
    print('_initDeepLinks().emailLink=$emailLink');
    bool isSignInWithEmailLink = await getIt<LoginRepository>().isSignInWithEmailLink(emailLink);
    print('_initDeepLinks().isSignInWithEmailLink=$isSignInWithEmailLink');
    if (isSignInWithEmailLink) {
      getIt<LoginBloc>().add(FinishLoginWithEmailLink(emailLink));
    }
  }

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(create: (BuildContext context) => getIt<AuthBloc>()),
        BlocProvider(create: (BuildContext context) => getIt<LocaleBloc>()),
        BlocProvider(create: (BuildContext context) => getIt<ExceptionBloc>()),
        BlocProvider(create: (BuildContext context) => getIt<PaymentBloc>()),
        BlocProvider(create: (BuildContext context) => getIt<StripePaymentBloc>()),
        BlocProvider(create: (BuildContext context) => getIt<CartBloc>()),
        BlocProvider(create: (BuildContext context) => getIt<NetworkStatusBloc>()),
        BlocProvider<UnitsBloc>(create: (context) => getIt<UnitsBloc>()),
        BlocProvider<UnitSelectBloc>(create: (context) => getIt<UnitSelectBloc>()),
        BlocProvider<FavoritesBloc>(create: (context) => getIt<FavoritesBloc>()),
        BlocProvider<LoginBloc>(create: (BuildContext context) => getIt<LoginBloc>()),
        BlocProvider<SimplePayBloc>(create: (BuildContext context) => getIt<SimplePayBloc>()),
        BlocProvider<FaceDetectionBloc>(create: (BuildContext context) => getIt<FaceDetectionBloc>()),
        BlocProvider<ThemeBloc>(create: (BuildContext context) => getIt<ThemeBloc>()),
        BlocProvider<AffiliateBloc>(create: (BuildContext context) => getIt<AffiliateBloc>()),
      ],
      child: BlocBuilder<LocaleBloc, LocaleState>(
        builder: (context, LocaleState localeState) {
          var locale = (localeState is LocaleSelected) ? localeState.locale : null;
          return MaterialApp(
            title: 'AnyUpp',

            /// Catcher init STEP 3. Add navigator key from Catcher. It will be used to navigate user to report page or to show dialog.
            navigatorKey: Catcher.navigatorKey,
            // Default theme settings TODO: do we need these?
            theme: ThemeData(
                visualDensity: VisualDensity.adaptivePlatformDensity,
                indicatorColor: Colors.black,
                primarySwatch: Colors.red,
                primaryColor: Colors.black,
                accentColor: Colors.white,
                buttonColor: Colors.black,
                hoverColor: Color(0xFFFFDB87),
                highlightColor: Colors.white,
                primaryColorLight: Color(0xFFFFDB87),
                backgroundColor: Color(0xFFFFDB87),
                bottomAppBarColor: Color(0xFF176E49)),

            builder: (context, child) {
              return MediaQuery(
                child: child,
                data: MediaQuery.of(context).copyWith(textScaleFactor: 1.0),
              );
            },

            // The first app page
            home: OnBoarding(),

            // To hide the debug mark (in debugging and development modes)
            debugShowCheckedModeBanner: false,

            //
            // Localization >>>
            //
            locale: locale,
            localizationsDelegates: [
              GlobalMaterialLocalizations.delegate,
              GlobalWidgetsLocalizations.delegate,
              AppLocalizations.delegate,
            ],
            supportedLocales: SupportedLocales.locales,
            localeListResolutionCallback: (List<Locale> userPreferredlocales, Iterable<Locale> appSupportedLocales) {
              // userPreferredlocales: comes from the phone settings in the same order
              // appSupportedLocales: comes from the supportedLocales parameter what was defined up ahead

              // Try to find a userPreferred Local what is supported by the APP
              for (Locale locale in userPreferredlocales) {
                for (Locale supportedLocale in appSupportedLocales) {
                  if (supportedLocale.languageCode == locale.languageCode &&
                      supportedLocale.countryCode == locale.countryCode) {
                    // Return the first userPreferred Local what is supported by the APP
                    return supportedLocale;
                  }
                }
              }

              // OR return the first if there isn't any supported local in the user's locale list
              return appSupportedLocales.first;
            },
          );
        },
      ),
    );
  }
}
