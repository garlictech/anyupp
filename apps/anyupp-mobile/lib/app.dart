import 'dart:async';

import 'dart:io';

import 'package:catcher/catcher.dart';
import 'package:fa_prev/app-config.dart';
import 'package:fa_prev/core/units/bloc/unit_select_bloc.dart';
import 'package:fa_prev/core/units/bloc/units_bloc.dart';
import 'package:fa_prev/modules/menu/menu.dart';
import 'package:fa_prev/shared/user-details/user_details.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:in_app_update/in_app_update.dart';
import 'package:fa_prev/modules/login/login.dart';
import 'package:fa_prev/shared/affiliate.dart';
import 'package:fa_prev/shared/auth.dart';
import 'package:fa_prev/shared/connectivity.dart';
import 'package:fa_prev/shared/exception.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:uni_links2/uni_links.dart';
import 'package:upgrader/upgrader.dart';

import 'core/dependency_indjection/dependency_injection.dart';
import 'core/theme/theme.dart';
import 'modules/cart/cart.dart';
import 'modules/favorites/favorites.dart';
import 'modules/main/main.dart';
import 'modules/orders/orders.dart';
import 'modules/payment/simplepay/simplepay.dart';
import 'modules/payment/stripe/stripe.dart';
import 'modules/screens.dart';
import 'modules/transactions/bloc/transactions_bloc.dart';
import 'shared/utils/deeplink_utils.dart';
import 'package:app_tracking_transparency/app_tracking_transparency.dart';

class MyApp extends StatefulWidget {
  @override
  _MyAppState createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  StreamSubscription _deeplinkSubscription;
  bool isProd;

  @override
  void initState() {
    isProd = AppConfig.Stage == "prod";
    super.initState();
    init();
  }

  Future<void> init() async {
    await _initDeepLinks();
    if (Platform.isAndroid && isProd) {
      await checkForAndroidUpdates();
    }
    final status = await AppTrackingTransparency.requestTrackingAuthorization();
    print('checkTrackingTransparencyPermission().status=$status');
  }

  @override
  void dispose() {
    if (_deeplinkSubscription != null) {
      _deeplinkSubscription.cancel();
    }
    super.dispose();
  }

  Future<void> _initDeepLinks() async {
    try {
      Uri uri = await getInitialUri();
      print('_initDeepLinks().uri=$uri');

      if (isValidUrl(uri)) {
        await handleUrl(uri);
      }
    } on Exception catch (e) {
      print('***** _initDeepLinks().exception=$e');
    }

    _deeplinkSubscription = linkStream.listen((String link) async {
      try {
        Uri uri = await getInitialUri();
        print('_initDeepLinks().uri=$uri');

        if (isValidUrl(uri)) {
          await handleUrl(uri);
        }
      } on Exception catch (e) {
        print('***** _initDeepLinks().exception=$e');
      }
    }, onError: (err) {
      // Handle exception by warning the user their action did not succeed
      print('***** _initDeepLinks().error=$err');
    });
  }

  Future<void> checkForAndroidUpdates() async {
    try {
      AppUpdateInfo appUpdateInfo = await InAppUpdate.checkForUpdate();
      if (appUpdateInfo.updateAvailability == UpdateAvailability.updateAvailable) {
        await InAppUpdate.performImmediateUpdate();
      }
    } catch (e) {
      print('checkForAndroidUpdates.error=$e');
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
        BlocProvider(create: (BuildContext context) => getIt<OrderBloc>()),
        BlocProvider(create: (BuildContext context) => getIt<OrderHistoryBloc>()),
        BlocProvider(create: (BuildContext context) => getIt<OrderCounterBloc>()),
        BlocProvider(create: (BuildContext context) => getIt<StripePaymentBloc>()),
        BlocProvider(create: (BuildContext context) => getIt<CartBloc>()),
        BlocProvider(create: (BuildContext context) => getIt<NetworkStatusBloc>()),
        BlocProvider<UnitsBloc>(create: (context) => getIt<UnitsBloc>()),
        BlocProvider<UnitSelectBloc>(create: (context) => getIt<UnitSelectBloc>()),
        BlocProvider<FavoritesBloc>(create: (context) => getIt<FavoritesBloc>()),
        BlocProvider<TransactionsBloc>(create: (context) => getIt<TransactionsBloc>()),
        BlocProvider<LoginBloc>(create: (BuildContext context) => getIt<LoginBloc>()),
        BlocProvider<SimplePayBloc>(create: (BuildContext context) => getIt<SimplePayBloc>()),
        BlocProvider<ThemeBloc>(create: (BuildContext context) => getIt<ThemeBloc>()),
        BlocProvider<AffiliateBloc>(create: (BuildContext context) => getIt<AffiliateBloc>()),
        BlocProvider<MainNavigationBloc>(create: (BuildContext context) => getIt<MainNavigationBloc>()),
        BlocProvider<ConfigsetBloc>(create: (BuildContext context) => getIt<ConfigsetBloc>()),
        BlocProvider<UserDetailsBloc>(create: (BuildContext context) => getIt<UserDetailsBloc>()),
      ],
      child: BlocBuilder<LocaleBloc, LocaleState>(
        builder: (context, LocaleState localeState) {
          var locale = (localeState is LocaleSelected) ? localeState.locale : null;
          return BlocBuilder<ThemeBloc, ThemeState>(
            builder: (context, state) {
              ThemeData themeData;
              if (state is ThemeState) {
                themeData = state.theme.getThemeData();
              } else {
                themeData = ThemeData(
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
                    bottomAppBarColor: Color(0xFF176E49));
              }

              return MaterialApp(
                title: 'AnyUpp',
                key: const Key('anyupp-main-app'),

                /// Catcher init STEP 3. Add navigator key from Catcher. It will be used to navigate user to report page or to show dialog.
                navigatorKey: Catcher.navigatorKey,
                theme: themeData,

                builder: (context, child) {
                  return MediaQuery(
                    child: child,
                    data: MediaQuery.of(context).copyWith(textScaleFactor: 1.0),
                  );
                },

                // The first app page
                home: isProd ? UpgradeAlert(showIgnore: false, showLater: false, child: OnBoarding()) : OnBoarding(),

                // To hide the debug mark (in debugging and development modes)
                debugShowCheckedModeBanner: false,

                //
                // Localization >>>
                //
                locale: locale,
                localizationsDelegates: [
                  GlobalMaterialLocalizations.delegate,
                  GlobalWidgetsLocalizations.delegate,
                  GlobalCupertinoLocalizations.delegate,
                  AppLocalizations.delegate,
                  //const FallbackCupertinoLocalisationsDelegate(),
                ],
                supportedLocales: SupportedLocales.locales,
                localeListResolutionCallback:
                    (List<Locale> userPreferredlocales, Iterable<Locale> appSupportedLocales) {
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
          );
        },
      ),
    );
  }
}
