import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/orders/orders.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'order_history_list_widget.dart';
import 'order_status_list_widget.dart';

class OrdersScreen extends StatefulWidget {
  const OrdersScreen({Key? key}) : super(key: key);

  @override
  State<OrdersScreen> createState() => _OrdersScreenState();
}

class _OrdersScreenState extends State<OrdersScreen> {
  bool _ordersLoaded = false;
  bool _orderHistoryLoaded = false;

  @override
  void initState() {
    super.initState();
    var state = getIt<UnitSelectBloc>().state;
    if (state is UnitSelected) {
      GeoUnit unit = state.unit;
      getIt<OrderBloc>()
          .add(StartGetOrderListSubscription(unit.chainId, unit.id));
      getIt<OrderHistoryBloc>()
          .add(StartGetOrderHistoryListSubscription(unit.id));
    }
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Scaffold(
        // The appBar head text
        // extendBodyBehindAppBar: true,
        extendBody: true,
        backgroundColor: theme.secondary12,
        body: MultiBlocListener(
          listeners: [
            BlocListener<OrderBloc, BaseOrderState>(
              listener: (context, state) {
                if (state is NoOrdersLoaded || state is OrdersLoadedState) {
                  setState(() {
                    _ordersLoaded = true;
                  });
                }
              },
            ),
            BlocListener<OrderHistoryBloc, BaseOrderHistoryState>(
              listener: (context, state) {
                if (state is NoOrderHistoryLoaded ||
                    state is OrderHistoryLoadedState) {
                  setState(() {
                    _orderHistoryLoaded = true;
                  });
                }
              },
            ),
          ],
          child: _ordersLoaded && _orderHistoryLoaded
              ? BlocBuilder<UnitSelectBloc, UnitSelectState>(
                  builder: (context, state) {
                    if (state is UnitSelected) {
                      return SingleChildScrollView(
                        physics: BouncingScrollPhysics(),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            OrderStatusListWidget(
                              unit: state.unit,
                            ),
                            OrderHistoryListWidget(
                              unit: state.unit,
                            ),
                          ],
                        ),
                      );
                    }
                    return CenterLoadingWidget();
                  },
                )
              : CenterLoadingWidget(),
        ),
      ),
    );
  }
}
