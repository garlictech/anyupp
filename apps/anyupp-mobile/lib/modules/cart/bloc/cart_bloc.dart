import 'package:fa_prev/graphql/graphql.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/cart/bloc/cart_event.dart';
import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/modules/orders/orders.dart';
import 'package:fa_prev/shared/exception.dart';
import 'package:fa_prev/shared/utils/place_preferences.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'package:fa_prev/modules/cart/cart.dart';

class CartBloc extends Bloc<BaseCartAction, BaseCartState> {
  CartRepository _cartRepository;
  OrderRepository _orderRepository;

  CartBloc(this._cartRepository, this._orderRepository) : super(EmptyCartState());

  @override
  Stream<BaseCartState> mapEventToState(BaseCartAction action) async* {
    try {
      if (action is GetCurrentCartAction) {
        yield CartLoadingState();
        Cart? cart = await _cartRepository.getCurrentCart(action.unitId);
        yield CurrentCartState(cart);
      }

      if (action is AddProductToCartAction) {
        yield CartLoadingState();
        // _currentCart.addProductToCart(action.product, action.variant);
        Cart? cart = await _cartRepository.addProductToCart(action.unitId, action.order);
        yield CurrentCartState(cart);
      }

      if (action is RemoveProductFromCartAction) {
        yield CartLoadingState();
        Cart? cart = await _cartRepository.removeProductFromCart(action.unitId, action.order);
        yield CurrentCartState(cart);
      }

      if (action is ClearPlaceInCart) {
        yield CartLoadingState();
        Cart? cart = await _cartRepository.clearPlaceInCart(action.unit);
        await clearPlacePref();
        yield CurrentCartState(cart);
      }

      if (action is CreateAndSendOrder) {
        yield CartLoadingState();
        await _cartRepository.createAndSendOrderFromCart();
        yield EmptyCartState();
      }

      if (action is UpdatePlaceInCartAction) {
        yield CartLoadingState();
        Cart? cart = await _cartRepository.updatePlaceInCart(action.unit, action.place);
        yield CurrentCartState(cart);
      }

      if (action is ClearCartAction) {
        yield CartLoadingState();
        await _cartRepository.clearCart();
        yield EmptyCartState();
      }
      if (action is AddInvoiceInfo) {
        await _orderRepository.addInvoiceInfo(action.invoiceInfo);
      }
    } on GraphQLException catch (e) {
      print('CartBloc.ExceptionBloc.GraphQLException=$e');
      getIt<ExceptionBloc>().add(ShowException(e));
      yield CartErrorState(code: e.code, message: e.message);
    } on PlatformException catch (e) {
      print('CartBloc.ExceptionBloc.PlatformException=$e');
      getIt<ExceptionBloc>().add(ShowException(CartException.fromPlatformException(e)));
      yield CartErrorState(code: e.code, message: e.message);
      // TODO: we don't use thie serror state
      // TODO: we don't use cart states either but a live stream in the cartScreen
    } on Exception catch (e) {
      print('CartBloc.ExceptionBloc.Exception=$e');
      getIt<ExceptionBloc>().add(ShowException(CartException.fromException(CartException.UNKNOWN_ERROR, e)));
      yield CartErrorState(code: CartException.UNKNOWN_ERROR, message: e.toString());
    }
  }
}
