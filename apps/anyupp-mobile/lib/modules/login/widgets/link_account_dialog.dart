import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/modules/login/login.dart';

void showSelectAccountToLinkDialog(BuildContext context, NeedAccountLinking state) {
  final ThemeChainData theme = getIt<ThemeBloc>().state.theme;

  showDialog(
    context: context,
    barrierDismissible: false,
    builder: (BuildContext context) {
      return Dialog(
        backgroundColor: theme.background,
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
                  style: GoogleFonts.poppins(
                    fontSize: 20.0,
                    color: theme.text,
                  ),
                ),
                Text(
                  transEx(context, 'login.accountLink.description'),
                  textAlign: TextAlign.justify,
                  style: GoogleFonts.poppins(
                    fontSize: 12.0,
                    color: theme.text,
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.only(top: 8.0, bottom: 8.0),
                  child: Divider(height: 1.0),
                ),
                Text(
                  transEx(context, 'login.accountLink.selectAccount'),
                  textAlign: TextAlign.left,
                  style: GoogleFonts.poppins(
                    fontSize: 16.0,
                    color: theme.text,
                  ),
                ),
                ListView.builder(
                  shrinkWrap: true,
                  itemCount: state.existingProviderList.length,
                  itemBuilder: (context, index) {
                    return RaisedButton(
                      onPressed: () {
                        Navigator.pop(context);
                        getIt<LoginBloc>().add(LinkLoginWithProvider(
                          state.existingProviderList[index],
                          state.newProviderCredentials,
                        ));
                      },
                      child: Text(
                        transEx(context, 'login.accountLink.linkWith',
                            [LoginMethodUtils.methodToString(state.existingProviderList[index])]),
                        // 'Link with ${LoginMethodUtils.methodToString(state.existingProviderList[index])}',
                        style: TextStyle(color: theme.text2),
                      ),
                      color: theme.indicator,
                    );
                  },
                ),
                Spacer(),
                SizedBox(
                  width: 320.0,
                  child: RaisedButton(
                    onPressed: () {
                      Navigator.pop(context);
                      getIt<LoginBloc>().add(ResetLogin());
                    },
                    child: Text(
                      transEx(context, 'login.accountLink.cancelLogin'),
                      style: TextStyle(color: theme.text2),
                    ),
                    color: theme.disabled,
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
        backgroundColor: theme.background,
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
                  style: GoogleFonts.poppins(
                    fontSize: 20.0,
                    color: theme.text,
                  ),
                ),
                Text(
                  transEx(context, 'login.accountUnlink.description'),
                  textAlign: TextAlign.justify,
                  style: GoogleFonts.poppins(
                    fontSize: 12.0,
                    color: theme.text,
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
                    RaisedButton(
                      onPressed: () {
                        Navigator.pop(context);
                      },
                      child: Text(
                        transEx(context, 'login.accountUnlink.cancel'),
                        style: GoogleFonts.poppins(
                          fontSize: 12.0,
                          color: theme.text2,
                        ),
                      ),
                      color: theme.disabled,
                    ),
                    RaisedButton(
                        onPressed: () {
                          Navigator.pop(context);
                          getIt<LoginBloc>().add(UnlinkCurrentAccountFromProvider(method));
                        },
                        child: Text(
                          transEx(context, 'login.accountUnlink.unlink', [LoginMethodUtils.methodToString(method)]),
                          style: GoogleFonts.poppins(
                            fontSize: 12.0,
                            color: theme.text2,
                          ),
                        ),
                        color: theme.indicator),
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
