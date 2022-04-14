import 'dart:io';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:fa_prev/core/theme/theme.dart';

import 'success_animation_widget.dart';

showSuccessDialog(BuildContext context, String title, String message,
    [VoidCallback? onClose]) {
  SchedulerBinding.instance?.addPostFrameCallback((_) {
    showDialog(
        context: context,
        barrierDismissible: true,
        builder: (context) {
          return Platform.isAndroid
              ? SimpleDialog(
                  children: <Widget>[
                    _getDialogContent(
                      context,
                      title,
                      message,
                    ),
                  ],
                )
              : CupertinoAlertDialog(
                  content: _getDialogContent(
                    context,
                    title,
                    message,
                  ),
                );
        }).then((value) => onClose != null ? onClose() : null);
  });
}

Widget _getDialogContent(BuildContext context, String title, String message) {
  return Padding(
    padding: EdgeInsets.fromLTRB(0.0, 20.0, 0.0, 20.0),
    child: Column(
      mainAxisSize: MainAxisSize.min,
      children: <Widget>[
        SizedBox(
          width: 64.0,
          height: 64.0,

          // Check mark animation
          child: SuccessAnimationWidget(),
        ),
        SizedBox(
          height: 32.0,
        ),
        Text(
          title,
          textAlign: TextAlign.center,
          style: Fonts.satoshi(
            fontSize: 16.0,
            fontWeight: FontWeight.w400,
            color: Colors.green,
          ),
        ),
        // Display message to the user
        Padding(
          padding: const EdgeInsets.only(
            top: 20.0,
            left: 4.0,
            right: 4.0,
          ),
          child: Text(
            message,
            textAlign: TextAlign.center,
            style: TextStyle(
              color: Colors.black,
              fontSize: 15.0,
              fontWeight: FontWeight.w500,
            ),
          ),
        )
      ],
    ),
  );
}
