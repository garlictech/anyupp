import 'package:equatable/equatable.dart';

class MainNavigationEvent extends Equatable {
  final int pageIndex;

  MainNavigationEvent({this.pageIndex});

  @override
  List<Object> get props => [pageIndex];
}
