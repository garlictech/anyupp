import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/nav.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class SettingsScreen extends StatelessWidget {
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        elevation: 0.0,
        backgroundColor: theme.background,
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
                color: theme.highlight.withOpacity(0.2), // Color(0x33857C18),
              ),
              color: theme.background, // Colors.white,
            ),
            child: BackButton(
              color: theme.highlight,
            ),
          ),
        ),
        title: Text(
          trans(context, 'profile.menu.settings'),
          style: GoogleFonts.poppins(
            fontSize: 18.0,
            color: theme.text,
            fontWeight: FontWeight.w400,
          ),
        ),
        centerTitle: true,
      ),
      body: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.only(
            topLeft: Radius.circular(22.0),
            topRight: Radius.circular(22.0),
          ),
          color: theme.background,
        ),
        child: Column(
          children: [
            SizedBox(
              height: 20.0,
            ),
            createOptionMenu(trans(context, 'profile.menu.language'), () => Nav.to(LanguageMenu()), true),
          ],
        ),
      ),
    );
  }
}
