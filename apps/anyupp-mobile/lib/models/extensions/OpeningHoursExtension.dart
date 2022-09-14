import '/models.dart';
import 'package:intl/intl.dart';

DateFormat ohDateFormat = DateFormat('yyyy-MM-dd');
DateFormat ohHourFormat = DateFormat('HH:mm');
Map<int, String> ohDays = {
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday",
  7: "sunday"
};

extension OpeningHoursExtension on OpeningHours {
  String getHourFormattedString(int? timeStamp) {
    return timeStamp == null
        ? ""
        : ohHourFormat
            .format(DateTime.fromMillisecondsSinceEpoch(timeStamp))
            .toString();
  }

  String? getDayString() {
    return ohDays[getDate().weekday];
  }

  String? getOpenRangeString({bool fromTo = true}) {
    if (!closed && from != null) {
      String formattedString = getHourFormattedString(from?.toInt()) + "-";
      if (fromTo) {
        formattedString += getHourFormattedString(to?.toInt());
      }
      return formattedString;
    }
    return null;
  }

  DateTime getDate() {
    return ohDateFormat.parse(date);
  }
}
