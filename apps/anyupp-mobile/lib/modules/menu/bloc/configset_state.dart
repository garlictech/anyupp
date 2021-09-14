import 'package:equatable/equatable.dart';
import 'package:fa_prev/models/GeoUnit.dart';
import 'package:fa_prev/models/OrderItem.dart';

abstract class ConfigsetState extends Equatable {
  const ConfigsetState();

  @override
  List<Object?> get props => [];
}

class ConfigsetInitial extends ConfigsetState {}

class ConfigsetUpdated extends ConfigsetState {
  final GeoUnit unit;
  final OrderItem orderItem;
  final double totalPrice;

  ConfigsetUpdated({required this.unit, required this.orderItem, required this.totalPrice});

  @override
  List<Object?> get props => [unit, orderItem, totalPrice];
}
