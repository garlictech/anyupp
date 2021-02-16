import 'package:flutter/foundation.dart';

@immutable
abstract class BaseOrderAction {
  const BaseOrderAction();
}

class RefreshOrderAction extends BaseOrderAction {
  const RefreshOrderAction();
}
