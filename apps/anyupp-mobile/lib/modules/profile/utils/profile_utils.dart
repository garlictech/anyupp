import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher_string.dart';

import '../../../shared/locale.dart';
import '../../../shared/nav.dart';
import '../../../shared/widgets/platform_alert_dialog.dart';
import '/models.dart';

String getFormattedAnonymousEmail(String? email) {
  if (email == null) {
    return '';
  }
  if (email.startsWith('anonymuser')) {
    return 'anonymuser' + email.substring(email.indexOf('@'));
  }
  return email;
}

String getNameLetters(User user) {
  if (user.name != null) {
    return user.name!.split(' ').fold(
          '',
          (prev, element) => prev += element.substring(0, 1).toUpperCase(),
        );
  }
  return 'A';
}

void openMapsDialog(BuildContext context, Location location) {
  showDialog(
    context: context,
    builder: (BuildContext context) {
      return PlatformAlertDialog(
          description: transEx(context, 'unitinfo.chooseMaps'),
          okButtonText: transEx(context, 'unitinfo.googleMaps'),
          noButtonText: transEx(context, 'unitinfo.appleMaps'),
          cancelButtonText: transEx(context, 'common.cancel'),
          onOkPressed: () {
            launchUrlString('https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}');
            Nav.pop();
          },
          onNoPressed: () {
            launchUrlString('https://maps.apple.com/?q=${location.lat},${location.lng}');
            Nav.pop();
          },
          onCancelPressed: () {
            Nav.pop();
          });
    },
  );
}
