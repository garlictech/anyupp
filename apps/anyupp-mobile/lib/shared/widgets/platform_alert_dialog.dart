import 'dart:io';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import '../../core/dependency_indjection/dependency_injection.dart';
import '../../core/theme/bloc/theme_bloc.dart';
import '../../core/theme/font/font.dart';
import '../../core/theme/model/theme_chain_data.dart';

class PlatformAlertDialog extends StatelessWidget {
  final String title;
  final String description;
  final String cancelButtonText;
  final String okButtonText;
  final Function onOkPressed;
  final Function onCancelPressed;

  const PlatformAlertDialog(
      {required this.title,
      required this.description,
      required this.cancelButtonText,
      required this.okButtonText,
      required this.onOkPressed,
      required this.onCancelPressed,
      Key? key})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    if (Platform.isIOS) {
      return CupertinoAlertDialog(
        title: Text(
          title,
        ),
        content: Text(
          description,
        ),
        actions: [
          CupertinoDialogAction(
            child: Text(cancelButtonText),
            onPressed: () => onCancelPressed(),
          ),
          CupertinoDialogAction(
            child: Text(okButtonText),
            isDefaultAction: true,
            onPressed: () => onOkPressed(),
          ),
        ],
      );
    } else {
      final ThemeChainData theme = getIt<ThemeBloc>().state.theme;
      return AlertDialog(
        title: Text(
          title,
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
        actions: [
          TextButton(
            child: Text(
              cancelButtonText,
              style: Fonts.satoshi(
                fontSize: 17,
                fontWeight: FontWeight.w400,
                color: theme.secondary,
              ),
            ),
            onPressed: () => onCancelPressed(),
          ),
          TextButton(
            child: Text(
              okButtonText,
              style: Fonts.satoshi(
                fontSize: 17,
                fontWeight: FontWeight.w600,
                color: theme.highlight,
              ),
            ),
            onPressed: () => onOkPressed(),
          ),
        ],
      );
    }
  }
}
