import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/modules/orders/orders.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:pull_to_refresh/pull_to_refresh.dart';

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
  bool _hasErrors = false;
  String? _error;
  String? _errorDetails;
  RefreshController _refreshController =
      RefreshController(initialRefresh: false);

  void _onRefresh() async {
    _initScreen();
    _refreshController.refreshCompleted();
  }

  void _initScreen() {
    getIt<OrderBloc>().add(StartGetOrderListSubscription());
    getIt<OrderHistoryBloc>().add(StartGetOrderHistoryListSubscription());
  }

  @override
  void initState() {
    super.initState();
    _initScreen();
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Scaffold(
        // The appBar head text
        // extendBodyBehindAppBar: true,
        extendBody: true,
        backgroundColor: theme.secondary12,
        body: SmartRefresher(
          enablePullDown: true,
          header: MaterialClassicHeader(),
          controller: _refreshController,
          onRefresh: _onRefresh,
          physics: BouncingScrollPhysics(),
          child: MultiBlocListener(
            listeners: [
              BlocListener<OrderBloc, BaseOrderState>(
                listener: (context, state) {
                  // log.e('OrdersScreen OrderBloc.state: $state');
                  if (state is NoOrdersLoaded || state is OrdersLoadedState) {
                    setState(() {
                      _ordersLoaded = true;
                    });
                  }
                  if (state is OrderLoadError) {
                    setState(() {
                      _hasErrors = true;
                      _error = state.message;
                      _errorDetails = state.details;
                    });
                  }
                },
              ),
              BlocListener<OrderHistoryBloc, BaseOrderHistoryState>(
                listener: (context, state) {
                  // log.e('OrdersScreen OrderHistoryBloc.state: $state');
                  if (state is NoOrderHistoryLoaded ||
                      state is OrderHistoryLoadedState) {
                    setState(() {
                      _orderHistoryLoaded = true;
                    });
                  }
                  if (state is OrderLoadHistoryError) {
                    setState(() {
                      _hasErrors = true;
                      _error = state.message;
                      _errorDetails = state.details;
                    });
                  }
                },
              ),
            ],
            child: _ordersLoaded && _orderHistoryLoaded
                ? SingleChildScrollView(
                    physics: BouncingScrollPhysics(),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        OrderStatusListWidget(),
                        OrderHistoryListWidget(),
                      ],
                    ),
                  )
                : _hasErrors
                    ? CommonErrorWidget(
                        error: _error!,
                        errorDetails: _errorDetails,
                      )
                    : CenterLoadingWidget(),
          ),
        ),
      ),
    );
  }
}
