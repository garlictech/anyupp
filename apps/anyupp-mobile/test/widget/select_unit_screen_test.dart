import 'package:anyupp/core/core.dart';
import 'package:anyupp/graphql/generated/crud-api.dart';
import 'package:anyupp/models.dart';
import 'package:anyupp/modules/cart/cart.dart';
import 'package:anyupp/modules/selectunit/selectunit.dart';
import 'package:anyupp/modules/takeaway/takeaway.dart';
import 'package:anyupp/shared/auth/auth.dart';
import 'package:faker/faker.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';

import '../mock/mock_data_faker.dart';
import '../unit/mock/mock_auth_provider.dart';
import 'mock/mock_unit_bloc.dart';
import 'mock/mocks.dart';
import 'utils/boilerplate_app.dart';

void main() {
  const int unitCount = 2;
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
    getIt.registerSingleton<CartBloc>(MockCartBloc(
      stateToSend: EmptyCartState(),
    ));
    List<Unit> units = List.generate(
        unitCount,
        (index) => MockGenerator.generateUnit(
              name: 'TEST UNIT #$index',
              currency: 'huf',
            ));

    getIt.registerSingleton<UnitsBloc>(MockUnitsBloc(UnitsLoaded(
      units: units,
      userLocation: const LatLng(47.4744579, 19.0754983),
    )));

    getIt.registerSingleton<TakeAwayBloc>(MockTakeAwayBloc(
      servingMode: ServingMode.inPlace,
    ));
  });

  Widget _createBoilerPlateApp({required Widget child}) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(create: (_) => getIt<ThemeBloc>()),
        BlocProvider(create: (_) => getIt<CartBloc>()),
        BlocProvider(create: (_) => getIt<UnitsBloc>()),
        BlocProvider(create: (_) => getIt<TakeAwayBloc>()),
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
          _createBoilerPlateApp(child: SelectUnitScreen()),
        );

        await tester.pump();

        expect(find.byType(SelectUnitScreen), findsOneWidget);
        expect(find.byType(TakeAwayToggle), findsOneWidget);
        expect(find.byType(UnitWidget), findsNWidgets(unitCount));

        // Wait to complete the animations
        await tester.pumpAndSettle(Duration(milliseconds: 1000));
      });
    });

    testWidgets('Test Unit Card widget to be displayed correctly.',
        (WidgetTester tester) async {
      await tester.runAsync(() async {
        tester.binding.window.physicalSizeTestValue = Size(1080, 1920);

        await tester.pumpWidget(
          _createBoilerPlateApp(
              child: Material(
            child: UnitCardWidget(
              unit: MockGenerator.generateUnit(
                name: 'TEST UNIT CARD',
                currency: 'huf',
              ),
            ),
          )),
        );

        await tester.pump();

        expect(find.byType(UnitCardWidget), findsOneWidget);

        // Wait to complete the animations
        await tester.pumpAndSettle(Duration(milliseconds: 1000));
      });
    });
  }, skip: false);
}
