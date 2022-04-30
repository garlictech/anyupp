import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/profile/profile.dart';
import 'package:fa_prev/shared/locale/locale.dart';
import 'package:fa_prev/shared/utils/md5_hash.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';

class ProfileViewScreen extends StatelessWidget {
  final User profile;
  const ProfileViewScreen({
    Key? key,
    required this.profile,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: theme.secondary0,
      appBar: CustomAppBar(
        title: trans(context, 'profile.edit.title'),
        showBackButtonBorder: false,
        elevation: 4.0,
      ),
      body: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.only(
            topLeft: Radius.circular(16.0),
            topRight: Radius.circular(16.0),
          ),
          color: theme.secondary0,
        ),
        padding: EdgeInsets.only(
          top: 32.0,
          left: 16.0,
          right: 16.0,
        ),
        child: Theme(
          data: ThemeData().copyWith(
            scaffoldBackgroundColor: Colors.white,
            colorScheme: ThemeData().colorScheme.copyWith(
                  primary: theme.secondary,
                ),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // User's name
              Container(
                width: double.infinity,
                decoration: BoxDecoration(
                  border: Border.all(
                    color: theme.secondary16,
                    width: 1.0,
                  ),
                  borderRadius: BorderRadius.only(
                    topRight: Radius.circular(16.0),
                    bottomRight: Radius.circular(0.0),
                    topLeft: Radius.circular(16.0),
                    bottomLeft: Radius.circular(0.0),
                  ),
                  // color: theme.secondary40,
                ),
                padding: EdgeInsets.symmetric(
                  horizontal: 12.0,
                  vertical: 16.0,
                ),
                child: Text(
                  profile.name ?? '-',
                  style: Fonts.satoshi(
                    fontSize: 16.0,
                    fontWeight: FontWeight.w500,
                    color: theme.secondary,
                  ),
                ),
              ),
              // User's email
              Container(
                width: double.infinity,
                decoration: BoxDecoration(
                  border: Border(
                    left: BorderSide(
                      color: theme.secondary16,
                      width: 1.0,
                    ),
                    right: BorderSide(
                      color: theme.secondary16,
                      width: 1.0,
                    ),
                  ),
                ),
                padding: EdgeInsets.symmetric(
                  horizontal: 12.0,
                  vertical: 16.0,
                ),
                child: Text(
                  getFormattedAnonymousEmail(profile.email),
                  style: Fonts.satoshi(
                    fontSize: 16.0,
                    fontWeight: FontWeight.w500,
                    color: theme.secondary,
                  ),
                ),
              ),
              // Guest Label
              Container(
                width: double.infinity,
                decoration: BoxDecoration(
                  border: Border.all(
                    color: theme.secondary16,
                    width: 1.0,
                  ),
                  borderRadius: BorderRadius.only(
                    topRight: Radius.circular(0.0),
                    bottomRight: Radius.circular(16.0),
                    topLeft: Radius.circular(0.0),
                    bottomLeft: Radius.circular(16.0),
                  ),
                  // color: theme.secondary40,
                ),
                padding: EdgeInsets.symmetric(
                  horizontal: 12.0,
                  vertical: 16.0,
                ),
                child: Text(
                  generateHash(profile.id),
                  style: Fonts.satoshi(
                    fontSize: 16.0,
                    fontWeight: FontWeight.w500,
                    color: theme.secondary,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
