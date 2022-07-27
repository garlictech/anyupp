import '/models/User.dart';
import '/shared/user-details/user_details.dart';

// class MockUserDetailsBloc extends UserDetailsBloc {
//   final ServingMode servingMode;

//   MockUserDetailsBloc({this.servingMode = ServingMode.inPlace}) : super();

//   TakeAwayState get state => ServingModeSelectedState(servingMode);
//   Stream<TakeAwayState> get stream =>
//       Stream.value(ServingModeSelectedState(servingMode));

//   @override
//   // ignore: must_call_super
//   Future<void> close() async => {};
// }

import 'package:flutter_test/flutter_test.dart';

class MockUserDetailsProvider implements IUserDetailsProvider {
  final User? user;

  MockUserDetailsProvider(this.user);

  @override
  Future<User?> getUserDetails() async {
    return user;
  }
}
