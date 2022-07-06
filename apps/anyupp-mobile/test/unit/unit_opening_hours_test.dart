import 'package:fa_prev/core/units/provider/unit_filter_utils.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';
import 'package:fa_prev/core/logger.dart';
import 'package:flutter_test/flutter_test.dart';

import '../utils/file_utils.dart';

void main() {
  // void checkOpeningDateExpected(String source, String expected, [bool debug = true]) {
  //   String hash = generateHash(source);
  //   if (debug) log.d('source: $source, hash: $hash');
  //   expect(hash, equals(expected));
  // }

  group('Testing the Unit opening hour calculations...', () {
    test('Simple interval test', () async {
      var json = loadDataJson('test/unit/data/openinghours_simple.json');
      var openingHours = GetUnitById$Query$GetUnit$OpeningHours.fromJson(json);
      log.d('openingHours=$openingHours');
      var mon = getUnitOpeningHoursByWeekday(openingHours, 1);
      expect(mon.from, equals(9 * 60)); // == 9:00 in minutes
      expect(mon.to, equals(17 * 60)); // == 17:00 in minutes
      expect(mon.isOpenTomorrow, equals(false));

      var fri = getUnitOpeningHoursByWeekday(openingHours, 5);
      expect(fri.from, equals(9 * 60));
      expect(fri.to, equals(4 * 60));
      expect(fri.isOpenTomorrow, equals(true));

      var sat = getUnitOpeningHoursByWeekday(openingHours, 6);
      expect(sat.from, isNull); // null == closed
      expect(sat.to, isNull); // null == closed
      expect(sat.isOpenTomorrow, equals(false));
    });

    test('Empty (null) interval test', () async {
      //
    });

    test('Extended interval test (intervall is next day)', () async {
      //
    });
  });
}
