import 'package:fa_prev/modules/orders/orders.dart';
import 'package:flutter/foundation.dart';

@immutable
abstract class BaseOrderState {
  const BaseOrderState();
}

class NoOrderState extends BaseOrderState {
  const NoOrderState();
}

class CurrentOrderState extends BaseOrderState {
  final PlacedOrder _order;

  const CurrentOrderState(this._order);

  PlacedOrder get order => _order;
}
