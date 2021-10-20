import 'package:fa_prev/modules/main/main.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class MainNavigationBloc extends Bloc<MainNavigationEvent, MainNavigationState> {
  MainNavigationBloc() : super(NoMainNavigation());

  @override
  Stream<MainNavigationState> mapEventToState(MainNavigationEvent event) async* {
    if (event is DoMainNavigation) {
      yield MainNavaigationNeed(pageIndex: event.pageIndex);
      add(ResetMainNavigation());
    }
    if (event is ResetMainNavigation) {
      yield NoMainNavigation();
    }
  }
}
