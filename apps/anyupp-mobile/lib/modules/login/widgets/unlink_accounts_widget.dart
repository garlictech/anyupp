import 'package:badges/badges.dart';
import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/models.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:fa_prev/shared/widgets.dart';

import 'link_account_dialog.dart';
import 'social_login_button_widget.dart';

import 'package:fa_prev/modules/login/login.dart';

class UnlinkAccountsWidget extends StatelessWidget {
  final User user;

  const UnlinkAccountsWidget({Key key, @required this.user}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<LoginBloc, LoginState>(
      builder: (BuildContext context, LoginState state) {
        return FutureBuilder<List<LoginMethod>>(
          future:
              getIt<LoginRepository>().fetchSignInMethodsForEmail(user.email),
          builder: (BuildContext context,
              AsyncSnapshot<List<LoginMethod>> methodSnapshot) {
            if (methodSnapshot.hasData) {
              print('**** User Login methods=${methodSnapshot.data}');

              return FutureBuilder<bool>(
                future: getIt<LoginRepository>().appleSignInAvailable,
                builder: (BuildContext context, AsyncSnapshot<bool> snapshot) {
                  if (snapshot.hasData) {
                    return Center(
                      child: Wrap(
                        direction: Axis.horizontal,
                        children: [
                          _createLinkedSocialButtonWidget(
                            context,
                            'google',
                            LoginMethod.GOOGLE,
                            methodSnapshot.data.contains(LoginMethod.GOOGLE),
                          ),
                          _createLinkedSocialButtonWidget(
                            context,
                            'facebook',
                            LoginMethod.FACEBOOK,
                            methodSnapshot.data.contains(LoginMethod.FACEBOOK),
                          ),
                          // TODO PHONE
                          // _createLinkedSocialButtonWidget(
                          //   context,
                          //   'phone',
                          //   LoginMethod.PHONE,
                          //   methodSnapshot.data.contains(LoginMethod.PHONE),
                          // ),
                          if (snapshot.data)
                            _createLinkedSocialButtonWidget(
                              context,
                              'apple',
                              LoginMethod.APPLE,
                              methodSnapshot.data.contains(LoginMethod.APPLE),
                            ),
                        ],
                      ),
                    );
                  }
                  return CenterLoadingWidget();
                },
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
          color: theme.text2,
          size: 16.0,
        ),
        badgeColor: linked ? theme.indicator : theme.highlight,
        child: _createSocialButtonWidget(context, icon, method, linked),
      ),
    );
  }

  Widget _createSocialButtonWidget(
      BuildContext context, String icon, LoginMethod method, bool linked) {
    return SocialLoginButtonWidget(
      providerIcon: icon,
      method: method,
      borderColor: theme.border,
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
