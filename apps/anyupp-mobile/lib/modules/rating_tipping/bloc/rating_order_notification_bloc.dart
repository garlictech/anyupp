import 'dart:async';

import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:fa_prev/core/dependency_indjection/dependency_injection.dart';
import 'package:fa_prev/models/Order.dart';
import 'package:fa_prev/modules/orders/orders.dart';
import 'package:fa_prev/modules/rating_tipping/rating_tipping.dart';
import 'package:fa_prev/shared/nav.dart';
import 'package:fa_prev/shared/notifications/notifications.dart';
import 'package:shared_preferences/shared_preferences.dart';

part 'rating_order_notification_event.dart';
part 'rating_order_notification_state.dart';

class RatingOrderNotificationBloc
    extends Bloc<RatingOrderNotificationEvent, RatingOrderNotificationState> {
  final OrderRepository orderRepository;

  RatingOrderNotificationBloc(this.orderRepository)
      : super(RatingOrderNotificationInitial()) {
    on<CheckAndScheduleOrderRatingNotifications>(
        _onCheckAndScheduleOrderRatingNotifications);
    on<ShowRatingFromNotification>(_onShowRatingFromNotification);
  }

  FutureOr<void> _onCheckAndScheduleOrderRatingNotifications(
    CheckAndScheduleOrderRatingNotifications event,
    Emitter<RatingOrderNotificationState> emit,
  ) async {
    emit(CheckingRatingNotifications());
    print('RatingOrderNotificationBloc.start()=${event.orders.length}');

    SharedPreferences prefs = await SharedPreferences.getInstance();

    event.orders.forEach((order) async {
      // print('RatingOrderNotificationBloc.order=${order.id}');
      var now = DateTime.now();

      bool schedule = await isNeedScheduleNotification(order, now, prefs);

      if (schedule) {
        var delay = calculateNotificationScheduleDelay(order, now);

        // print('RatingOrderNotificationBloc.scheduling[$delay]=${order.id}');
        getIt<NotificationsBloc>().add(ScheduleOrderRatingNotification(
          orderId: order.id,
          ratingPolicy: order.ratingPolicies![0],
          tipPolicy: order.tipPolicy,
          showDelay: delay,
        ));
        await prefs.setBool('rating_schedule_${order.id}', true);
        ;
      }
    });

    emit(RatingOrderNotificationInitial());
  }

  FutureOr<void> _onShowRatingFromNotification(
    ShowRatingFromNotification event,
    Emitter<RatingOrderNotificationState> emit,
  ) async {
    print('RatingOrderNotificationBloc._onShowRatingFromNotification=$event');
    try {
      Order? order = await orderRepository.getOrder(event.payload.orderId);
      if (order == null) {
        emit(RatingOrderNotificationInitial());
        return;
      }

      bool isRated = order.rating != null;
      bool isTipped = order.tip != null;

      if (isRated && isTipped) {
        // Already rated and tipped
        print('RatingOrderNotificationBloc.Already rated and tipped.');
        emit(RatingOrderNotificationInitial());
        return;
      }

      emit(RatingOrderNotificationInitial());

      print('RatingOrderNotificationBloc.Showing screen: ${event.payload}');
      if (order.transaction != null) {
        Nav.to(RatingAndTippingScreen(
          transaction: order.transaction!,
          ratingPolicy: isRated ? null : event.payload.ratingPolicy,
          tipPolicy: isTipped ? null : event.payload.tipPolicy,
        ));
      }
    } on Exception catch (e) {
      print('RatingOrderNotificationBloc.onError=$e');
    }
  }
}
