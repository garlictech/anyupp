import '/core/core.dart';
import '/models.dart';
import '/modules/login/login.dart';
import '/modules/menu/menu.dart';
import '/modules/profile/profile.dart';
import '/modules/screens.dart';
import '/modules/transactions/screens/transactions_screen.dart';
import '/shared/auth.dart';
import '/shared/locale.dart';
import '/shared/nav.dart';
import '/shared/utils/unit_utils.dart';
import '/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher_string.dart';

class Profile extends StatelessWidget {
  final ThemeChainData theme = defaultTheme();

  Profile({Key? key});

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Scaffold(
        backgroundColor: theme.secondary12,
        body: StreamBuilder<User?>(
            stream: getIt<AuthRepository>().getAuthenticatedUserProfileStream(),
            builder: (context, userSnapshot) {
              if (userSnapshot.hasData) {
                return buildMain(context, userSnapshot.data!);
              }
              return CenterLoadingWidget();
            }),
      ),
    );
  }

  Widget buildMain(BuildContext context, User user) {
    bool canOrder = currentUnit?.canOrder ?? true;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: <Widget>[
        Container(
          padding: EdgeInsets.only(
            top: 35.0,
            left: 16.0,
          ),
          // color: theme.secondary12,

          child: Row(
            children: [
              Container(
                width: 48.0,
                height: 48.0,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: theme.secondary,
                ),
                child: Center(
                    child: Text(
                  getNameLetters(user),
                  style: Fonts.satoshi(
                    fontSize: 18.0,
                    color: theme.secondary0,
                    fontWeight: FontWeight.w700,
                  ),
                )),
              ),
              // User name
              Container(
                padding: EdgeInsets.only(left: 16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      user.name ?? '-',
                      textAlign: TextAlign.center,
                      style: Fonts.satoshi(
                        fontSize: 18.0,
                        fontWeight: FontWeight.w700,
                        color: theme.secondary,
                      ),
                    ),
                    Text(
                      getFormattedAnonymousEmail(user.email),
                      textAlign: TextAlign.center,
                      style: Fonts.satoshi(
                        fontSize: 14.0,
                        fontWeight: FontWeight.w400,
                        color: theme.secondary64,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        Expanded(
          child: SingleChildScrollView(
            physics: BouncingScrollPhysics(),
            child: Container(
              padding: EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Padding(
                    padding: const EdgeInsets.only(bottom: 8.0),
                    child: Text(
                      trans(context, 'profile.menu.section1'),
                      style: Fonts.satoshi(
                        color: theme.secondary64,
                        fontSize: 14.0,
                      ),
                    ),
                  ),
                  ProfileListItemWidget(
                    icon: Icons.manage_accounts_outlined,
                    titleKey: 'profile.menu.userinfo',
                    border: ProfileBorder.TOP,
                    separator: true,
                    onTap: () => Nav.to(ProfileViewScreen(
                      profile: user,
                    )),
                  ),
                  if (canOrder)
                    ProfileListItemWidget(
                      icon: Icons.shopping_bag,
                      titleKey: 'profile.menu.transactions',
                      border: ProfileBorder.NONE,
                      separator: true,
                      onTap: () => Nav.to(TransactionsScreen()),
                    ),
                  if (canOrder)
                    ProfileListItemWidget(
                      icon: Icons.credit_card,
                      titleKey: 'profile.menu.paymentMethods',
                      border: ProfileBorder.NONE,
                      separator: true,
                      onTap: () => Nav.to(StripePaymentMethodsScreen()),
                    ),
                  ProfileListItemWidget(
                    icon: Icons.no_food,
                    titleKey: 'profile.menu.allergens',
                    border: ProfileBorder.BOTTOM,
                    separator: false,
                    onTap: () => Nav.to(AllergenDetailsScreen()),
                  ),

                  // Settings menu section
                  Padding(
                    padding: const EdgeInsets.only(top: 40.0, bottom: 8.0),
                    child: Text(
                      trans(context, 'profile.menu.section2'),
                      style: Fonts.satoshi(
                        color: theme.secondary64,
                        fontSize: 14.0,
                      ),
                    ),
                  ),
                  ProfileListItemWidget(
                    icon: Icons.language,
                    titleKey: 'profile.menu.language',
                    border: ProfileBorder.TOP,
                    separator: true,
                    onTap: () => Nav.to(LanguageMenu()),
                  ),
                  // ProfileListItemWidget(
                  //   icon: Icons.admin_panel_settings,
                  //   titleKey: 'profile.menu.security',
                  //   border: ProfileBorder.NONE,
                  //   separator: true,
                  //   onTap: () => Nav.to(SettingsScreen()),
                  // ),
                  ProfileListItemWidget(
                    icon: Icons.description,
                    titleKey: 'profile.menu.privacy',
                    border: ProfileBorder.NONE,
                    separator: true,
                    onTap: () =>
                        launchUrlString('https://www.anyupp.com/privacy/'),
                  ),
                  ProfileListItemWidget(
                    icon: Icons.info,
                    titleKey: 'profile.menu.about',
                    border: ProfileBorder.BOTTOM,
                    separator: false,
                    onTap: () => Nav.to(AboutApp()),
                  ),
                  // if (isDev)
                  //   ProfileListItemWidget(
                  //     icon: Icons.notifications,
                  //     titleKey: 'Notification Test',
                  //     border: ProfileBorder.BOTTOM,
                  //     separator: false,
                  //     onTap: () => _testNotification(context),
                  //   ),
                  // Logout menu section
                  Padding(
                    padding: const EdgeInsets.only(top: 40.0, bottom: 8.0),
                    child: Text(
                      trans(context, 'profile.menu.logout'),
                      style: Fonts.satoshi(
                        color: theme.secondary64,
                        fontSize: 14.0,
                      ),
                    ),
                  ),
                  ProfileListItemWidget(
                    icon: Icons.logout,
                    titleKey: 'profile.menu.logout',
                    border: ProfileBorder.TOP_AND_BOTTOM,
                    separator: false,
                    onTap: () => showConfirmLogoutDialog(context),
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }
}
