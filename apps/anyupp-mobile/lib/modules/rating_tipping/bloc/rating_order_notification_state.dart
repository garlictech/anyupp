part of 'rating_order_notification_bloc.dart';

abstract class RatingOrderNotificationState extends Equatable {
  const RatingOrderNotificationState();

  @override
  List<Object> get props => [];
}

class RatingOrderNotificationInitial extends RatingOrderNotificationState {}

class CheckingRatingNotifications extends RatingOrderNotificationState {}
