part of 'notifications_bloc.dart';

abstract class NotificationsEvent extends Equatable {
  const NotificationsEvent();

  @override
  List<Object> get props => [];
}

class ScheduleOrderRatingNotification extends NotificationsEvent {
  final String orderId;
  final RatingPolicy? ratingPolicy;
  final TipPolicy? tipPolicy;
  final Duration showDelay;

  const ScheduleOrderRatingNotification({
    required this.orderId,
    this.ratingPolicy,
    this.tipPolicy,
    this.showDelay = const Duration(minutes: 10),
  });

  @override
  List<Object> get props => [orderId];
}

class CheckOrderRatingNotifications extends NotificationsEvent {}
