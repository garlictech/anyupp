import 'package:equatable/equatable.dart';
import '/models.dart';

abstract class UserDetailsState extends Equatable {
  const UserDetailsState();

  @override
  List<Object?> get props => [];
}

class NoUserDetailsState extends UserDetailsState {}

class UserDetailsLoadingState extends UserDetailsState {}

class UserDetailsLoadingErrorState extends UserDetailsState {}

class UserDetailsLoaded extends UserDetailsState {
  final User userDetails;

  UserDetailsLoaded(this.userDetails);

  @override
  List<Object?> get props => [userDetails];
}
