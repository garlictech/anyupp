import '/core/theme/theme.dart';
import '/shared/locale.dart';
import '/shared/nav.dart';
import '/shared/widgets.dart';
import 'package:flutter/material.dart';

class SettingsScreen extends StatelessWidget {
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        elevation: 0.0,
        backgroundColor: theme.secondary0,
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
                color: theme.secondary.withOpacity(0.2),
              ),
              color: theme.secondary0,
            ),
            child: BackButton(
              color: theme.secondary,
            ),
          ),
        ),
        title: Text(
          trans(context, 'profile.menu.settings'),
          style: Fonts.satoshi(
            fontSize: 18.0,
            color: theme.secondary,
            fontWeight: FontWeight.w400,
          ),
        ),
        centerTitle: true,
      ),
      body: Container(
        color: theme.secondary0,
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
