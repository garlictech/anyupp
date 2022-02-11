part of 'rating_order_notification_bloc.dart';

abstract class RatingOrderNotificationEvent extends Equatable {
  const RatingOrderNotificationEvent();

  @override
  List<Object> get props => [];
}

class CheckAndScheduleOrderRatingNotifications
    extends RatingOrderNotificationEvent {
  final List<Order> orders;

  const CheckAndScheduleOrderRatingNotifications(this.orders);

  @override
  List<Object> get props => [orders];
}

class ShowRatingFromNotification extends RatingOrderNotificationEvent {
  final RateOrderPayload payload;

  const ShowRatingFromNotification(this.payload);

  @override
  List<Object> get props => [payload];
}
