import '/core/core.dart';
import 'package:flutter/material.dart';

InputDecoration buildTextFieldDecoration(
    {String? label, Widget? prefixIcon, required BorderRadius border}) {
  final ThemeChainData theme = getIt<ThemeBloc>().state.theme;

  return InputDecoration(
    border: OutlineInputBorder(
      borderSide: BorderSide(
        color: theme.secondary16,
        width: 1,
      ),
      borderRadius: border,
    ),
    // border: InputBorder.none,
    filled: false,
    hoverColor: theme.secondary,
    prefixIcon: prefixIcon,
    focusColor: theme.secondary,
    floatingLabelBehavior: FloatingLabelBehavior.never,
    hintText: label,
    hintStyle: Fonts.satoshi(
      fontSize: 16.0,
      fontWeight: FontWeight.w400,
      color: theme.secondary40,
    ),
    enabledBorder: OutlineInputBorder(
      borderSide: BorderSide(
        color: theme.secondary16,
        width: 1,
      ),
      borderRadius: border,
    ),
    focusedBorder: OutlineInputBorder(
      borderSide: BorderSide(
        color: theme.secondary,
        width: 1,
      ),
      borderRadius: border,
    ),
    errorText: null,
    errorStyle: TextStyle(height: 0.0),

    errorBorder: OutlineInputBorder(
      borderSide: BorderSide(
        color: Color(0xFFE74C3C),
        width: 1,
      ),
      borderRadius: border,
    ),
  );
}
