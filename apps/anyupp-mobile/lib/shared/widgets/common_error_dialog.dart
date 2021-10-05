import 'package:fa_prev/core/dependency_indjection/dependency_injection.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';

import 'package:fa_prev/shared/nav.dart';
import 'common_error_widget.dart';

showErrorDialog(BuildContext context, String error, String description,
    {String? exceptionDetails, VoidCallback? onClose}) {
  final ThemeChainData theme = getIt<ThemeBloc>().state.theme;

  SchedulerBinding.instance?.addPostFrameCallback((_) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) => Dialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12.0),
        ),
        elevation: 0.0,
        backgroundColor: theme.secondary0,
        child: Container(
          padding: EdgeInsets.all(8.0),
          height: 480.0,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: EdgeInsets.only(top: 12.0),
                child: CommonErrorWidget(
                  error: error,
                  description: description,
                  errorDetails: exceptionDetails,
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
                    color: theme.secondary16,
                  ),
                ),
                child: TextButton(
                  style: TextButton.styleFrom(
                    backgroundColor: Colors.transparent,
                    padding: EdgeInsets.all(8.0),
                  ),
                  onPressed: onClose == null
                      ? () => Nav.pop()
                      : () {
                          Nav.pop();
                          onClose();
                        },
                  child: Text(
                    transEx(context, 'common.close'),
                    style: Fonts.satoshi(
                      fontSize: 14.0,
                      color: theme.secondary,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  });
}
