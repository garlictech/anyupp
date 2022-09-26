import 'dart:io';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import '../../core/dependency_indjection/dependency_injection.dart';
import '../../core/theme/bloc/theme_bloc.dart';
import '../../core/theme/font/font.dart';
import '../../core/theme/model/theme_chain_data.dart';

class PlatformAlertDialog extends StatelessWidget {
  final String? title;
  final String description;
  final String cancelButtonText;
  final String okButtonText;
  final String? noButtonText;
  final Function onCancelPressed;
  final Function onOkPressed;
  final Function? onNoPressed;

  const PlatformAlertDialog(
      {this.title,
      required this.description,
      required this.cancelButtonText,
      required this.okButtonText,
      this.noButtonText,
      required this.onCancelPressed,
      required this.onOkPressed,
      this.onNoPressed,
      Key? key})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    if (Platform.isIOS) {
      // iOS
      return CupertinoAlertDialog(
        title: title == null ? null : Text(
          title!,
        ),
        content: Text(
          description,
        ),
        actions: [
          // order: yes / cancel   todo: cancel / yes
          // order: yes / no / cancel
          CupertinoDialogAction(
            child: Text(okButtonText),
            isDefaultAction: true,
            onPressed: () => onOkPressed(),
          ),
          if (noButtonText != null) CupertinoDialogAction(
            child: Text(noButtonText!),
            onPressed: () => onNoPressed!(),
          ),
          CupertinoDialogAction(
            child: Text(cancelButtonText),
            onPressed: () => onCancelPressed(),
          ),
          /* previous code:
          CupertinoDialogAction(
            child: Text(cancelButtonText),
            onPressed: () => onCancelPressed(),
          ),
          CupertinoDialogAction(
            child: Text(okButtonText),
            isDefaultAction: true,
            onPressed: () => onOkPressed(),
          ),*/
        ],
      );
    } else {
      // Android
      final ThemeChainData theme = getIt<ThemeBloc>().state.theme;
      // action order changes in case of 3 buttons
      final TextButton cancelButton = TextButton(
        child: Text(
          cancelButtonText,
          style: Fonts.satoshi(
            fontSize: 17,
            fontWeight: FontWeight.w400,
            color: theme.secondary,
          ),
        ),
        onPressed: () => onCancelPressed(),
      );
      final TextButton yesButton = TextButton(
        child: Text(
          okButtonText,
          style: Fonts.satoshi(
            fontSize: 17,
            fontWeight: FontWeight.w600,
            color: theme.highlight,
          ),
        ),
        onPressed: () => onOkPressed(),
      );
      final TextButton? noButton = noButtonText == null ? null : TextButton(
        child: Text(
          noButtonText!,
          style: Fonts.satoshi(
            fontSize: 17,
            fontWeight: FontWeight.w400,
            color: theme.secondary,
          ),
        ),
        onPressed: () => onNoPressed!(),
      );
      List<Widget> actions = [];
      if (noButtonText != null) {
        actions.add(yesButton);
        actions.add(noButton!);
        actions.add(cancelButton);
      } else {
        actions.add(cancelButton);
        actions.add(yesButton);
      }

      return AlertDialog(
        title: title == null ? null : Text(
          title!,
          style: Fonts.satoshi(
            fontSize: 17,
            fontWeight: FontWeight.w600,
            color: theme.secondary,
          ),
        ),
        content: Text(
          description,
          style: Fonts.satoshi(
            fontSize: 13,
            fontWeight: FontWeight.w400,
            color: theme.secondary,
          ),
        ),
        actions: actions,
      );
    }
  }
}
