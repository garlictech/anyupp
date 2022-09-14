import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../data/providers.dart';
import '../entities/entities.dart';
import '../repositories/unit.dart';

class UnitListState {
  final bool working;
  final List<Unit> users;

  UnitListState({this.working = false, this.users = const []});
}

class UnitListProvider extends StateNotifier<UnitListState> {
  final UnitRepository unitRepository;

  UnitListProvider(this.unitRepository) : super(UnitListState());

  refresh() async {
    state = UnitListState(working: true, users: state.users);
    final unitList = await unitRepository.getUnitList();
    state = UnitListState(working: false, users: unitList);
  }
}

final unitListProvider =
    StateNotifierProvider.autoDispose<UnitListProvider, UnitListState>((ref) {
  final unitRepository = ref.watch(unitRepositoryProvider);
  return UnitListProvider(unitRepository);
});
