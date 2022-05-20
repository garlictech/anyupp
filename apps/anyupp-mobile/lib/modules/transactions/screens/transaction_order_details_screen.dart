import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/orders/orders.dart';
import 'package:fa_prev/modules/orders/screens/order_details_screen.dart';
import 'package:fa_prev/modules/rating_tipping/bloc/rating_bloc.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class TransactionOrderDetailsScreen extends StatefulWidget {
  final String orderId;
  final GeoUnit unit;
  const TransactionOrderDetailsScreen({
    Key? key,
    required this.orderId,
    required this.unit,
  }) : super(key: key);

  @override
  _TransactionOrderDetailsScreenState createState() =>
      _TransactionOrderDetailsScreenState();
}

class _TransactionOrderDetailsScreenState
    extends State<TransactionOrderDetailsScreen> {
  Order? _order;
  bool? empty;
  @override
  void initState() {
    super.initState();
    getIt<OrderBloc>().add(LoadOrderDetail(
      orderId: widget.orderId,
    ));
  }

  @override
  Widget build(BuildContext context) {
    return MultiBlocListener(
      listeners: [
        BlocListener<RatingBloc, RatingState>(
          listener: (context, state) {
            if (state is RatingSuccess) {
              getIt<OrderBloc>().add(LoadOrderDetail(
                orderId: widget.orderId,
              ));
            }
          },
        ),
        BlocListener<OrderBloc, BaseOrderState>(
          listener: (context, state) {
            if (state is OrderDetailLoadedState) {
              if (state.order == null) {
                empty = true;
              }
              setState(() {
                _order = state.order;
              });

              //getIt<OrderBloc>().add(LoadOrderDetail(orderId: widget.orderId));
            }
          },
        ),
        BlocListener<OrderRefreshBloc, OrderRefreshState>(
          listener: (context, state) {
            // log.d('******* OrderDetailsScreen().listener.state=$state');
            if (state is OrderRefreshed) {
              setState(() {
                _order = state.order;
              });
            }
          },
        ),
      ],
      child: BlocBuilder<OrderBloc, BaseOrderState>(
        builder: (context, state) {
          if (empty != null && empty!) {
            return Container(
              color: theme.secondary0,
              child: SafeArea(
                child: Scaffold(
                  appBar: AppBar(
                    leading: Padding(
                      padding: const EdgeInsets.only(
                        top: 8.0,
                        bottom: 8.0,
                        left: 15.0,
                      ),
                      child: BackButtonWidget(
                        color: theme.secondary,
                        icon: Icons.arrow_back,
                      ),
                    ),
                    centerTitle: true,
                    elevation: 3.0,
                    shadowColor: theme.secondary0.withOpacity(0.3),
                    iconTheme: IconThemeData(
                      color: theme.secondary, //change your color here
                    ),
                    backgroundColor: theme.secondary0,
                  ),
                  backgroundColor: theme.secondary0,
                  body: Center(
                    child: Container(
                      margin: EdgeInsets.symmetric(horizontal: 8.0),
                      child: EmptyWidget(
                        messageKey: 'main.noCategories',
                        background: Colors.transparent,
                      ),
                    ),
                  ),
                ),
              ),
            );
          }
          if (_order != null) {
            return OrderDetailsScreen(
              key: UniqueKey(),
              unit: widget.unit,
              order: _order!,
            );
          }

          return Scaffold(
            body: CenterLoadingWidget(),
          );
        },
      ),
    );
  }
}
