import 'package:fa_prev/modules/cart/bloc/cart_event.dart';
import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/shared/exception.dart';
import 'package:fa_prev/shared/utils/place_preferences.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'package:fa_prev/modules/cart/cart.dart';

class CartBloc extends Bloc<BaseCartAction, BaseCartState> {
  CartRepository _cartRepository;

  CartBloc(this._cartRepository) : super(EmptyCartState());

  @override
  Stream<BaseCartState> mapEventToState(BaseCartAction action) async* {
    try {
      if (action is GetCurrentCartAction) {
        Cart cart = await _cartRepository.getCurrentCart(action.chainId, action.unitId);
        yield CurrentCartState(cart);
      }

      if (action is AddProductToCartAction) {
        // _currentCart.addProductToCart(action.product, action.variant);
        Cart cart = await _cartRepository.addProductToCart(action.unit, action.product, action.variant);
        yield CurrentCartState(cart);
      }

      if (action is RemoveProductFromCartAction) {
        Cart cart =
            await _cartRepository.removeProductFromCart(action.chainId, action.unitId, action.product, action.variant);
        yield CurrentCartState(cart);
      }

      if (action is ClearPlaceInCart) {
        Cart cart = await _cartRepository.clearPlaceInCart(action.unit);
        await clearPlacePref();
        yield CurrentCartState(cart);
      }

      if (action is RemoveOrderFromCartAction) {
        Cart cart = await _cartRepository.removeOrderFromCart(action.chainId, action.unitId, action.order);
        yield CurrentCartState(cart);
      }

      if (action is CreateAndSendOrder) {
        yield CartLoadingState();
        await _cartRepository.createAndSendOrderFromCart(action.unit, action.paymentMethod);
        yield EmptyCartState();
      }

      if (action is UpdatePlaceInCartAction) {
        Cart cart = await _cartRepository.updatePlaceInCart(action.unit);
        yield CurrentCartState(cart);
      }

      if (action is ClearCartAction) {
        await _cartRepository.clearCart(action.unit);
        yield EmptyCartState();
      }
    } on PlatformException catch (e) {
      getIt<ExceptionBloc>().add(ShowException(CartException.fromPlatformException(e)));
      yield CartErrorState(code: e.code, message: e.message);
      // TODO: we don't use thie serror state
      // TODO: we don't use cart states either but a live stream in the cartScreen
    } on Exception catch (e) {
      getIt<ExceptionBloc>().add(ShowException(CartException.fromException(CartException.UNKNOWN_ERROR, e)));
      yield CartErrorState(code: CartException.UNKNOWN_ERROR, message: e.toString());
    }
  }
}
