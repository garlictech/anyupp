import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/modules/login/login.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/nav.dart';
import 'package:fa_prev/shared/widgets/platform_alert_dialog.dart';
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
