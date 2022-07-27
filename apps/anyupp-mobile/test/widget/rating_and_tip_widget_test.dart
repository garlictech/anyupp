import '/core/core.dart';
import '/models.dart';
import '/modules/rating_tipping/rating_tipping.dart';
import '/shared/auth/auth.dart';
import 'package:faker/faker.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';

import '../mock/mock_data_faker.dart';
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

  LocalizedItem _getText(String text) {
    return LocalizedItem(
      en: text,
      hu: text,
      de: text,
    );
  }

  group('Rating and Tip widget test', () {
    testWidgets('Test Rating and Tip screen to be displayed correctly.',
        (WidgetTester tester) async {
      await tester.runAsync(() async {
        tester.binding.window.physicalSizeTestValue = Size(1080, 1920);

        await tester.pumpWidget(
          _createBoilerPlateApp(
              child: RatingAndTippingModal(
            transaction: MockGenerator.generateTransaction(),
            tipPolicy: TipPolicy(
              title: _getText('Tip test title'),
              description: _getText('Tip test description'),
              percents: [5, 10, 15],
            ),
            ratingPolicy: RatingPolicy(
              key: 'TEST_QUESTION',
              ratings: [
                RatingPolicyItem(value: 1, text: _getText('Egy')),
                RatingPolicyItem(value: 2, text: _getText('Kettő')),
                RatingPolicyItem(value: 3, text: _getText('Három')),
                RatingPolicyItem(value: 4, text: _getText('Négy')),
                RatingPolicyItem(value: 4, text: _getText('Öt')),
              ],
              title: _getText('Rating test title'),
              description: _getText('Rating test description'),
            ),
          )),
        );

        await tester.pump();

        // Check widgets
        expect(find.byType(RatingAndTippingModal), findsOneWidget);
        expect(find.byType(RatingWidget), findsOneWidget);
        expect(find.byType(TippingWidget), findsOneWidget);

        // Check rating texts
        expect(find.text('Egy'), findsOneWidget);
        expect(find.text('Kettő'), findsOneWidget);
        expect(find.text('Három'), findsOneWidget);
        expect(find.text('Négy'), findsOneWidget);
        expect(find.text('Öt'), findsOneWidget);

        expect(find.text('Rating test title'), findsOneWidget);
        expect(find.text('Rating test description'), findsOneWidget);

        // Check tip texts
        expect(find.text('5%'), findsOneWidget);
        expect(find.text('10%'), findsOneWidget);
        expect(find.text('15%'), findsOneWidget);

        expect(find.text('20%'), findsNothing);

        expect(find.text('Tip test title'), findsOneWidget);
        expect(find.text('Tip test description'), findsOneWidget);
      });
    });
  }, skip: true);
}
