import 'package:fa_prev/graphql/generated/crud-api.dart';
import 'package:fa_prev/models.dart';
import 'package:geolocator/geolocator.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:intl/intl.dart';
import 'package:fa_prev/core/logger.dart';

final _dateFormatter = DateFormat('yyyy-MM-dd');

class _OpeningHours {
  final int? from; // Minutes, -1: null
  final int? to; // Minutes, -1: null
  _OpeningHours({
    this.from,
    this.to,
  });

  // Atlog a nyitvatartas holnapra?
  bool get isOpenTomorrow => from != null && (to == null || to! < from!);
}

List<OpeningHours> getOpeningHoursNext7(GetUnitById$Query$GetUnit unit) {
  List<OpeningHours> result = [];
  DateTime now = DateTime.now();
  for (int i = 0; i < 7; i++) {
    result.add(
      _getOpeningHoursNext(
        unit,
        now.add(Duration(days: i)),
      ),
    );
  }
  log.d('getOpeningHoursNext7()=${result.toString()}');
  return result;
}

OpeningHours _getOpeningHoursNext(
    GetUnitById$Query$GetUnit unit, DateTime date) {
  var d0 = DateTime(date.year, date.month, date.day, 0, 0, 0);
  var d1 = DateTime(date.year, date.month, date.day, 24, 0, 0);
  var openingHours = getUnitTodayOpeningHours(unit.openingHours, date.weekday);
  var from = d0.add(Duration(minutes: openingHours?.from ?? 0));
  var to = d0.add(Duration(minutes: openingHours?.to ?? 0));

  return OpeningHours(
    date: _dateFormatter.format(date),
    closed: !isUnitOpened(unit, date),
    from: from.millisecondsSinceEpoch.toDouble(),
    to: to.millisecondsSinceEpoch.toDouble(),
  );
}

int calculateDistance(LatLng location, double? unitLat, double? unitLng) {
  if (unitLat == null || unitLng == null) {
    return -1;
  }
  return Geolocator.distanceBetween(
    location.latitude,
    location.longitude,
    unitLat,
    unitLng,
  ).toInt();
}

bool isUnitOpened(GetUnitById$Query$GetUnit unit, DateTime now) {
  if (!unit.isActive || !unit.isAcceptingOrders) {
    return false;
  }

  return true;

  // if (unit.openingHours == null) {
  //   return true;
  // }

  // var today = getUnitOpeningHoursByWeekday(
  //   unit.openingHours,
  //   now.weekday,
  // );
  // var yesterday = getUnitOpeningHoursByWeekday(
  //   unit.openingHours,
  //   now.weekday - 1,
  // );

  // // var openingHours = getUnitTodayOpeningHours(unit.openingHours, now.weekday);
  // // if (openingHours == null) {
  // //   return true;
  // // }

  // // var nowTime = now.hour * 60 + now.minute;
  // // if ((openingHours.from == null || openingHours.from! <= nowTime) &&
  // //     (openingHours.to == null || openingHours.to! >= nowTime)) {
  // //   return true;
  // // }

  // return false;
}

_OpeningHours? getUnitTodayOpeningHours(
    GetUnitById$Query$GetUnit$OpeningHours? openingHours, int dayOfWeek) {
  var today = getUnitOpeningHoursByWeekday(openingHours, dayOfWeek);
  var yesterday = getUnitOpeningHoursByWeekday(openingHours, dayOfWeek - 1);
}

_OpeningHours getUnitOpeningHoursByWeekday(
    GetUnitById$Query$GetUnit$OpeningHours? openingHours, int dayOfWeek) {
  switch (dayOfWeek) {
    case 1:
      return _getOpeningHours(
        openingHours?.mon?.from,
        openingHours?.mon?.to,
      );
    case 2:
      return _getOpeningHours(
        openingHours?.tue?.from,
        openingHours?.tue?.to,
      );
    case 3:
      return _getOpeningHours(
        openingHours?.wed?.from,
        openingHours?.wed?.to,
      );
    case 4:
      return _getOpeningHours(
        openingHours?.thu?.from,
        openingHours?.thu?.to,
      );
    case 5:
      return _getOpeningHours(
        openingHours?.fri?.from,
        openingHours?.fri?.to,
      );
    case 6:
      return _getOpeningHours(
        openingHours?.sat?.from,
        openingHours?.sat?.to,
      );
    case 0:
    case 7:
      return _getOpeningHours(
        openingHours?.sun?.from,
        openingHours?.sun?.to,
      );
    default:
      return _OpeningHours(
        from: null,
        to: null,
      );
  }
}

_OpeningHours _getOpeningHours(String? from, String? to) {
  int? fromMinute = _getHourFromString(from);
  int? toMinute = _getHourFromString(to);
  if (fromMinute == null && toMinute == null) {
    return _OpeningHours(
      from: null,
      to: null,
    );
  }

  return _OpeningHours(
    from: fromMinute,
    to: toMinute,
  );
}

int? _getHourFromString(String? time) {
  if (time == null) {
    return null;
  }

  List<String> parts = time.split(':');
  if (parts.length != 2) {
    return null;
  }

  return int.parse(parts[0]) * 60 + int.parse(parts[1]);
}
