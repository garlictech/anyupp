import 'package:fa_prev/graphql/generated/crud-api.dart';
import 'package:flutter/material.dart';

const Map<OrderStatus, IconData> STATUS_ICON_MAP = {
  OrderStatus.none: Icons.hourglass_bottom_outlined,
  OrderStatus.placed: Icons.adjust_outlined,
  OrderStatus.processing: Icons.schedule_outlined,
  OrderStatus.ready: Icons.check_circle, //check_circle_outline
  OrderStatus.served: Icons.check_circle,
  OrderStatus.rejected: Icons.cancel,
  OrderStatus.failed: Icons.cancel,
};
