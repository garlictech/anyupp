import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/menu/menu.dart';
import 'package:fa_prev/shared/locale.dart';
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
