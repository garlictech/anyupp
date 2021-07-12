import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/login/login.dart';
import 'package:fa_prev/modules/screens.dart';
import 'package:fa_prev/modules/transactions/screens/transactions_screen.dart';
import 'package:fa_prev/shared/auth.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/nav.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:url_launcher/url_launcher.dart';

import 'about_app_screen.dart';
import 'settings_screen.dart';

class Profile extends StatefulWidget {
  @override
  _ProfileState createState() => _ProfileState();
}

class _ProfileState extends State<Profile> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // The appBar head text
      // appBar:null
      backgroundColor: theme.background2,
      body: StreamBuilder<User>(
          stream: getIt<AuthRepository>()
              .getAuthenticatedUserProfileStream(), // a previously-obtained Future<String> or null
          builder: (BuildContext context, AsyncSnapshot<User> userSnapshot) {
            if (userSnapshot.hasData) {
              return buildMain(context, userSnapshot.data);
            }
            return CenterLoadingWidget();
          }),
    );
  }

  Widget buildMain(BuildContext context, User user) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: <Widget>[
        // User profile pic
        Container(
          // padding: EdgeInsets.only(top: 30.0),
          color: theme.background2,
          child: Column(
            children: [
              Container(
                padding: EdgeInsets.only(top: 10.0),
                width: 70.0,
                height: 70.0,
                child: CircleAvatar(
                  radius: 30.0,
                  backgroundImage: (user.profileImage != null) ? NetworkImage(user.profileImage) : null,
                  backgroundColor: Colors.transparent,
                ),
              ),
              // User name
              Container(
                padding: EdgeInsets.only(
                  top: 15.0,
                  bottom: 20.0,
                ),
                child: Text(
                  user.name,
                  style: GoogleFonts.poppins(
                    fontSize: 16.0,
                    fontWeight: FontWeight.w600,
                    color: theme.text,
                  ),
                ),
              ),
            ],
          ),
        ),
        // UnlinkAccountsWidget(user: user),
        Spacer(),
        _buildMenuList(context),
      ],
    );
  }

  Widget _buildMenuList(BuildContext context) {
    return Container(
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
          createOptionMenu(trans('profile.menu.about'), () => Nav.to(AboutApp()), true),
          createOptionMenu(trans('profile.menu.settings'), () => Nav.to(SettingsScreen()), true),
          createOptionMenu(trans('profile.menu.transactions'), () => Nav.to(TransactionsScreen()), true),
          createOptionMenu(trans('profile.menu.cards'), () => Nav.to(StripePaymentMethodsScreen()), true), 
          createOptionMenu(trans('profile.menu.regulations'), () => launch('https://www.anyupp.com/privacy/'), true),
          createOptionMenu(trans('profile.menu.logout'), () => showConfirmLogoutDialog(context), false),
        ],
      ),
    );
  }
}
