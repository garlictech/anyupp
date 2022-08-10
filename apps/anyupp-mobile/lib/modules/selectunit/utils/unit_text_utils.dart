import '/models.dart';
import '/modules/menu/menu.dart';
import '/shared/locale.dart';
import 'package:flutter/material.dart';

String getOpeningText(BuildContext context, Unit unit) {
  return UnitUtils.isClosed(unit)
      ? UnitUtils.getClosedText(
          unit,
          transEx(context, "selectUnit.closed"),
          transEx(context, "selectUnit.opens"),
          transEx(context,
              "selectUnit.weekdays.${UnitUtils.getOpenedHour(unit)?.getDayString()}"),
        )
      : transEx(context, "selectUnit.opened") +
          ": " +
          transEx(
              context, UnitUtils.getOpenedHour(unit)!.getOpenRangeString()!);
}
