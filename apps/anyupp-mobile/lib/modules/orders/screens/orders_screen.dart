import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:fa_prev/shared/widgets/tab_bar_widget.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'order_history_screen.dart';
import 'order_status_screen.dart';

class OrdersScreen extends StatefulWidget {
  final int tabIndex;

  const OrdersScreen({Key key, this.tabIndex = 0}) : super(key: key);

  @override
  _OrdersScreenState createState() => _OrdersScreenState();
}

class _OrdersScreenState extends State<OrdersScreen> {
  @override
  void initState() {
    super.initState();
    // getIt<OrderRepository>().startOrderHistoryListSubscription(widget.unit.id);
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<UnitSelectBloc, UnitSelectState>(builder: (context, state) {
      if (state is UnitSelected) {
        return TabBarWidget(
          OrderStatusScreen(unit: state.unit),
          OrderHistoryScreen(unit: state.unit),
          trans('orders.tabCurrentOrder'),
          trans('orders.tabOrderHistory'),
        );
      }
      return CenterLoadingWidget();
    });
  }
}
