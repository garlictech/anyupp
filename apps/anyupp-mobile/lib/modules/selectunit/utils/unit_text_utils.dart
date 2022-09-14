import '/models.dart';
import '/modules/menu/menu.dart';
import '/shared/locale.dart';
import 'package:flutter/material.dart';

String getOpeningText(BuildContext context, Unit unit) {
  return UnitUtils.isClosed(unit)
      ? transEx(context, "selectUnit.closed")
      : transEx(context, "selectUnit.opened");
}
