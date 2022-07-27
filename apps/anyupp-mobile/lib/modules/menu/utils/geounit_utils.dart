import '/models.dart';

class GeoUnitUtils {
  static bool isClosed(GeoUnit unit) {
    if (unit.openingHoursNext7.isNotEmpty) {
      return unit.openingHoursNext7.first.closed;
    }
    return true;
  }

  static OpeningHours? getOpenedHour(GeoUnit unit) {
    if (unit.openingHoursNext7.isNotEmpty) {
      for (OpeningHours openingHours in unit.openingHoursNext7) {
        if (!openingHours.closed) {
          return openingHours;
        }
      }
    }
    return null;
  }

  static String getClosedText(
      GeoUnit unit, String closed, String opens, String day) {
    String text = closed;
    OpeningHours? openingHours = getOpenedHour(unit);
    if (openingHours != null) {
      String range = openingHours.getOpenRangeString(fromTo: false) ?? '';
      text += " - " + opens + " " + day + " " + range;
    }
    return text;
  }
}
