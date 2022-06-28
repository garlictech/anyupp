import 'dart:async';
import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/graphql/generated/crud-api.graphql.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/orders/orders.dart';
import 'package:fa_prev/modules/rating_tipping/rating_tipping.dart';
import 'package:fa_prev/shared/notifications/notifications.dart';
import 'package:fa_prev/shared/utils/unit_utils.dart';

part 'rating_event.dart';
part 'rating_state.dart';

class RatingBloc extends Bloc<RatingEvent, RatingState> {
  final RatingRepository _repository;
  final OrderRepository _orderRepository;

  RatingBloc(this._repository, this._orderRepository) : super(RatingInitial()) {
    on<RateAndTipOrder>(_onRateAndTipOrder);
    on<RateOrder>(_onRateOrder);
    on<TipOrder>(_onTipOrder);
    on<ResetRating>((event, emit) => emit(RatingInitial()));
    on<InvalidTipAmount>(
        (event, emit) => emit(TipFailed(event.title, event.description)));
  }

  FutureOr<void> _onRateAndTipOrder(
      RateAndTipOrder event, Emitter<RatingState> emit) async {
    add(RateOrder(
      orderId: event.orderId,
      rating: event.rating,
    ));
    add(TipOrder(
      orderId: event.orderId,
      tipType: event.tipType,
      tipValue: event.tipValue,
    ));
  }

  FutureOr<void> _onRateOrder(
      RateOrder event, Emitter<RatingState> emit) async {
    emit(RatingLoading());
    try {
      // rate order
      bool success = await _repository.rateOrder(
        event.orderId,
        event.rating,
      );
      log.d('RatingBloc.RateOrder.done().success=$success');

      _refreshOrdersIfUnitSelected();

      Order? order = await _orderRepository.getOrder(event.orderId);
      if (order != null) {
        getIt<OrderRefreshBloc>().add(RefreshOrder(order));
      }
      await cancelNotification(
          notificationId: NotificationPayloadType.RATE_ORDER.index);
      emit(RatingSuccess());
    } on Exception catch (e) {
      emit(RatingFailed('RATING', e.toString()));
    }
  }

  FutureOr<void> _onTipOrder(TipOrder event, Emitter<RatingState> emit) async {
    emit(RatingLoading());
    try {
      Order? order = await _orderRepository.getOrder(event.orderId);
      if (order == null) {
        emit(RatingFailed('TIP', 'Order not found'));
        return;
      }

      // tip order
      bool success = false;
      if (event.tipType == TipType.none || event.tipType == null) {
        success = await _repository.noTipOrder(event.orderId);
      } else {
        success = await _repository.tipOrder(
          event.orderId,
          event.tipType,
          event.tipValue,
        );
      }
      log.d('RatingBloc.TipOrder.done().success=$success');

      _refreshOrdersIfUnitSelected();

      order = order.copyWith(
        tip: Tip(
          event.tipType ?? TipType.none,
          event.tipValue ?? 0.0,
        ),
      );
      getIt<OrderRefreshBloc>().add(RefreshOrder(order));
      await cancelNotification(
          notificationId: NotificationPayloadType.RATE_ORDER.index);
      emit(RatingSuccess());
    } on Exception catch (e) {
      emit(RatingFailed('RATING', e.toString()));
    }
  }

  void _refreshOrdersIfUnitSelected() {
    GeoUnit? unit = currentUnit;
    if (unit != null) {
      getIt<OrderBloc>().add(StartGetOrderListSubscription());
    }
  }
}
