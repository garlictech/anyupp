import 'package:flutter_riverpod/flutter_riverpod.dart';

import '/core/core.dart';

final themeProvider = Provider<ThemeChainData>((ref) {
  return defaultTheme();
});
