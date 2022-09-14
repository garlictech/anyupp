import 'dart:async';

import '/modules/main/main.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class MainNavigationBloc
    extends Bloc<MainNavigationEvent, MainNavigationState> {
  MainNavigationBloc() : super(NoMainNavigation()) {
    on<DoMainNavigation>(_onDoMainNavigation);
    on<ResetMainNavigation>(_onResetMainNavigation);
  }

  FutureOr<void> _onDoMainNavigation(
      DoMainNavigation event, Emitter<MainNavigationState> emit) {
    emit(MainNavaigationNeed(pageIndex: event.pageIndex));
    add(ResetMainNavigation());
  }

  FutureOr<void> _onResetMainNavigation(
      ResetMainNavigation event, Emitter<MainNavigationState> emit) {
    emit(NoMainNavigation());
  }
}
