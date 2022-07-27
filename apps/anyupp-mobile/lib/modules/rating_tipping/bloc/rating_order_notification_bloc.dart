import 'dart:async';
import 'dart:math';

import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import '/core/core.dart';
import '/graphql/generated/crud-api.dart';
import '/models/Order.dart';
import '/modules/orders/orders.dart';
import '/modules/rating_tipping/rating_tipping.dart';
import '/shared/notifications/notifications.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../main/bloc/main_navigation_bloc.dart';
import '../../main/bloc/main_navigation_event.dart';

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
    // log.d('RatingOrderNotificationBloc.start()=${event.orders.length}');

    SharedPreferences prefs = await SharedPreferences.getInstance();

    event.orders.forEach((order) async {
      // log.d('RatingOrderNotificationBloc.order=${order.id}');
      var now = DateTime.now();

      bool schedule = await isNeedScheduleNotification(order, now, prefs);

      if (schedule) {
        var delay = calculateNotificationScheduleDelay(order, now);

        // log.d('RatingOrderNotificationBloc.scheduling[$delay]=${order.id}');
        getIt<NotificationsBloc>().add(ScheduleOrderRatingNotification(
          orderId: order.id,
          ratingPolicy: order
              .ratingPolicies![Random().nextInt(order.ratingPolicies!.length)],
          tipPolicy: order.paymentMode.method != PaymentMethod.inapp
              ? null
              : order.tipPolicy,
          showDelay: delay,
        ));
        await prefs.setBool('rating_schedule_${order.id}', true);
      }
    });

    emit(RatingOrderNotificationInitial());
  }

  FutureOr<void> _onShowRatingFromNotification(
    ShowRatingFromNotification event,
    Emitter<RatingOrderNotificationState> emit,
  ) async {
    log.d('RatingOrderNotificationBloc._onShowRatingFromNotification=$event');
    try {
      Order? order = await orderRepository.getOrder(event.payload.orderId);
      if (order == null) {
        emit(RatingOrderNotificationInitial());
        return;
      }

      bool isRated = order.rating != null || event.payload.ratingPolicy == null;
      bool isTipped = order.tip != null || event.payload.tipPolicy == null;

      if (isRated && isTipped) {
        // Already rated and tipped
        log.d('RatingOrderNotificationBloc.Already rated and tipped.');
        emit(RatingOrderNotificationInitial());
        return;
      }

      emit(RatingOrderNotificationInitial());

      log.d('RatingOrderNotificationBloc.Showing screen: ${event.payload}');
      if (order.transaction != null) {
        BuildContext? context = AppContext.context;
        getIt<MainNavigationBloc>().add(DoMainNavigation(pageIndex: 2));
        if (context != null) {
          await showModalBottomSheet(
            context: context,
            isDismissible: true,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.only(
                topLeft: Radius.circular(16.0),
                topRight: Radius.circular(16.0),
              ),
            ),
            enableDrag: true,
            isScrollControlled: true,
            elevation: 4.0,
            backgroundColor: Colors.transparent,
            builder: (context) {
              return Container(
                height: MediaQuery.of(context).size.height * .9,
                child: RatingAndTippingModal(
                  transaction: order.transaction!,
                  ratingPolicy: isRated ? null : event.payload.ratingPolicy,
                  tipPolicy: isTipped ? null : event.payload.tipPolicy,
                ),
              );
            },
          );
          //        Nav.to(RatingAndTippingModal(

          // ));

        }
      }
    } on Exception catch (e) {
      log.e('RatingOrderNotificationBloc.onError=$e');
    }
  }
}
