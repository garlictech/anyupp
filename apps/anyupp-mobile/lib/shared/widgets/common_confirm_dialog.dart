import '/core/dependency_indjection/dependency_injection.dart';
import '/core/theme/theme.dart';
import '/shared/nav.dart';
import '/shared/widgets.dart';
import 'package:flutter/material.dart';

Future showConfirmDialog(
  BuildContext context, {
  required String title,
  required String message,
  required String cancelText,
  required String confirmText,
  VoidCallback? onCancel,
  VoidCallback? onConfirm,
  Widget? child,
}) async {
  final ThemeChainData theme = getIt<ThemeBloc>().state.theme;

  return showDialog(
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
              child: child ??
                  StatusWidget(
                    message: title,
                    description: message,
                    icon: 'assets/icons/success_order.svg',
                    buttonText: 'common.ok2',
                    showButton: false,
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
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  TextButton(
                    style: TextButton.styleFrom(
                      backgroundColor: Colors.transparent,
                      padding: EdgeInsets.all(8.0),
                    ),
                    onPressed: onCancel == null
                        ? () => Nav.pop()
                        : () {
                            Nav.pop();
                            onCancel();
                          },
                    child: Text(
                      cancelText,
                      style: Fonts.satoshi(
                        fontSize: 14.0,
                        color: theme.secondary,
                      ),
                    ),
                  ),
                  TextButton(
                    style: TextButton.styleFrom(
                      backgroundColor: Colors.transparent,
                      padding: EdgeInsets.all(8.0),
                    ),
                    onPressed: onConfirm == null
                        ? () => Nav.pop()
                        : () {
                            Nav.pop();
                            onConfirm();
                          },
                    child: Text(
                      confirmText,
                      style: Fonts.satoshi(
                        fontSize: 14.0,
                        color: theme.secondary,
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
}
