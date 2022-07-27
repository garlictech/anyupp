import '/models.dart';
import '/modules/menu/menu.dart';
import '/shared/locale.dart';
import 'package:flutter/material.dart';

String getOpeningText(BuildContext context, GeoUnit unit) {
  return GeoUnitUtils.isClosed(unit)
      ? GeoUnitUtils.getClosedText(
          unit,
          transEx(context, "selectUnit.closed"),
          transEx(context, "selectUnit.opens"),
          transEx(context,
              "selectUnit.weekdays.${GeoUnitUtils.getOpenedHour(unit)?.getDayString()}"),
        )
      : transEx(context, "selectUnit.opened") +
          ": " +
          transEx(
              context, GeoUnitUtils.getOpenedHour(unit)!.getOpenRangeString()!);
}
