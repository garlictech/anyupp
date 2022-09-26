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

Map<int, String> ohDayCodes = {
  1: "mon",
  2: "tue",
  3: "wed",
  4: "thu",
  5: "fri",
  6: "sat",
  7: "sun"
};

extension OpeningHoursExtension on OpeningHours {

  /*
  String getHourFormattedString(int? timeStamp) {
    return timeStamp == null
        ? ""
        : ohHourFormat
            .format(DateTime.fromMillisecondsSinceEpoch(timeStamp))
            .toString();
  }

  String? getDayString() {
    return ohDays[getDate().weekday];
  }*/

  String getOpenRangeString() {
    if (from == null || from!.isEmpty) {
      return "-";
    }
    return "$from - $to";
  }

  DateTime getDate() {
    return ohDateFormat.parse(date!);
  }
}
