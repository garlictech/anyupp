import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'phone_dialog_content_widget.dart';

import 'phone_dialog_content_widget.dart';

class LoginWithPhoneDialog {
  static void show(BuildContext context, {bool linkAccount = false}) {
    SchedulerBinding.instance.addPostFrameCallback((_) {
      return showDialog(
        context: context,
        barrierDismissible: true,
        builder: (BuildContext context) => Dialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12.0),
          ),
          elevation: 4.0,
          backgroundColor: Color(0xFFFFFFFF),
          child: PhoneDialogContentWidget(linkAccount: linkAccount),
        ),
      );
    });
  }
}
