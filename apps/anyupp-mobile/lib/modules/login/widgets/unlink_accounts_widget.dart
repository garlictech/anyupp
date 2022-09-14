import 'package:badges/badges.dart';
import '/core/core.dart';
import '/models.dart';
import '/modules/login/login.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class UnlinkAccountsWidget extends StatelessWidget {
  final User user;

  const UnlinkAccountsWidget({required this.user});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<LoginBloc, LoginState>(
      builder: (BuildContext context, LoginState state) {
        return FutureBuilder<List<LoginMethod>>(
          future:
              getIt<LoginRepository>().fetchSignInMethodsForEmail(user.email!),
          builder: (BuildContext context,
              AsyncSnapshot<List<LoginMethod>> methodSnapshot) {
            if (methodSnapshot.hasData) {
              log.d('**** User Login methods=${methodSnapshot.data}');

              return Center(
                child: Wrap(
                  direction: Axis.horizontal,
                  children: [
                    _createLinkedSocialButtonWidget(
                      context,
                      'google',
                      LoginMethod.GOOGLE,
                      methodSnapshot.data!.contains(LoginMethod.GOOGLE),
                    ),
                    _createLinkedSocialButtonWidget(
                      context,
                      'facebook',
                      LoginMethod.FACEBOOK,
                      methodSnapshot.data!.contains(LoginMethod.FACEBOOK),
                    ),
                    _createLinkedSocialButtonWidget(
                      context,
                      'apple',
                      LoginMethod.APPLE,
                      methodSnapshot.data!.contains(LoginMethod.APPLE),
                    ),
                  ],
                ),
              );
            }

            return Container();
          },
        );
      },
    );
  }

  Widget _createLinkedSocialButtonWidget(
      BuildContext context, String icon, LoginMethod method, bool linked) {
    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: Badge(
        elevation: 2.0,
        //padding: EdgeInsets.all(10.0),
        position: BadgePosition.topEnd(),
        badgeContent: Icon(
          linked ? Icons.check : Icons.add,
          color: theme.secondary0,
          size: 16.0,
        ),
        badgeColor: theme.icon,
        child: _createSocialButtonWidget(context, icon, method, linked),
      ),
    );
  }

  Widget _createSocialButtonWidget(
      BuildContext context, String icon, LoginMethod method, bool linked) {
    return SocialLoginButtonWidget(
      providerIcon: icon,
      iconColor: theme.icon,
      method: method,
      borderColor: theme.secondary16,
      size: 60.0,
      iconSize: 32.0,
      onTap: !linked
          ? () {
              getIt<LoginBloc>().add(LinkCurrentAccountWithProvider(method));
            }
          : () => showUnlinkConfirmDialog(context, method),
    );
  }
}
