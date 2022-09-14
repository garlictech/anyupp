import 'package:bloc_test/bloc_test.dart';
import 'package:equatable/equatable.dart';
import 'package:anyupp/shared/user-details/user_details.dart';
import 'package:flutter_test/flutter_test.dart';

import 'mock/mock_auth_provider.dart';
import 'mock/mock_data.dart';
import 'mock/mock_user_details_provider.dart';

void main() {
  group('GetUserDetails BloC test', () {
    late UserDetailsBloc userDetailsBloc;
    UserDetailsRepository userDetailsRepository;
    MockAuthProvider authProvider;
    MockUserDetailsProvider userDetailsProvider;

    setUp(() {
      EquatableConfig.stringify = true;
      authProvider = MockAuthProvider();
      userDetailsProvider = MockUserDetailsProvider(authProvider);
      userDetailsRepository = UserDetailsRepository(userDetailsProvider);
      userDetailsBloc = UserDetailsBloc(userDetailsRepository);
    });

    blocTest<UserDetailsBloc, UserDetailsState>(
      'test Get User Details from the backend',
      build: () => userDetailsBloc,
      act: (bloc) => bloc.add(GetUserDetailsEvent()),
      expect: () => [
        UserDetailsLoadingState(),
        UserDetailsLoaded(MOCK_USER()),
      ],
    );

    tearDown(() {
      userDetailsBloc.close();
    });
  });
}
