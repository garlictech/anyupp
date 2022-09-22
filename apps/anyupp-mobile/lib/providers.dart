import 'package:anyupp/domain/usecases/call_waiter_usecase.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final callWaiterUsecase =
    StateNotifierProvider<CallWaiterUsecase, CallWaiterState>((ref) {
  return CallWaiterUsecase();
});
