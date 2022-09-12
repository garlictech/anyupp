import 'package:anyupp/domain/entities/entities.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class ActiveRestaurantNotifier extends StateNotifier<Restaurant?> {
  ActiveRestaurantNotifier() : super(null) {
    state = Restaurant(id: "id", canCallWaiter: true);
  }

  setActiveRestaurant(Restaurant restaurant) {
    state = restaurant;
  }
}

final activeRestaurantStateProvider =
    StateNotifierProvider<ActiveRestaurantNotifier, Restaurant?>((ref) {
  return ActiveRestaurantNotifier();
});
