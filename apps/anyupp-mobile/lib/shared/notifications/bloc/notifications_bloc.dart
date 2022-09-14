import 'dart:async';

import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import '/core/core.dart';
import '/models.dart';
import '/shared/locale/extensions/locale_extension.dart';
import '/shared/notifications/notifications.dart';

part 'notifications_event.dart';
part 'notifications_state.dart';

class NotificationsBloc extends Bloc<NotificationsEvent, NotificationsState> {
  NotificationsBloc() : super(NotificationsInitial()) {
    on<ScheduleOrderRatingNotification>(onScheduleOrderRatingNotification);
  }

  FutureOr<void> onScheduleOrderRatingNotification(
    ScheduleOrderRatingNotification event,
    Emitter<NotificationsState> emit,
  ) {
    log.d('NotificationsBloc.scheduleNotification()');
    emit(NotificationSending());
    if (AppContext.context != null) {
      scheduleNotification(
          title: transEx(
            AppContext.context!,
            'rating.notification.title',
          ),
          message: transEx(
            AppContext.context!,
            'rating.notification.message',
          ),
          payload: NotificationPayload(
            NotificationPayloadType.RATE_ORDER,
            RateOrderPayload(
              orderId: event.orderId,
              ratingPolicy: event.ratingPolicy,
              tipPolicy: event.tipPolicy,
            ).toJson(),
          ),
          showDelay: event.showDelay);
      emit(NotificationScheduled());
    } else {
      emit(NotificationSendFailed());
    }
  }
}
