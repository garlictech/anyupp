import 'package:fa_prev/app-config.dart';
import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/modules/login/login.dart';
import 'package:fa_prev/modules/screens.dart';
import 'package:fa_prev/shared/auth.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/shared/nav.dart';
import 'package:flutter/material.dart';

class DeeplinkType {
  static const QR = 'QR';
  static const TRANSACTION_BACK = 'TRANSACTION_BACK';
  static const VERIFY_EMAIL = "VERIFY_EMAIL";
}

final regAlphaNumericSeatOrTable = RegExp(r'^[a-zA-Z0-9]{1,16}$');
final regTransactionId = RegExp(r'^[a-zA-Z0-9_-]{21}$'); // NanoId uuid

Future<bool> handleUrl(Uri uri) async {
  print('***** handleUrl()=$uri');
  switch (getDeeplinkType(uri)) {
    case DeeplinkType.QR:
      return await handleUrlQR(uri);
    case DeeplinkType.VERIFY_EMAIL:
      return await handleVerifyEmail(uri);
    default:
      return false;
  }
}

bool isValidUrl(Uri? uri) {
  print('***** isValidUrl().uri=$uri');
  if (uri == null) {
    return false;
  }

  return uri.scheme == 'https' && uri.port == 443;
}

String? getDeeplinkType(Uri uri) {
  if (!isValidUrl(uri)) {
    return null;
  }
  if (isValidQRUrl(uri)) {
    return DeeplinkType.QR;
  } else if (isValidTransactionBackUrl(uri)) {
    return DeeplinkType.TRANSACTION_BACK;
  } else if (isValidConfirmationUrl(uri)) {
    return DeeplinkType.VERIFY_EMAIL;
  }
  return null;
}

// *************************
// QR deeplink
Future<bool> handleUrlQR(Uri uri) async {
  final Widget? page = getNavigationPageByUrlFromQRDeeplink(uri);
  if (page == null) {
    return false;
  }

  AuthRepository auth = getIt<AuthRepository>();

  // --- check authentication
  User? user = await auth.getAuthenticatedUserProfile();

  // Not authenticated
  if (user == null) {
    auth.nextPageAfterLogin = page;
    await Future.delayed(Duration(seconds: 3));
    print('***** handleUrlQR().login()');

    Nav.reset(OnBoarding());

    return true;
  } else {
    await Future.delayed(Duration(seconds: 3));
    print('***** handleUrlQR().qrfound()');
    Nav.reset(page);
    // navigateWithResetWithKey(Catcher.navigatorKey, (_, __, ___) => page);
    return true;
  }
}

bool isValidQRUrl(Uri uri) {
  return uri.pathSegments.length == 3 &&
      regAlphaNumericSeatOrTable.hasMatch(uri.pathSegments[1]) &&
      regAlphaNumericSeatOrTable.hasMatch(uri.pathSegments[2]) &&
      uri.origin.contains('anyupp.com');
}

Widget getNavigationPageByUrlFromQRDeeplink(Uri uri) {
  final unitId = uri.pathSegments[0];
  final table = uri.pathSegments[1];
  final seat = uri.pathSegments[2];
  final Place place = Place(table: table, seat: seat);
  print('***** getNavigationPageByUrlFromQRDeeplink().unitId=$unitId, table=$table, seat=$seat');
  return UnitFoundByQRCodeScreen(
    place: place,
    unitId: unitId,
  );
}

// *************************
// TRANSACTION_BACK deeplink

bool isValidTransactionBackUrl(Uri uri) {
  return uri.scheme == 'https' &&
      uri.pathSegments.length == 3 &&
      uri.pathSegments[0] == 'transaction' &&
      regTransactionId.hasMatch(uri.pathSegments[1]) &&
      uri.origin.contains('open.anyupp');
}

bool isValidConfirmationUrl(Uri uri) {
  return uri.origin.contains(AppConfig.UserPoolDomain);
}

String getTransactionIdFromTransactionBackUrl(Uri uri) {
  return uri.pathSegments[1];
}

Future<bool> handleVerifyEmail(Uri uri) async {
  Map<String, String?> params = uri.queryParameters;
  String? userName = params['user_name'];
  String? confirmationCode = params['confirmation_code'];
  if (userName != null && confirmationCode != null) {
    getIt<LoginBloc>().add(ConfirmRegistration(userName, confirmationCode));
    return true;
  }
  return false;
}
