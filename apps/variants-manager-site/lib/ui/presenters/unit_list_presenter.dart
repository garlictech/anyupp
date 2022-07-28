import 'package:flutter/material.dart';
import '../../domain/entities/unit/unit.dart';
import '/domain/states/unit_list.dart';
import '../viewmodels/unit_list_viewmodel.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../views/screens/manage_variants_screen.dart';

class UnitListScreenPresenter extends StateNotifier<UnitListViewModel> {
  final BuildContext context;
  final Ref ref;

  UnitListScreenPresenter(this.context, this.ref) : super(UnitListViewModel()) {
    onRefreshList();
  }

  onRefreshList() async {
    final unitList = ref.read(unitListProvider.notifier);
    await unitList.refresh();
  }

  onEditClicked(Unit unit) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => ManageVariantsScreen(unit: unit),
      ),
    );
  }
}

final unitListMVPProvider = StateNotifierProvider.autoDispose
    .family<UnitListScreenPresenter, UnitListViewModel, BuildContext>(
        (ref, context) {
  return UnitListScreenPresenter(context, ref);
});
