import 'package:fa_prev/core/dependency_indjection/dependency_injection.dart';
import 'package:fa_prev/models/Order.dart';
import 'package:fa_prev/modules/orders/orders.dart';
import 'package:fa_prev/modules/transactions/transactions.dart';
import 'package:fa_prev/shared/utils/navigator.dart';
import 'package:fa_prev/shared/widgets/app_bar.dart';
import 'package:fa_prev/shared/widgets/loading_widget.dart';
import 'package:flutter/material.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class OrderDetailsScreen extends StatelessWidget {
  OrderDetailsScreen();
  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return Scaffold(
        appBar: appBar(theme,
            onBackButtonPressed: () => Nav.pop(),
            title: trans(context, 'profile.transactions.details')),
        // The appBar head text
        backgroundColor: theme.background,
        body: BlocBuilder<OrderBloc, BaseOrderState>(
          builder: (context, state) {
            if (state is OrderDetailLoadedState) {
              return _buildLoadedOrderDetails(context, state.order);
            }

            return CenterLoadingWidget();
          },
        ));
  }

  Widget _buildLoadedOrderDetails(context, Order order) {
    return Center(
      child: Text(order.id),
    );
  }
}
