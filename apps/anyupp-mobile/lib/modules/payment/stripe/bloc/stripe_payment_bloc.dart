import 'dart:async';

import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/orders/orders.dart';
import 'package:fa_prev/modules/payment/stripe/stripe.dart';
import 'package:fa_prev/shared/exception.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class StripePaymentBloc extends Bloc<StripePaymentEvent, StripePaymentState> {
  final StripePaymentRepository _paymentRepository;
  final OrderRepository _orderRepository;

  StripePaymentBloc(this._paymentRepository, this._orderRepository) : super(StripePaymentInitialState());

  @override
  Stream<StripePaymentState> mapEventToState(StripePaymentEvent event) async* {
    print('StripePaymentBloc.event=$event');
    try {
      // --- Handle payment method list
      if (event is PaymentMethodListEvent) {
        yield StripePaymentLoading();
        List<StripePaymentMethod> methods = await _paymentRepository.getPaymentMethods();
        // List<GetCustomerStripeCards$Query$StripeCard> methods = await _paymentRepository.getPaymentMethods();
        yield StripePaymentMethodsList(methods);
      }

      // --- Handle start payment with external method
      if (event is StartExternalPaymentEvent) {
        yield StripePaymentLoading();
        if (event.orderId != null) {
           await _paymentRepository.startOrderExternalPayment(
            event.orderId,
            event.paymentMode,
            event.invoiceAddress,
          );
        } else {
          await _paymentRepository.startExternalPayment(
            _orderRepository.cart,
            event.paymentMode,
            event.invoiceAddress,
          );
        }

        yield StripeOperationSuccess();
      }

      // --- Handle start payment with existing card
      if (event is StartStripePaymentWithExistingCardEvent) {
        yield StripePaymentLoading();
        if (event.orderId != null) {
          await _paymentRepository.startOrderStripePaymentWithExistingCard(
            event.orderId,
            event.paymentMethodId,
            event.invoiceAddress,
          );
        } else {
          await _paymentRepository.startStripePaymentWithExistingCard(
            _orderRepository.cart,
            event.paymentMethodId,
            event.invoiceAddress,
          );
        }
        yield StripeOperationSuccess();
      }

      // --- Handle start payment without new card
      if (event is StartStripePaymentWithNewCardEvent) {
        yield StripePaymentLoading();
        if (event.orderId != null) {
          await _paymentRepository.startOrderStripePaymentWithNewCard(
            event.orderId,
            event.stripeCard,
            event.invoiceAddress,
            event.saveCard,
          );
        } else {
          await _paymentRepository.startStripePaymentWithNewCard(
            _orderRepository.cart,
            event.stripeCard,
            event.invoiceAddress,
            event.saveCard,
          );
        }
        yield StripeOperationSuccess();
      }

      // --- Reset state
      if (event is ResetStripePaymentState) {
        yield StripePaymentInitialState();
      }


      // --- Create card
      if (event is CreateStripeCardEvent) {
        yield StripePaymentLoading();
        StripePaymentMethod result = await _paymentRepository.createStripeCard(event.stripeCard, event.name);
        print('StripePaymentBloc.CreateStripeCard.result=$result');
        yield StripeCardCreated();
      }

      // --- Update card
      if (event is UpdateStripeCardEvent) {
        yield StripePaymentLoading();
        StripePaymentMethod result = await _paymentRepository.updateStripeCard(event.stripeCardId, event.name);
        print('StripePaymentBloc.UpdateStripeCard.result=$result');
        yield StripeOperationSuccess();
      }

      // --- Delete card
      if (event is DeleteStripeCardEvent) {
        yield StripePaymentLoading();
        bool result = await _paymentRepository.deleteStripeCard(event.stripeCardId);
        print('StripePaymentBloc.DeleteStripeCard.result=$result');
        yield StripeOperationSuccess();
        getIt<StripePaymentBloc>().add(PaymentMethodListEvent());
      }

    } on PlatformException catch (pe) {
      print('********* StripePaymentBloc.ExceptionBloc.PlatformException=$pe');
      getIt<ExceptionBloc>().add(ShowException(StripeException.fromPlatformException(pe)));
      yield StripeError(pe.code, pe.message);
    } on StripeException catch (le) {
      print('********* StripePaymentBloc.ExceptionBloc.StripeException=$le');
      getIt<ExceptionBloc>().add(ShowException(le));
      yield StripeError(le.code, le.message);
    } on Exception catch (e) {
      print('********* StripePaymentBloc.ExceptionBloc.Exception=$e');
      getIt<ExceptionBloc>().add(ShowException(StripeException.fromException(StripeException.UNKNOWN_ERROR, e)));
      yield StripeError(StripeException.UNKNOWN_ERROR, e.toString());
    }
  }

  @override
  Future<void> close() {
    return super.close();
  }
}
