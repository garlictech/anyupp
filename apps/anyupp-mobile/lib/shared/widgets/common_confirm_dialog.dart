import 'package:fa_prev/core/dependency_indjection/dependency_injection.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:google_fonts/google_fonts.dart';

import 'package:fa_prev/shared/nav.dart';
import 'common_error_widget.dart';

Future showConfirmDialog(
  BuildContext context, {
  String title,
  String message,
  String cancelText,
  String confirmText,
  VoidCallback onCancel,
  VoidCallback onConfirm,
}) async {
  final ThemeChainData theme = getIt<ThemeBloc>().state.theme;

  SchedulerBinding.instance.addPostFrameCallback((_) {
    return showDialog(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) => Dialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12.0),
        ),
        elevation: 0.0,
        backgroundColor: theme.background,
        child: Container(
          padding: EdgeInsets.all(8.0),
          height: 480.0,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: EdgeInsets.only(top: 12.0),
                child: CommonErrorWidget(
                  error: title,
                  description: message,
                ),
              ),
              Container(
                //height: 57.0,
                padding: EdgeInsets.all(8.0),
                width: double.infinity,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.all(Radius.zero),
                  border: Border.all(
                    width: 1.5,
                    color: theme.border,
                  ),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    FlatButton(
                      color: Colors.transparent,
                      padding: EdgeInsets.all(8.0),
                      splashColor: theme.indicator,
                      onPressed: onCancel == null
                          ? () => Nav.pop()
                          : () {
                              Nav.pop();
                              onCancel();
                            },
                      child: Text(
                        cancelText,
                        style: GoogleFonts.poppins(
                          fontSize: 14.0,
                          color: theme.text,
                        ),
                      ),
                    ),
                    FlatButton(
                      color: Colors.transparent,
                      padding: EdgeInsets.all(8.0),
                      splashColor: theme.indicator,
                      onPressed: onConfirm == null
                          ? () => Nav.pop()
                          : () {
                              Nav.pop();
                              onConfirm();
                            },
                      child: Text(
                        confirmText,
                        style: GoogleFonts.poppins(
                          fontSize: 14.0,
                          color: theme.text,
                        ),
                      ),
                    )
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  });
}
