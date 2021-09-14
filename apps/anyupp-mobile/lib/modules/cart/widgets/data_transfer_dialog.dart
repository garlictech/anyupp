import 'package:fa_prev/core/dependency_indjection/dependency_injection.dart';
import 'package:fa_prev/core/core.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:fa_prev/shared/nav.dart';

showSimpleDialog(BuildContext context) {
  final ThemeChainData theme = getIt<ThemeBloc>().state.theme;

  SchedulerBinding.instance?.addPostFrameCallback((_) {
    showDialog(
        context: context,
        builder: (BuildContext context) => Dialog(
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12.0),
              ),
              elevation: 0.0,
              backgroundColor: theme.background,
              child: Container(
                padding: EdgeInsets.all(8.0),
                child: SingleChildScrollView(
                  physics: BouncingScrollPhysics(),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      createContent(theme, context),
                      SizedBox(height: 20.0),
                      createOkButton(theme, context),
                    ],
                  ),
                ),
              ),
            ));
  });
}

Container createOkButton(ThemeChainData theme, BuildContext context) {
  return Container(
    //height: 57.0,
    padding: EdgeInsets.all(8.0),
    width: double.infinity,
    decoration: BoxDecoration(
      borderRadius: BorderRadius.all(Radius.zero),
      border: Border.all(
        width: 1.5,
        color: theme.border,
      ),
    ),
    child: TextButton(
      style: TextButton.styleFrom(
        backgroundColor: Colors.transparent,
        padding: EdgeInsets.all(8.0),
      ),
      onPressed: () => Nav.pop(),
      child: Text(
        transEx(context, 'common.close'),
        style: GoogleFonts.poppins(
          fontSize: 14.0,
          color: theme.text,
        ),
      ),
    ),
  );
}

Widget createContent(ThemeChainData theme, BuildContext context) {
  // TODO: get it from the actual UNIT from the db in case we have a proper simple registered unit
  var unitName = 'CyBERG Corp. Nyrt.';
  var unitAddress = 'Magyarország,  1051 Budapest József nádor tér 5-6 fszt.';
  var unitUrl = 'https://anyupp.com';
  var appName = transEx(context, 'common.appTitle');
  var transmittedData = 'email';

  var unitParams = [unitName, unitAddress, unitUrl, appName, transmittedData];
  return RichText(
    textAlign: TextAlign.center,
    text: TextSpan(
      children: [
        TextSpan(
          text: transEx(context, 'dataTransfer.title') + '\n\n',
          style: GoogleFonts.poppins(
            fontSize: 18.0,
            color: Colors.black,
          ),
        ),
        TextSpan(
          text: transEx(context, 'dataTransfer.content', unitParams) + '\n',
          style: GoogleFonts.poppins(
            fontSize: 14.0,
            color: Color(0x993C2F2F),
          ),
        ),
        TextSpan(
          text: 'http://simplepay.hu/vasarlo-aff',
          style: GoogleFonts.poppins(
            fontSize: 14.0,
            color: Colors.red,
          ),
          recognizer: TapGestureRecognizer()..onTap = () => launch('http://simplepay.hu/vasarlo-aff'),
        ),
      ],
    ),
  );
}
