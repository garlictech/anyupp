import 'package:fa_prev/core/core.dart';

class MockThemeBloc extends ThemeBloc {
  MockThemeBloc() : super(UnitSelectBloc());

  ThemeState get state => ThemeState(theme: ThemeAnyUpp());
}
