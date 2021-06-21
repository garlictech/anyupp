import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/orders/orders.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_staggered_animations/flutter_staggered_animations.dart';

class OrderHistoryScreen extends StatefulWidget {
  final GeoUnit unit;

  const OrderHistoryScreen({Key key, @required this.unit}) : super(key: key);

  @override
  _OrderHistoryScreenState createState() => _OrderHistoryScreenState();
}

class _OrderHistoryScreenState extends State<OrderHistoryScreen>
    with AutomaticKeepAliveClientMixin<OrderHistoryScreen> {
  OrderRepository _repository = getIt<OrderRepository>();

  @override
  bool get wantKeepAlive => true;

  @override
  void initState() {
    getIt<OrderBloc>().add(StartGetOrderHistoryListSubscription(widget.unit.chainId, widget.unit.id));
    super.initState();
    // Future.delayed(Duration(seconds: 1)).then(
    //   (value) => getIt<OrderBloc>().add(
    //     StartGetOrderHistoryListSubscription(widget.unit.chainId, widget.unit.id),
    //   ),
    // );
  }

  @override
  void dispose() {
    getIt<OrderBloc>().add(StopOrderHistoryListSubscription());
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    super.build(context);
    return Container(
      key: PageStorageKey('history'),
      child: BlocBuilder<UnitSelectBloc, UnitSelectState>(
        builder: (context, state) {
          if (state is UnitSelected) {
            final GeoUnit unit = state.unit;
            return StreamBuilder<List<Order>>(
              stream: _repository.getOrderHistory(unit.id),
              builder: (context, AsyncSnapshot<List<Order>> historySnapshot) {
                if (historySnapshot.connectionState != ConnectionState.waiting || historySnapshot.hasData) {
                  if (historySnapshot.data == null || historySnapshot.data.isEmpty) {
                    return _noOrderHistory();
                  }

                  // Display all the available sandwiches
                  return _buildList(historySnapshot.data);

                  // In case of error, display error message to the user
                } else if (historySnapshot.hasError) {
                  return Text("Error get order history list: ${historySnapshot.error}");
                }

                return CenterLoadingWidget();
              },
            );
          }

          return CenterLoadingWidget();
        },
      ),
    );
  }

  Widget _buildList(List<Order> list) {
    return AnimationLimiter(
      child: ListView.builder(
        itemCount: list.length,
        scrollDirection: Axis.vertical,
        physics: BouncingScrollPhysics(),
        itemBuilder: (context, position) {
          return AnimationConfiguration.staggeredList(
            position: position,
            duration: const Duration(milliseconds: 375),
            child: SlideAnimation(
              verticalOffset: 50.0,
              child: FadeInAnimation(
                child: OrderHistoryCard(
                  order: list[position],
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _noOrderHistory() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: <Widget>[
        // Display cart icon
        Image.asset(
          'assets/images/no-items-in-cart-icon.png',
          width: 128.0,
          fit: BoxFit.fitWidth,
        ),
        SizedBox(
          height: 60.0,
        ),
        Center(

            // Display message to the user
            child: Text(
          trans('orders.noOrderHistory'),
          style: TextStyle(
            fontSize: 15.0,
            color: theme.text,
          ),
        ))
      ],
    );
  }
}
