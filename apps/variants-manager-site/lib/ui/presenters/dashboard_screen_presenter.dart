import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../viewmodels/dashboard_screen_viewmodel.dart';

class DashboardScreenPresenter extends StateNotifier<DashboardScreenViewModel> {
  final BuildContext context;
  final Ref ref;

  DashboardScreenPresenter(this.context, this.ref)
      : super(DashboardScreenViewModel());
}

final dashboardScreenMVPProvider = StateNotifierProvider.autoDispose
    .family<DashboardScreenPresenter, DashboardScreenViewModel, BuildContext>(
        (ref, context) {
  return DashboardScreenPresenter(context, ref);
});
