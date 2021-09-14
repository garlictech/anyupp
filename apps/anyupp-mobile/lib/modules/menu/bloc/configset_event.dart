import 'package:equatable/equatable.dart';
import 'package:fa_prev/models/GeoUnit.dart';
import 'package:fa_prev/models/OrderItem.dart';

abstract class ConfigsetEvent extends Equatable {
  const ConfigsetEvent();

  @override
  List<Object?> get props => [];
}

class ConfigsetUpdatedEvent extends ConfigsetEvent {
  final GeoUnit unit;
  final OrderItem orderItem;
  final double totalPrice;

  ConfigsetUpdatedEvent({required this.unit, required this.orderItem, required this.totalPrice});

  @override
  List<Object?> get props => [unit, orderItem, totalPrice];
}
