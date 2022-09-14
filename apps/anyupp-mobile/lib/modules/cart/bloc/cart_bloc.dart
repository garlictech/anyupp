import 'dart:async';

import '/core/core.dart';
import '/graphql/graphql.dart';
import '/models.dart';
import '/modules/cart/cart.dart';
import '/modules/orders/orders.dart';
import '/modules/takeaway/takeaway.dart';
import '/shared/exception.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class CartBloc extends Bloc<BaseCartAction, BaseCartState> {
  CartRepository _cartRepository;
  OrderRepository _orderRepository;
  TakeAwayBloc _takeAwayBloc;

  CartBloc(
    this._cartRepository,
    this._orderRepository,
    this._takeAwayBloc,
  ) : super(EmptyCartState()) {
    on<GetCurrentCartAction>(_onGetCurrentCartAction);
    on<AddProductToCartAction>(_onAddProductToCartAction);
    on<RemoveProductFromCartAction>(_onRemoveProductFromCartAction);
    on<ClearPlaceInCart>(_onClearPlaceInCart);
    on<CreateAndSendOrder>(_onCreateAndSendOrder);
    on<UpdatePlaceInCartAction>(_onUpdatePlaceInCartAction);
    on<SetCartServingMode>(_onSetCartServingMode);
    on<ResetCartInMemory>(_onResetCartInMemory);
    on<ClearCartAction>(_onClearCartAction);
    on<AddInvoiceInfo>(_onAddInvoiceInfo);
  }

  FutureOr<void> _handleError(Exception e, Emitter<BaseCartState> emit) {
    if (e is GraphQLException) {
      getIt<ExceptionBloc>().add(ShowException(e));
      emit(CartErrorState(code: e.code, message: e.message));
    } else if (e is PlatformException) {
      getIt<ExceptionBloc>().add(
        ShowException(CartException.fromPlatformException(e)),
      );
      emit(CartErrorState(code: e.code, message: e.message));
    } else {
      getIt<ExceptionBloc>().add(ShowException(
        CartException.fromException(CartException.UNKNOWN_ERROR, e),
      ));
      // emit(CartErrorState(
      //   code: CartException.UNKNOWN_ERROR,
      //   message: e.toString(),
      // ));
    }
  }

  FutureOr<void> _onGetCurrentCartAction(
    GetCurrentCartAction event,
    Emitter<BaseCartState> emit,
  ) async {
    try {
      emit(CartLoadingState());
      Cart? cart = await _cartRepository.getCurrentCart(event.unitId);
      emit(CurrentCartState(cart));
    } on Exception catch (e) {
      _handleError(e, emit);
    }
  }

  FutureOr<void> _onAddProductToCartAction(
    AddProductToCartAction event,
    Emitter<BaseCartState> emit,
  ) async {
    try {
      emit(CartLoadingState(
        message: 'add',
        productId: event.order.productId,
      ));
      TakeAwayState takeAwayState = _takeAwayBloc.state;

      assert(takeAwayState is ServingModeSelectedState == true);

      if (takeAwayState is ServingModeSelectedState) {
        Cart? cart = await _cartRepository.addProductToCart(
          event.unit,
          event.order,
          takeAwayState.servingMode,
        );
        emit(CurrentCartState(cart));
      }
    } on Exception catch (e) {
      _handleError(e, emit);
    }
  }

  FutureOr<void> _onRemoveProductFromCartAction(
    RemoveProductFromCartAction event,
    Emitter<BaseCartState> emit,
  ) async {
    try {
      emit(CartLoadingState(
        message: 'remove',
        productId: event.order.productId,
      ));
      Cart? cart = await _cartRepository.removeProductFromCart(
        event.unitId,
        event.order,
      );
      emit(CurrentCartState(cart));
    } on Exception catch (e) {
      _handleError(e, emit);
    }
  }

  FutureOr<void> _onClearPlaceInCart(
    ClearPlaceInCart event,
    Emitter<BaseCartState> emit,
  ) async {
    try {
      emit(CartLoadingState());
      Cart? cart = await _cartRepository.clearPlaceInCart(event.unit);
      emit(CurrentCartState(cart));
    } on Exception catch (e) {
      _handleError(e, emit);
    }
  }

  FutureOr<void> _onCreateAndSendOrder(
    CreateAndSendOrder event,
    Emitter<BaseCartState> emit,
  ) async {
    try {
      emit(CartLoadingState());
      await _cartRepository.createAndSendOrderFromCart();
      emit(EmptyCartState());
    } on Exception catch (e) {
      _handleError(e, emit);
    }
  }

  FutureOr<void> _onUpdatePlaceInCartAction(
    UpdatePlaceInCartAction event,
    Emitter<BaseCartState> emit,
  ) async {
    try {
      emit(CartLoadingState());
      Cart? cart = await _cartRepository.updatePlaceInCart(
        event.unit,
        event.place,
      );
      emit(CurrentCartState(cart));
    } on Exception catch (e) {
      _handleError(e, emit);
    }
  }

  FutureOr<void> _onSetCartServingMode(
    SetCartServingMode event,
    Emitter<BaseCartState> emit,
  ) async {
    try {
      emit(CartLoadingState());
      Cart? cart = await _cartRepository.setServingMode(
        event.unitId,
        event.mode,
      );
      emit(CurrentCartState(cart));
    } on Exception catch (e) {
      _handleError(e, emit);
    }
  }

  FutureOr<void> _onResetCartInMemory(
    ResetCartInMemory event,
    Emitter<BaseCartState> emit,
  ) async {
    try {
      emit(CartLoadingState());
      _cartRepository.resetCartInMemory();
      emit(EmptyCartState());
    } on Exception catch (e) {
      _handleError(e, emit);
    }
  }

  FutureOr<void> _onClearCartAction(
    ClearCartAction event,
    Emitter<BaseCartState> emit,
  ) async {
    try {
      emit(CartLoadingState());
      await _cartRepository.clearCart();
      emit(EmptyCartState());
    } on Exception catch (e) {
      _handleError(e, emit);
    }
  }

  FutureOr<void> _onAddInvoiceInfo(
    AddInvoiceInfo event,
    Emitter<BaseCartState> emit,
  ) async {
    try {
      await _orderRepository.addInvoiceInfo(event.invoiceInfo);
    } on Exception catch (e) {
      _handleError(e, emit);
    }
  }
}
