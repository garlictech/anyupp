import 'package:anyupp/core/core.dart';
import 'package:anyupp/graphql/generated/crud-api.dart';
import 'package:anyupp/models.dart';
import 'package:anyupp/modules/profile/profile.dart';
import 'package:anyupp/modules/screens.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';

import '../mock/mock_data_faker.dart';
import 'mock/mocks.dart';
import 'utils/boilerplate_app.dart';

void main() {
  late Unit _mockUnit;

  setUpAll(() async {
    GoogleFonts.config.allowRuntimeFetching = false;

    _mockUnit = MockGenerator.generateUnit(
      name: 'TEST UNIT',
      currency: 'huf',
      orderPolicy: OrderPolicy.placeOnly,
    );

    getIt.registerSingleton<ThemeBloc>(MockThemeBloc());
    getIt.registerSingleton<UnitSelectBloc>(MockUnitSelectBloc(_mockUnit));

  });

  Widget _createBoilerPlateApp({required Widget child}) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(create: (_) => getIt<ThemeBloc>()),
        BlocProvider(create: (_) => getIt<UnitSelectBloc>()),
      ],
      child: MockMaterialApp(
        child: child,
      ),
    );
  }

  group('Select Unit Screen test', () {
    testWidgets('Test Select Unit screen to be displayed correctly.',
            (WidgetTester tester) async {
          await tester.runAsync(() async {
            tester.binding.window.physicalSizeTestValue = Size(1080, 1920);

            await tester.pumpWidget(
              _createBoilerPlateApp(child: UnitInfoScreen(unit: _mockUnit)),
            );

            await tester.pump();

            expect(find.byType(UnitInfoScreen), findsOneWidget);
            expect(find.byType(UnitInfoScreenHeader), findsOneWidget);
            expect(find.byType(UnitInfoScreenOpeningHours), findsOneWidget);
            expect(find.byType(UnitInfoScreenIntroduce), findsOneWidget);
            expect(find.byType(UnitInfoScreenAvailability), findsOneWidget);

            // Wait to complete the animations
            await tester.pumpAndSettle(Duration(milliseconds: 1000));
          });
        });

  }, skip: false);
}
