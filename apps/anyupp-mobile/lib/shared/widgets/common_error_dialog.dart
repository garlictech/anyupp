import 'package:fa_prev/core/dependency_indjection/dependency_injection.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/shared/nav.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';

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
          child: Container(
            padding: EdgeInsets.only(top: 12.0),
            child: CommonErrorWidget(
              error: error,
              description: description,
              errorDetails: exceptionDetails,
              onPressed: onClose == null
                  ? () => Nav.pop()
                  : () {
                      Nav.pop();
                      onClose();
                    },
            ),
          ),
        ),
      ),
    );
  });
}
