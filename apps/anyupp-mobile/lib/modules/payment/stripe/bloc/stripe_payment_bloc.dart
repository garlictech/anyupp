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

  StripePaymentBloc(this._paymentRepository, this._orderRepository): super(StripePaymentInitialState());

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
        await _paymentRepository.startExternalPayment(_orderRepository.cart, event.paymentMethod);
         yield StripeOperationSuccess();
      }

      // --- Handle start payment with existing card
      if (event is StartStripePaymentWithExistingCardEvent) {
         yield StripePaymentLoading();
         await _paymentRepository.startStripePaymentWithExistingCard(_orderRepository.cart, event.paymentMethodId);
         yield StripeOperationSuccess();
      }

       // --- Handle start payment without new card
      if (event is StartStripePaymentWithNewCardEvent) {
         yield StripePaymentLoading();
         await _paymentRepository.startStripePaymentWithNewCard(_orderRepository.cart, event.stripeCard, event.saveCard);
         yield StripeOperationSuccess();
      }

      // --- Reset state
      if (event is ResetStripePaymentState) {
        yield StripePaymentInitialState();
      }


    } on PlatformException catch (pe) {
      print('********* StripePaymentBloc.PlatformException()=$pe');
      getIt<ExceptionBloc>().add(ShowException(StripeException.fromPlatformException(pe)));
      yield StripeError(pe.code, pe.message);
    } on StripeException catch (le) {
      print('********* StripePaymentBloc.LoginException()=$le');
      getIt<ExceptionBloc>().add(ShowException(le));
      yield StripeError(le.code, le.message);
    } on Exception catch (e) {
      print('********* StripePaymentBloc.Exception()=$e');
      getIt<ExceptionBloc>().add(ShowException(StripeException.fromException(StripeException.UNKNOWN_ERROR, e)));
      yield StripeError(StripeException.UNKNOWN_ERROR, e.toString());
    }
  }

  @override
  Future<void> close() {
    return super.close();
  }
}
