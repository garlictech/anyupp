import 'dart:async';

import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/cart/cart.dart';
import 'package:fa_prev/modules/payment/stripe/stripe.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class StripePaymentBloc extends Bloc<StripePaymentEvent, StripePaymentState> {
  final StripePaymentRepository _paymentRepository;
  final CartRepository _cartRepository;

  StripePaymentBloc(this._paymentRepository, this._cartRepository)
      : super(StripePaymentInitialState()) {
    on<PaymentMethodListEvent>(_onPaymentMethodListEvent);
    on<StartExternalPaymentEvent>(_onStartExternalPaymentEvent);
    on<StartStripePaymentWithExistingCardEvent>(_onStartPaymentExistingCard);
    on<StartStripePaymentWithNewCardEvent>(_onStartPaymentWithNewCard);
    on<ResetStripePaymentState>(_onResetStripePaymentState);
    on<CreateStripeCardEvent>(_onCreateStripeCardEvent);
    on<UpdateStripeCardEvent>(_onUpdateStripeCardEvent);
    on<DeleteStripeCardEvent>(_onDeleteStripeCardEvent);
  }

  FutureOr<void> _handleError(Exception e, Emitter<StripePaymentState> emit) {
    if (e is StripeException) {
      emit(StripeError(e.subCode ?? StripeException.UNKNOWN_ERROR, e.code));
    } else if (e is AppException) {
      emit(StripeError(e.code, e.message ?? ''));
    } else {
      emit(StripeError(StripeException.UNKNOWN_ERROR, e.toString()));
    }
  }

  FutureOr<void> _onPaymentMethodListEvent(
      PaymentMethodListEvent event, Emitter<StripePaymentState> emit) async {
    try {
      emit(StripePaymentLoading());
      List<StripePaymentMethod> methods =
          await _paymentRepository.getPaymentMethods();
      emit(StripePaymentMethodsList(methods));
    } on Exception catch (e) {
      _handleError(e, emit);
    }
  }

  FutureOr<void> _onStartExternalPaymentEvent(
      StartExternalPaymentEvent event, Emitter<StripePaymentState> emit) async {
    try {
      emit(StripePaymentLoading());
      if (event.orderId != null) {
        await _paymentRepository.startOrderExternalPayment(
          event.orderId!,
          event.paymentMode,
          event.invoiceAddress,
        );
      } else {
        await _paymentRepository.startExternalPayment(
          _cartRepository.cart!,
          event.paymentMode,
          event.invoiceAddress,
        );
      }

      emit(StripeOperationSuccess());
    } on Exception catch (e) {
      _handleError(e, emit);
    }
  }

  FutureOr<void> _onStartPaymentExistingCard(
      StartStripePaymentWithExistingCardEvent event,
      Emitter<StripePaymentState> emit) async {
    try {
      emit(StripePaymentLoading());
      if (event.orderId != null) {
        await _paymentRepository.startOrderStripePaymentWithExistingCard(
          event.orderId!,
          event.paymentMethodId,
          event.invoiceAddress,
        );
      } else {
        await _paymentRepository.startStripePaymentWithExistingCard(
          _cartRepository.cart!,
          event.paymentMethodId,
          event.invoiceAddress,
        );
      }
      emit(StripeOperationSuccess());
    } on Exception catch (e) {
      _handleError(e, emit);
    }
  }

  FutureOr<void> _onStartPaymentWithNewCard(
      StartStripePaymentWithNewCardEvent event,
      Emitter<StripePaymentState> emit) async {
    try {
      emit(StripePaymentLoading());
      if (event.orderId != null) {
        await _paymentRepository.startOrderStripePaymentWithNewCard(
          event.orderId!,
          event.stripeCard,
          event.invoiceAddress,
          event.saveCard,
        );
      } else {
        await _paymentRepository.startStripePaymentWithNewCard(
          _cartRepository.cart!,
          event.stripeCard,
          event.invoiceAddress,
          event.saveCard,
        );
      }
      emit(StripeOperationSuccess());
    } on Exception catch (e) {
      _handleError(e, emit);
    }
  }

  FutureOr<void> _onResetStripePaymentState(
      ResetStripePaymentState event, Emitter<StripePaymentState> emit) {
    emit(StripePaymentInitialState());
  }

  FutureOr<void> _onCreateStripeCardEvent(
      CreateStripeCardEvent event, Emitter<StripePaymentState> emit) async {
    try {
      emit(StripePaymentLoading());
      // throw StripeException(code: StripeException.CODE, message: 'Test error');
      StripePaymentMethod result = await _paymentRepository.createStripeCard(
          event.stripeCard, event.name);
      log.d('StripePaymentBloc.CreateStripeCard.result=$result');
      emit(StripeCardCreated());
      getIt<StripePaymentBloc>().add(PaymentMethodListEvent());
    } on Exception catch (_) {
      _handleError(
          StripeException(
              code: StripeException.CODE,
              subCode: StripeException.CARD_CREATE_ERROR),
          emit);
    }
  }

  FutureOr<void> _onUpdateStripeCardEvent(
      UpdateStripeCardEvent event, Emitter<StripePaymentState> emit) async {
    try {
      emit(StripePaymentLoading());
      StripePaymentMethod result = await _paymentRepository.updateStripeCard(
          event.stripeCardId, event.name);
      log.d('StripePaymentBloc.UpdateStripeCard.result=$result');
      emit(StripeOperationSuccess());
    } on Exception catch (e) {
      _handleError(e, emit);
    }
  }

  FutureOr<void> _onDeleteStripeCardEvent(
      DeleteStripeCardEvent event, Emitter<StripePaymentState> emit) async {
    try {
      emit(StripePaymentLoading());
      bool result =
          await _paymentRepository.deleteStripeCard(event.stripeCardId);
      log.d('StripePaymentBloc.DeleteStripeCard.result=$result');
      getIt<StripePaymentBloc>().add(PaymentMethodListEvent());
    } on Exception catch (_) {
      _handleError(
          StripeException(
              code: StripeException.CODE,
              subCode: StripeException.CARD_DELETE_ERROR),
          emit);
    }
  }
}
