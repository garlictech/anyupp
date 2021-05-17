import 'package:equatable/equatable.dart';

abstract class MainNavigationEvent extends Equatable {
  @override
  List<Object> get props => [];
}

class ResetMainNavigation extends MainNavigationEvent {

}

class DoMainNavigation extends MainNavigationEvent {
  final int pageIndex;

  DoMainNavigation({this.pageIndex});

  @override
  List<Object> get props => [pageIndex];
}
