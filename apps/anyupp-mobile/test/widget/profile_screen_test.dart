import '/core/core.dart';
import '/models.dart';
import '/modules/screens.dart';
import '/shared/auth/auth.dart';
import 'package:faker/faker.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';

import '../unit/mock/mock_auth_provider.dart';
import 'mock/mock_theme_bloc.dart';
import 'utils/boilerplate_app.dart';

void main() {
  late User _mockUser;

  setUpAll(() async {
    GoogleFonts.config.allowRuntimeFetching = false;
    _mockUser = User(
      id: faker.guid.guid(),
      email: 'test_user_profile@anyupp.com',
      name: 'John Doe',
    );

    getIt.registerSingleton<ThemeBloc>(MockThemeBloc());
    getIt.registerSingleton<AuthRepository>(
        AuthRepository(MockAuthProvider(user: _mockUser)));
  });

  Widget _createBoilerPlateApp({required Widget child}) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(create: (_) => getIt<ThemeBloc>()),
      ],
      child: MockMaterialApp(
        child: child,
      ),
    );
  }

  group('Profile Screen test', () {
    testWidgets('Test Profile screen to be displayed correctly.',
        (WidgetTester tester) async {
      await tester.runAsync(() async {
        tester.binding.window.physicalSizeTestValue = Size(1080, 1920);

        await tester.pumpWidget(
          _createBoilerPlateApp(child: Profile()),
        );

        await tester.pump();

        expect(find.byType(Profile), findsOneWidget);

        // Wait to complete the animations
        await tester.pumpAndSettle(Duration(milliseconds: 1000));
      });
    });
  }, skip: true);
}
