import 'package:fa_prev/core/dependency_indjection/dependency_injection.dart';
import 'package:flutter/material.dart';
import 'package:fa_prev/core/theme/theme.dart';

extension ThemeStateExtension on State {
  ThemeChainData get theme => getIt<ThemeBloc>().state.theme;
}

extension TranslateStatelessWidgetExtension on StatelessWidget {
  ThemeChainData get theme => getIt<ThemeBloc>().state.theme;
}
