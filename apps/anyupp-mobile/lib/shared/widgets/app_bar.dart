import 'package:flutter/material.dart';
import 'package:fa_prev/core/theme/theme.dart';

AppBar appBar(
  ThemeChainData theme, {
  required Function onBackButtonPressed,
  String? title,
}) {
  return AppBar(
      leading: Container(
        padding: EdgeInsets.only(
          left: 8.0,
          top: 4.0,
          bottom: 4.0,
        ),
        child: Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(10),
            border: Border.all(
              width: 1,
              color: theme.secondary40,
            ),
          ),
          child: BackButton(
            onPressed: () => onBackButtonPressed(),
            color: theme.secondary,
          ),
        ),
      ),
      elevation: 0.0,
      iconTheme: IconThemeData(
        color: theme.secondary, //change your color here
      ),
      backgroundColor: theme.secondary0,
      title: title != null
          ? Text(
              title,
              style: Fonts.satoshi(
                color: Colors.black,
              ),
              //getLocalizedText(context, widget.item.name),
            )
          : Container());
}
