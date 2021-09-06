import 'package:equatable/equatable.dart';
import 'package:fa_prev/models.dart';

abstract class BaseCartState extends Equatable {
  const BaseCartState();

  @override
  List<Object?> get props => [];
}

class EmptyCartState extends BaseCartState {
  const EmptyCartState();
}

class CartLoadingState extends BaseCartState {
  final String? message;

  const CartLoadingState({this.message});

  @override
  List<Object?> get props => [message];
}

class CurrentCartState extends BaseCartState {
  final Cart? _cart;

  const CurrentCartState(this._cart);

  Cart? get currentCart => _cart;

  @override
  List<Object?> get props => [_cart];
}

class CartErrorState extends BaseCartState {
  final String code;
  final String? message;

  const CartErrorState({required this.code, this.message});
  @override
  List<Object?> get props => [code, message];
}
