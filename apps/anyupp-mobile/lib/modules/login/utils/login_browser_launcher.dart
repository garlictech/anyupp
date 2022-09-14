import '/app-config.dart';
import '/core/core.dart';
import '/modules/login/login.dart';
import '/modules/login/utils/browser_ext.dart';
import 'package:flutter/material.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';

String? lastProvider;

final ChromeSafariBrowser browser = ChromeSafariBrowserExt(
  whenClosed: () => getIt<LoginBloc>().add(ResetLogin()),
);

void reLaunchURL() async {
  log.d('reLaunchURL()');
  if (lastProvider != null) {
    launchURL(lastProvider!);
  }
}

void launchURL(String provider) async {
  getIt<LoginBloc>().add(StartLoginLoading());
  lastProvider = provider;
  var url = '${AppConfig.UserPoolDomain}/oauth2/authorize?'
      'identity_provider=${provider}&'
      'redirect_uri=${LoginScreen.SIGNIN_CALLBACK}&'
      'response_type=CODE&'
      'client_id=${AppConfig.UserPoolClientId}'
      '&scope=email+openid+profile+phone+aws.cognito.signin.user.admin';
  log.d('launchURL().url=$url');

  if (browser.isOpened()) {
    await browser.close();
  }

  // browser = MyChromeSafariBrowser();
  try {
    log.d('launchURL().start opening().');
    await browser.open(
      url: Uri.parse(url),
      options: ChromeSafariBrowserClassOptions(
        android: AndroidChromeCustomTabsOptions(
          // addDefaultShareMenuItem: false,
          shareState: CustomTabsShareState.SHARE_STATE_OFF,
          showTitle: false,
          // instantAppsEnabled: false,
          // packageName: 'net.cyberg.anyup',
          toolbarBackgroundColor: const Color(0xff30bf60),
          enableUrlBarHiding: true,
          keepAliveEnabled: true,
        ),
        ios: IOSSafariOptions(
          barCollapsingEnabled: true,
          // presentationStyle: IOSUIModalPresentationStyle.FULL_SCREEN,
        ),
      ),
    );
  } catch (e) {
    log.e('launchURL().error=$e');

    // An exception is thrown if browser app is not installed on Android device.
    debugPrint(e.toString());
  }
}
