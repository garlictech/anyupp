import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/profile/profile.dart';
import 'package:fa_prev/shared/utils/md5_hash.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';

import 'mock/mock_theme_bloc.dart';
import 'utils/boilerplate_app.dart';

void main() {
  setUpAll(() async {
    GoogleFonts.config.allowRuntimeFetching = false;
    getIt.registerSingleton<ThemeBloc>(MockThemeBloc());
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

  group('Profile View Screen test', () {
    testWidgets('Test Profile view screen to display anonymous user.',
        (WidgetTester tester) async {
      await tester.runAsync(() async {
        tester.binding.window.physicalSizeTestValue = Size(1080, 1920);

        await tester.pumpWidget(
          _createBoilerPlateApp(
              child: ProfileViewScreen(
            profile: User(
              id: 'TEST_ANONYMOUS_USER_ID',
              email: 'anonymuser+342642784@anyupp.com',
              name: 'AnonymUser',
            ),
          )),
        );

        await tester.pump();

        expect(find.byType(ProfileViewScreen), findsOneWidget);
        expect(find.text('AnonymUser'), findsOneWidget);
        expect(find.text('anonymuser@anyupp.com'), findsOneWidget);
        expect(
          find.text(generateHash('TEST_ANONYMOUS_USER_ID')),
          findsOneWidget,
        );
      });
    });
  }, skip: false);

  testWidgets(
      'Test Profile view screen to display social login user (Facebook, Google or Apple).',
      (WidgetTester tester) async {
    await tester.runAsync(() async {
      tester.binding.window.physicalSizeTestValue = Size(1080, 1920);

      await tester.pumpWidget(
        _createBoilerPlateApp(
            child: ProfileViewScreen(
          profile: User(
            id: 'TEST_SOCIAL_USER_ID',
            email: 'batori.gabor@gmail.com',
            name: 'Bátori Gábor',
          ),
        )),
      );

      await tester.pump();

      expect(find.byType(ProfileViewScreen), findsOneWidget);
      expect(find.text('Bátori Gábor'), findsOneWidget);
      expect(find.text('batori.gabor@gmail.com'), findsOneWidget);
      expect(
        find.text(generateHash('TEST_SOCIAL_USER_ID')),
        findsOneWidget,
      );
    });
  });
}
