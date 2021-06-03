import 'package:equatable/equatable.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/models/InvoiceInfo.dart';
import 'package:flutter/foundation.dart';

@immutable
abstract class BaseCartAction extends Equatable {
  const BaseCartAction();

  @override
  List<Object> get props => [];
}

class GetCurrentCartAction extends BaseCartAction {
  final String chainId;
  final String unitId;
  const GetCurrentCartAction(this.chainId, this.unitId);

  @override
  List<Object> get props => [chainId, unitId];
}

class AddProductToCartAction extends BaseCartAction {
  final GeoUnit unit;
  final OrderItem order;

  const AddProductToCartAction(this.unit, this.order);

  @override
  List<Object> get props => [unit, order];
}

class RemoveProductFromCartAction extends BaseCartAction {
  final String chainId;
  final String unitId;
  final OrderItem order;

  const RemoveProductFromCartAction(this.chainId, this.unitId, this.order);

  @override
  List<Object> get props => [chainId, unitId, order];
}

class UpdateProductInCartAction extends BaseCartAction {
  final String chainId;
  final String unitId;
  final GeneratedProduct product;
  final ProductVariant variant;
  final int quantity;

  const UpdateProductInCartAction(
      this.chainId, this.unitId, this.product, this.variant, this.quantity);

  @override
  List<Object> get props => [chainId, unitId, product, variant, quantity];
}

class RemoveOrderFromCartAction extends BaseCartAction {
  final OrderItem order;
  final String chainId;
  final String unitId;

  const RemoveOrderFromCartAction(this.chainId, this.unitId, this.order);

  @override
  List<Object> get props => [chainId, unitId, order];
}

class ClearCartAction extends BaseCartAction {
  final User user;
  final GeoUnit unit;

  const ClearCartAction(this.user, this.unit);

  @override
  List<Object> get props => [unit, user];
}

class ClearPlaceInCart extends BaseCartAction {
  final GeoUnit unit;

  const ClearPlaceInCart(this.unit);

  @override
  List<Object> get props => [unit];
}

class UpdatePlaceInCartAction extends BaseCartAction {
  final GeoUnit unit;

  const UpdatePlaceInCartAction(this.unit);

  @override
  List<Object> get props => [unit];
}

class CreateAndSendOrder extends BaseCartAction {
  final GeoUnit unit;
  final String paymentMethod;

  const CreateAndSendOrder(this.unit, this.paymentMethod);

  @override
  List<Object> get props => [unit, paymentMethod];
}

class AddInvoiceInfo extends BaseCartAction {
  final InvoiceInfo invoiceInfo;

  const AddInvoiceInfo(this.invoiceInfo);

  @override
  List<Object> get props => [invoiceInfo];
}

class SetPaymentMode extends BaseCartAction {
  final GeoUnit unit;
  final PaymentMode paymentMode;

  const SetPaymentMode(this.unit, this.paymentMode);

  @override
  List<Object> get props => [unit, paymentMode];
}
