import '/core/core.dart';
import 'package:flutter/material.dart';

import '/shared/locale.dart';
import '/modules/login/login.dart';

void showSelectAccountToLinkDialog(
    BuildContext context, NeedAccountLinking state) {
  final ThemeChainData theme = getIt<ThemeBloc>().state.theme;

  showDialog(
    context: context,
    barrierDismissible: false,
    builder: (BuildContext context) {
      return Dialog(
        backgroundColor: theme.secondary0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20.0),
        ), //this right here
        child: Container(
          height: 360.0,
          child: Padding(
            padding: const EdgeInsets.all(12.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.start,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Text(
                  transEx(context, 'login.accountLink.title'),
                  style: Fonts.satoshi(
                    fontSize: 20.0,
                    color: theme.secondary,
                  ),
                ),
                Text(
                  transEx(context, 'login.accountLink.description'),
                  textAlign: TextAlign.justify,
                  style: Fonts.satoshi(
                    fontSize: 12.0,
                    color: theme.secondary,
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.only(top: 8.0, bottom: 8.0),
                  child: Divider(height: 1.0),
                ),
                Text(
                  transEx(context, 'login.accountLink.selectAccount'),
                  textAlign: TextAlign.left,
                  style: Fonts.satoshi(
                    fontSize: 16.0,
                    color: theme.secondary,
                  ),
                ),
                ListView.builder(
                  shrinkWrap: true,
                  itemCount: state.existingProviderList.length,
                  itemBuilder: (context, index) {
                    return ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: theme.button,
                      ),
                      onPressed: () {
                        Navigator.pop(context);
                      },
                      child: Text(
                        transEx(
                          context,
                          'login.accountLink.linkWith',
                          [
                            LoginMethodUtils.methodToString(
                                state.existingProviderList[index])
                          ],
                        ),
                        style: TextStyle(color: theme.buttonText),
                      ),
                    );
                  },
                ),
                Spacer(),
                SizedBox(
                  width: 320.0,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: theme.secondary64,
                    ),
                    onPressed: () {
                      Navigator.pop(context);
                      getIt<LoginBloc>().add(ResetLogin());
                    },
                    child: Text(
                      transEx(context, 'login.accountLink.cancelLogin'),
                      style: TextStyle(color: theme.secondary0),
                    ),
                  ),
                )
              ],
            ),
          ),
        ),
      );
    },
  );
}

void showUnlinkConfirmDialog(BuildContext context, LoginMethod method) {
  final ThemeChainData theme = getIt<ThemeBloc>().state.theme;

  showDialog(
    context: context,
    barrierDismissible: false,
    builder: (BuildContext context) {
      return Dialog(
        backgroundColor: theme.secondary0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20.0),
        ),
        child: Container(
          height: 200.0,
          child: Padding(
            padding: const EdgeInsets.all(12.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.start,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Text(
                  transEx(context, 'login.accountUnlink.title'),
                  style: Fonts.satoshi(
                    fontSize: 20.0,
                    color: theme.secondary,
                  ),
                ),
                Text(
                  transEx(context, 'login.accountUnlink.description'),
                  textAlign: TextAlign.justify,
                  style: Fonts.satoshi(
                    fontSize: 12.0,
                    color: theme.secondary,
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.only(top: 8.0, bottom: 8.0),
                  child: Divider(height: 1.0),
                ),
                Spacer(),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: theme.secondary64,
                      ),
                      onPressed: () {
                        Navigator.pop(context);
                      },
                      child: Text(
                        transEx(context, 'login.accountUnlink.cancel'),
                        style: Fonts.satoshi(
                          fontSize: 12.0,
                          color: theme.secondary0,
                        ),
                      ),
                    ),
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: theme.button,
                      ),
                      onPressed: () {
                        Navigator.pop(context);
                        getIt<LoginBloc>()
                            .add(UnlinkCurrentAccountFromProvider(method));
                      },
                      child: Text(
                        transEx(context, 'login.accountUnlink.unlink',
                            [LoginMethodUtils.methodToString(method)]),
                        style: Fonts.satoshi(
                          fontSize: 12.0,
                          color: theme.buttonText,
                        ),
                      ),
                    ),
                  ],
                )
              ],
            ),
          ),
        ),
      );
    },
  );
}
