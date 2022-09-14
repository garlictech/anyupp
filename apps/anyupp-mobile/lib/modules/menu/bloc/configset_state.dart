import 'package:equatable/equatable.dart';
import '/models/Unit.dart';
import '/models/OrderItem.dart';

abstract class ConfigsetState extends Equatable {
  const ConfigsetState();

  @override
  List<Object?> get props => [];
}

class ConfigsetInitial extends ConfigsetState {}

class ConfigsetUpdated extends ConfigsetState {
  final Unit unit;
  final OrderItem orderItem;
  final double totalPrice;

  ConfigsetUpdated({required this.unit, required this.orderItem, required this.totalPrice});

  @override
  List<Object?> get props => [unit, orderItem, totalPrice];
}
