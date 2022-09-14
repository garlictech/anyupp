import '/core/core.dart';
import '/modules/login/login.dart';
import '/shared/locale.dart';
import '/shared/nav.dart';
import '/shared/widgets/platform_alert_dialog.dart';
import 'package:flutter/material.dart';

showConfirmLogoutDialog(BuildContext context,
    [bool shouldPopNavigation = true]) {
  // show the dialog
  showDialog(
    context: context,
    builder: (BuildContext context) {
      return PlatformAlertDialog(
          title: transEx(context, 'logout.title'),
          description: transEx(context, 'logout.description'),
          cancelButtonText: transEx(context, 'logout.cancel'),
          okButtonText: transEx(context, 'logout.confirm'),
          onOkPressed: () async {
            if (shouldPopNavigation) {
              Nav.pop();
            }
            getIt<LoginBloc>().add(Logout());
          },
          onCancelPressed: () {
            Navigator.pop(context);
          });
    },
  );
}
