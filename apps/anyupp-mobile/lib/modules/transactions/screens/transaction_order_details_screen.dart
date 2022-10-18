import 'package:anyupp/models/ProductComponent.dart';
import 'package:anyupp/providers/providers.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '/core/core.dart';
import '/models.dart';
import '/modules/orders/orders.dart';
import '/modules/orders/screens/order_details_screen.dart';
import '/modules/rating_tipping/bloc/rating_bloc.dart';
import '/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class TransactionOrderDetailsScreen extends ConsumerStatefulWidget {
  final String orderId;
  const TransactionOrderDetailsScreen({
    Key? key,
    required this.orderId,
  }) : super(key: key);

  @override
  createState() => _TransactionOrderDetailsScreenState();
}

class _TransactionOrderDetailsScreenState
    extends ConsumerState<TransactionOrderDetailsScreen> {
  Order? _order;
  bool? empty;
  @override
  void initState() {
    super.initState();
    getIt<OrderDetailsBloc>().add(LoadOrderDetail(
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
              getIt<OrderDetailsBloc>().add(LoadOrderDetail(
                orderId: widget.orderId,
              ));
            }
          },
        ),
        BlocListener<OrderDetailsBloc, OrderDetailsState>(
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
            final componentsOfProducts =
                ref.watch(productComponentsOfAnOrderProvider(_order!).future);
            return FutureBuilder<List<ProductComponent>>(
                future: componentsOfProducts,
                builder: (context, snapshot) {
                  return OrderDetailsScreen(
                      key: UniqueKey(),
                      order: _order!,
                      productComponents: snapshot.data ?? []);
                });
          }

          return Scaffold(
            body: CenterLoadingWidget(),
          );
        },
      ),
    );
  }
}
