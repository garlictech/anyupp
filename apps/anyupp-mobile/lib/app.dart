import 'dart:async';
import 'dart:io';

import 'package:app_tracking_transparency/app_tracking_transparency.dart';
import 'package:catcher/catcher.dart';
import 'package:fa_prev/app-config.dart';
import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/modules/login/login.dart';
import 'package:fa_prev/modules/menu/menu.dart';
import 'package:fa_prev/modules/takeaway/takeaway.dart';
import 'package:fa_prev/shared/auth.dart';
import 'package:fa_prev/shared/connectivity.dart';
import 'package:fa_prev/shared/exception.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/user-details/user_details.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:in_app_update/in_app_update.dart';
import 'package:uni_links2/uni_links.dart';
import 'package:upgrader/upgrader.dart';

import 'core/dependency_indjection/dependency_injection.dart';
import 'core/theme/theme.dart';
import 'modules/cart/cart.dart';
import 'modules/favorites/favorites.dart';
import 'modules/main/main.dart';
import 'modules/orders/orders.dart';
import 'modules/payment/stripe/stripe.dart';
import 'modules/screens.dart';
import 'modules/transactions/bloc/transactions_bloc.dart';
import 'shared/utils/deeplink_utils.dart';

class MyApp extends StatefulWidget {
  @override
  _MyAppState createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  late StreamSubscription? _deeplinkSubscription;
  late bool isProd;

  @override
  void initState() {
    isProd = AppConfig.Stage == "prod"; // Ez igy ok! Nem kell az isDev
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
      _deeplinkSubscription!.cancel();
    }
    super.dispose();
  }

  Future<void> _initDeepLinks() async {
    try {
      Uri? uri = await getInitialUri();
      print('_initDeepLinks().uri=$uri');

      if (isValidUrl(uri)) {
        await handleUrl(uri!);
      }
    } on Exception catch (e) {
      print('***** _initDeepLinks().exception=$e');
    }

    _deeplinkSubscription = linkStream.listen((String? link) async {
      try {
        Uri? uri = await getInitialUri();
        print('_initDeepLinks().uri=$uri');

        if (isValidUrl(uri)) {
          await handleUrl(uri!);
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
      if (appUpdateInfo.updateAvailability ==
          UpdateAvailability.updateAvailable) {
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
        BlocProvider(create: (BuildContext context) => getIt<OrderBloc>()),
        BlocProvider(
            create: (BuildContext context) => getIt<OrderRefreshBloc>()),
        BlocProvider(
            create: (BuildContext context) => getIt<OrderHistoryBloc>()),
        BlocProvider(
            create: (BuildContext context) => getIt<OrderCounterBloc>()),
        BlocProvider(
            create: (BuildContext context) => getIt<StripePaymentBloc>()),
        BlocProvider(create: (BuildContext context) => getIt<CartBloc>()),
        BlocProvider(
            create: (BuildContext context) => getIt<NetworkStatusBloc>()),
        BlocProvider<UnitsBloc>(create: (context) => getIt<UnitsBloc>()),
        BlocProvider<UnitSelectBloc>(
            create: (context) => getIt<UnitSelectBloc>()),
        BlocProvider<FavoritesBloc>(
            create: (context) => getIt<FavoritesBloc>()),
        BlocProvider<TransactionsBloc>(
            create: (context) => getIt<TransactionsBloc>()),
        BlocProvider<LoginBloc>(
            create: (BuildContext context) => getIt<LoginBloc>()),
        BlocProvider<ThemeBloc>(
            create: (BuildContext context) => getIt<ThemeBloc>()),
        BlocProvider<MainNavigationBloc>(
            create: (BuildContext context) => getIt<MainNavigationBloc>()),
        BlocProvider<ConfigsetBloc>(
            create: (BuildContext context) => getIt<ConfigsetBloc>()),
        BlocProvider<UserDetailsBloc>(
            create: (BuildContext context) => getIt<UserDetailsBloc>()),
        BlocProvider<TakeAwayBloc>(
            create: (BuildContext context) => getIt<TakeAwayBloc>()),
      ],
      child: BlocBuilder<LocaleBloc, LocaleState>(
        builder: (context, LocaleState localeState) {
          var locale =
              (localeState is LocaleSelected) ? localeState.locale : null;

          return MaterialApp(
            themeMode: ThemeMode.light,
            title: 'AnyUpp',
            key: const Key('anyupp-main-app'),

            /// Catcher init STEP 3. Add navigator key from Catcher. It will be used to navigate user to report page or to show dialog.
            navigatorKey: Catcher.navigatorKey,
            theme: ThemeData(
              primaryColor: Colors.green,
            ),

            builder: (context, child) {
              return MediaQuery(
                child: child ?? Container(),
                data: MediaQuery.of(context).copyWith(textScaleFactor: 1.0),
              );
            },

            // The first app page
            home: isProd
                ? UpgradeAlert(
                    showIgnore: false, showLater: false, child: OnBoarding())
                : OnBoarding(),

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
            localeListResolutionCallback: (List<Locale>? userPreferredlocales,
                Iterable<Locale> appSupportedLocales) {
              // userPreferredlocales: comes from the phone settings in the same order
              // appSupportedLocales: comes from the supportedLocales parameter what was defined up ahead

              // Try to find a userPreferred Local what is supported by the APP
              if (userPreferredlocales != null) {
                for (Locale locale in userPreferredlocales) {
                  for (Locale supportedLocale in appSupportedLocales) {
                    if (supportedLocale.languageCode == locale.languageCode &&
                        supportedLocale.countryCode == locale.countryCode) {
                      // Return the first userPreferred Local what is supported by the APP
                      return supportedLocale;
                    }
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
