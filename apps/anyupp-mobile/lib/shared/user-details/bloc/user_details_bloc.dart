

import 'package:fa_prev/models.dart';
import 'package:fa_prev/shared/user-details/user_details.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'user_details_event.dart';
import 'user_details_state.dart';

class UserDetailsBloc extends Bloc<UserDetailsEvent, UserDetailsState> {

  final UserDetailsRepository _userDetailsRepository;

  UserDetailsBloc(this._userDetailsRepository) : super(NoUserDetailsState());

  @override
  Stream<UserDetailsState> mapEventToState(UserDetailsEvent event) async* {

    try {

    if (event is GetUserDetailsEvent) {
      User user = await _userDetailsRepository.getUserDetails();
      yield UserDetailsLoaded(user);
    }

    } on Exception catch(e) {
      print('UserDetailsBloc.error=$e');
      yield UserDetailsLoadingErrorState();
    } 
  }
}
