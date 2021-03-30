
import 'package:fa_prev/app.dart';

import 'core/core.dart';

void main() async {
  await initDependencyInjection();
  configureCatcherAndRunZonedApp(MyApp());
  //runApp(MyApp());
}
