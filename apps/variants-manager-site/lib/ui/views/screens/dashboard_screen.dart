import '../widgets/unit_list.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../shared/app_theme.dart';
import '../widgets/appbar_widget.dart';

class DashboardScreen extends ConsumerWidget {
  final scaffoldKey = GlobalKey<ScaffoldState>();

  DashboardScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      key: scaffoldKey,
      appBar: const AppBarWidget(titleText: 'Dashboard'),
      backgroundColor: AppTheme.of(context).primaryBackground,
      body: const SafeArea(
        child: SizedBox(
          width: double.infinity,
          height: double.infinity,
          child: Align(
            alignment: Alignment.center,
            child: UnitListWidget(),
          ),
        ),
      ),
    );
  }
}
