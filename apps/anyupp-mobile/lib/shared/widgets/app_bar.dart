import 'package:fa_prev/core/theme/model/theme_chain_data.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

Widget appBar(
  ThemeChainData theme, {
  Function onBackButtonPressed,
  String title,
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
            color: theme.border2,
          ),
        ),
        child: BackButton(
          onPressed: () => onBackButtonPressed(),
          color: theme.text,
        ),
      ),
    ),
    elevation: 0.0,
    iconTheme: IconThemeData(
      color: theme.text, //change your color here
    ),
    backgroundColor: theme.background,
    title: title != null ? Text(
      title,
      style: GoogleFonts.poppins(
        color: Colors.black,
      ),
      //getLocalizedText(context, widget.item.name),
    ) : Container()
  );
}
