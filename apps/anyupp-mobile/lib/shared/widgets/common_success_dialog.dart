import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/shared/nav.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';

showSuccessDialog({
  required BuildContext context,
  required String title,
  required String message,
  String? bigTitle,
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
            child: StatusWidget(
              icon: 'assets/icons/success_order.svg',
              bigTitle: bigTitle,
              message: title,
              description: message,
              expanded: true,
              buttonText: 'common.ok2',
              onPressed: () {
                if (onClose != null) {
                  onClose();
                }
                Nav.pop();
              },
            ),
          );
        });
  });
}
