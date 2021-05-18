import 'package:fa_prev/modules/main/main.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class MainNavigationBloc extends Bloc<MainNavigationEvent, MainNavigationState> {

  MainNavigationBloc() : super(MainNavigationState(pageIndex: 0));

  @override
  Stream<MainNavigationState> mapEventToState(MainNavigationEvent event) async* {
    yield MainNavigationState(pageIndex: event.pageIndex);
  } 
}
