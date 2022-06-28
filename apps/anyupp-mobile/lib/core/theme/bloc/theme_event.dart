part of 'theme_bloc.dart';

abstract class ThemeEvent extends Equatable {
  const ThemeEvent();

  @override
  List<Object?> get props => [];
}

class ThemeSelected extends ThemeEvent {
  final ThemeChainData theme;

  const ThemeSelected({required this.theme});
}

class ResetTheme extends ThemeEvent {}
