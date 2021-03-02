import 'package:fa_prev/models.dart';
import 'package:flutter/foundation.dart';

@immutable
abstract class BaseOrderState {
  const BaseOrderState();
}

class NoOrderState extends BaseOrderState {
  const NoOrderState();
}

class CurrentOrderState extends BaseOrderState {
  final Order _order;

  const CurrentOrderState(this._order);

  Order get order => _order;
}
