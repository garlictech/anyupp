import 'package:equatable/equatable.dart';

class MainNavigationState extends Equatable {
  @override
  List<Object?> get props => [];
}

class NoMainNavigation extends MainNavigationState {}

class MainNavaigationNeed extends MainNavigationState {
  final int pageIndex;

  MainNavaigationNeed({this.pageIndex = 0});

  @override
  List<Object?> get props => [pageIndex];
}
