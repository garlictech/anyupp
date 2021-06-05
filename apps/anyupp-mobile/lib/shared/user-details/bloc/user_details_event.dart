
import 'package:equatable/equatable.dart';

abstract class UserDetailsEvent extends Equatable {

  const UserDetailsEvent();

  @override
  List<Object> get props => [];
}

class GetUserDetailsEvent extends UserDetailsEvent {

}
