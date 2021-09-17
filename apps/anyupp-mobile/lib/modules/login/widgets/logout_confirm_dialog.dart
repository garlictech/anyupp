import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/modules/login/login.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:flutter/material.dart';
import 'package:fa_prev/shared/nav.dart';

showConfirmLogoutDialog(BuildContext context, [bool shouldPopNavigation = true]) {
  // show the dialog
  showDialog(
    context: context,
    builder: (BuildContext context) {
      return AlertDialog(
        title: Text(transEx(context, 'logout.title')),
        content: Text(transEx(context, 'logout.description')),
        actions: [
          TextButton(
            child: Text(transEx(context, 'logout.cancel')),
            onPressed: () {
              Navigator.pop(context);
            },
          ),
          TextButton(
            child: Text(transEx(context, 'logout.confirm')),
            onPressed: () async {
              if (shouldPopNavigation) {
                Nav.pop();
              }
              getIt<LoginBloc>().add(Logout());
            },
          ),
        ],
      );
    },
  );
}
