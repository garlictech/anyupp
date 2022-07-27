import '/core/core.dart';

class MockThemeBloc extends ThemeBloc {
  MockThemeBloc() : super(UnitSelectBloc());

  ThemeState get state => ThemeState(theme: ThemeAnyUpp());
}
