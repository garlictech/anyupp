import '/core/theme/theme.dart';
import 'package:flutter/material.dart';

InputDecoration createFormFieldDecoration(
    {required ThemeChainData theme, required String labelText, required String hintText, InputBorder? border}) {
  return InputDecoration(
    labelText: labelText,
    hintText: hintText,
    hoverColor: theme.secondary,
    focusColor: theme.secondary,
    fillColor: theme.secondary,
    hintStyle: Fonts.satoshi(
      color: theme.secondary,
    ),
    labelStyle: Fonts.satoshi(
      color: theme.secondary40,
      // fontSize: 16.0,
    ),
    // floatingLabelStyle: Fonts.satoshi(
    //   color: theme.secondary,
    //   // fontSize: 16.0,
    // ),
    enabledBorder: border ??
        UnderlineInputBorder(
          borderSide: BorderSide(color: theme.secondary64),
        ),
    focusedBorder: border ??
        UnderlineInputBorder(
          borderSide: BorderSide(color: theme.secondary64),
        ),
    border: border ??
        UnderlineInputBorder(
          borderSide: BorderSide(color: theme.secondary64),
        ),
  );
}
