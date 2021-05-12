import 'package:equatable/equatable.dart';

class MainNavigationState extends Equatable {
  final int pageIndex;

  MainNavigationState({this.pageIndex});

  @override
  List<Object> get props => [pageIndex];
}
