import 'dart:async';

import '/models.dart';
import '/shared/user-details/user_details.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class UserDetailsBloc extends Bloc<UserDetailsEvent, UserDetailsState> {
  final UserDetailsRepository _userDetailsRepository;

  UserDetailsBloc(this._userDetailsRepository) : super(NoUserDetailsState()) {
    on<GetUserDetailsEvent>(_onGetUserDetailsEvent);
    on<ResetUserDetailsEvent>(_onResetUserDetailsEvent);
  }

  FutureOr<void> _handleError(Exception e, Emitter<UserDetailsState> emit) {
    emit(UserDetailsLoadingErrorState());
  }

  FutureOr<void> _onGetUserDetailsEvent(
      GetUserDetailsEvent event, Emitter<UserDetailsState> emit) async {
    emit(UserDetailsLoadingState());
    try {
      User? user = await _userDetailsRepository.getUserDetails();
      if (user != null) {
        emit(UserDetailsLoaded(user));
      } else {
        emit(NoUserDetailsState());
      }
    } on Exception catch (e) {
      _handleError(e, emit);
    }
  }

  FutureOr<void> _onResetUserDetailsEvent(
      ResetUserDetailsEvent event, Emitter<UserDetailsState> emit) {
    emit(NoUserDetailsState());
  }
}
