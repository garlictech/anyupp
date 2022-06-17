import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'email_login_password_or_link_widget.dart';

class LoginWithEmailDialog {
  static void show(BuildContext context, {bool linkAccount = false}) {
    SchedulerBinding.instance.addPostFrameCallback((_) async {
      await showDialog(
        context: context,
        barrierDismissible: true,
        builder: (BuildContext context) => Dialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12.0),
          ),
          elevation: 4.0,
          backgroundColor: Color(0xFFFFFFFF),
          child: EmailLoginDialogContentWidget(),
        ),
      );
    });
  }
}
