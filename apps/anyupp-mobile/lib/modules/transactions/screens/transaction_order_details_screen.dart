import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/orders/orders.dart';
import 'package:fa_prev/modules/orders/screens/order_details_screen.dart';
import 'package:fa_prev/shared/widgets/loading_widget.dart';
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
  @override
  void initState() {
    super.initState();
    getIt<OrderBloc>().add(LoadOrderDetail(
      orderId: widget.orderId,
    ));
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<OrderBloc, BaseOrderState>(
      builder: (context, state) {
        if (state is OrderDetailLoadedState) {
          return OrderDetailsScreen(
            unit: widget.unit,
            order: state.order!,
          );
        }
        return Scaffold(
          body: CenterLoadingWidget(),
        );
      },
    );
  }
}
