import 'package:fa_prev/core/dependency_indjection/dependency_injection.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/shared/nav.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';

import 'modal_top_widget.dart';

showErrorDialog(
  BuildContext context,
  String error,
  String description, {
  String? exceptionDetails,
  Color? buttonColor,
  VoidCallback? onClose,
}) {
  final ThemeChainData theme = getIt<ThemeBloc>().state.theme;

  SchedulerBinding.instance.addPostFrameCallback((_) {
    showModalBottomSheet(
      context: context,
      isDismissible: true,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(16.0),
          topRight: Radius.circular(16.0),
        ),
      ),
      enableDrag: true,
      isScrollControlled: true,
      elevation: 4.0,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.only(
              topLeft: Radius.circular(16.0),
              topRight: Radius.circular(16.0),
            ),
            color: theme.secondary0,
          ),
          height: MediaQuery.of(context).size.height * .9,
          child: Column(
            children: [
              ModalTopWidget(),
              Expanded(
                child: CommonErrorWidget(
                  error: error,
                  description: description,
                  errorDetails: exceptionDetails,
                  buttonColor: buttonColor,
                  onPressed: onClose == null
                      ? () => Nav.pop()
                      : () {
                          Nav.pop();
                          onClose();
                        },
                ),
              ),
            ],
          ),
        );
      },
    );
  });
}
