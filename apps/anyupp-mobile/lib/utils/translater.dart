import 'package:anyupp/shared/locale/app_localizations.dart';
import 'package:flutter/material.dart';

class Translater {
  String t(BuildContext ctx, String label) {
    return AppLocalizations.of(ctx)?.trans(label) ?? label;
  }
}
