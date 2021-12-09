import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/graphql/graphql.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/cart/bloc/cart_event.dart';
import 'package:fa_prev/modules/cart/cart.dart';
import 'package:fa_prev/modules/orders/orders.dart';
import 'package:fa_prev/modules/takeaway/takeaway.dart';
import 'package:fa_prev/shared/exception.dart';
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
  ) : super(EmptyCartState());

  @override
  Stream<BaseCartState> mapEventToState(BaseCartAction action) async* {
    try {
      if (action is GetCurrentCartAction) {
        yield CartLoadingState();
        Cart? cart = await _cartRepository.getCurrentCart(action.unitId);
        yield CurrentCartState(cart);
      }

      if (action is AddProductToCartAction) {
        yield CartLoadingState(
            message: 'add', productId: action.order.productId);
        TakeAwayState takeAwayState = _takeAwayBloc.state;

        assert(takeAwayState is ServingModeSelectedState == true);

        if (takeAwayState is ServingModeSelectedState) {
          Cart? cart = await _cartRepository.addProductToCart(
              action.unitId, action.order, takeAwayState.servingMode);
          yield CurrentCartState(cart);
        }
      }

      if (action is RemoveProductFromCartAction) {
        yield CartLoadingState(
            message: 'remove', productId: action.order.productId);
        Cart? cart = await _cartRepository.removeProductFromCart(
            action.unitId, action.order);
        yield CurrentCartState(cart);
      }

      if (action is ClearPlaceInCart) {
        yield CartLoadingState();
        Cart? cart = await _cartRepository.clearPlaceInCart(action.unit);
        yield CurrentCartState(cart);
      }

      if (action is CreateAndSendOrder) {
        yield CartLoadingState();
        await _cartRepository.createAndSendOrderFromCart();
        yield EmptyCartState();
      }

      if (action is UpdatePlaceInCartAction) {
        yield CartLoadingState();
        Cart? cart =
            await _cartRepository.updatePlaceInCart(action.unit, action.place);
        yield CurrentCartState(cart);
      }

      if (action is SetCartServingMode) {
        yield CartLoadingState();
        Cart? cart =
            await _cartRepository.setServingMode(action.unitId, action.mode);
        yield CurrentCartState(cart);
      }

      if (action is ResetCartInMemory) {
        yield CartLoadingState();
        _cartRepository.resetCartInMemory();
        yield EmptyCartState();
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
    } on PlatformException catch (e) {
      print('CartBloc.ExceptionBloc.PlatformException=$e');
      getIt<ExceptionBloc>()
          .add(ShowException(CartException.fromPlatformException(e)));
    } on Exception catch (e) {
      print('CartBloc.ExceptionBloc.Exception=$e');
      getIt<ExceptionBloc>().add(ShowException(
          CartException.fromException(CartException.UNKNOWN_ERROR, e)));
    }
  }
}
