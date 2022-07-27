import '/models.dart';
import '/modules/rating_tipping/rating_tipping.dart';
import 'package:flutter_test/flutter_test.dart';
import '/graphql/generated/crud-api.graphql.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../mock/mock_api_values.dart';
import '../mock/mock_data_faker.dart';
import 'mock/mock_shared_preferences.dart';

void main() {
  late Order _order;
  late SharedPreferences _mockPrefs;

  void _testDelay(
    DateTime orderDate,
    Duration ellapsedSinceServed,
    Duration expectedDuration,
  ) {
    _order = _order.copyWith(
      updatedAt: orderDate,
    );
    Duration delay = calculateNotificationScheduleDelay(
        _order, orderDate.add(ellapsedSinceServed));

    expect(delay, equals(expectedDuration));
  }

  setUp(() {
    _mockPrefs = MockSharedPreferences();
    _order = MockGenerator.generateOrder(
      name: 'TEST_ORDER',
      method: PaymentMethod.inapp,
      paymentType: PaymentType.stripe,
      status: OrderStatus.served,
      price: 1000,
    ).copyWith(ratingPolicies: [TestMock.mockRatingPolicy()!]);
  });

  group('Test for Rating scheduling time calculations from order serving time',
      () {
    test('Test needing of notification sending from Order serving time', () {
      _testDelay(DateTime.parse('2022-01-01 10:00:00'), Duration(minutes: 1),
          Duration(minutes: 9));
    });

    test('Test needing of notification sending from Order serving time 2', () {
      _testDelay(DateTime.parse('2022-01-01 10:00:00'), Duration(minutes: 10),
          Duration(minutes: 0));
    });

    test('Test needing of notification sending from Order serving time 3', () {
      _testDelay(DateTime.parse('2022-01-01 10:00:00'), Duration(minutes: 15),
          Duration(minutes: -5));
    });

    test(
        'Testing whether a Rating notification is required to schedule for an order.',
        () async {
      var orderDate = DateTime.parse('2022-01-01 10:00:00');
      var key = 'rating_schedule_${_order.id}';
      _order = _order.copyWith(
        updatedAt: orderDate,
      );
      var now = orderDate.add(Duration(minutes: 1));
      bool result = isNeedScheduleNotification(
        _order,
        now,
        _mockPrefs,
      );
      expect(result, equals(true));

      // set notification to scheduled
      await _mockPrefs.setBool(key, true);

      // Second time it must be false!
      result = isNeedScheduleNotification(
        _order,
        now,
        _mockPrefs,
      );
      expect(result, equals(false));

      // remove notification schedule
      await _mockPrefs.remove(key);

      now = orderDate.add(Duration(minutes: 11));
      result = isNeedScheduleNotification(
        _order,
        now,
        _mockPrefs,
      );
      expect(result, equals(false));
    });
  });
}
