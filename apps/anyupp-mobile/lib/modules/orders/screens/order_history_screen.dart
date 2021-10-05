import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/main/main.dart';
import 'package:fa_prev/modules/orders/orders.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_staggered_animations/flutter_staggered_animations.dart';

class OrderHistoryScreen extends StatefulWidget {
  final GeoUnit unit;

  const OrderHistoryScreen({required this.unit});

  @override
  _OrderHistoryScreenState createState() => _OrderHistoryScreenState();
}

class _OrderHistoryScreenState extends State<OrderHistoryScreen> {
  bool _hasMoreItems = false;
  String? _nextToken;

  @override
  void initState() {
    super.initState();
    getIt<OrderHistoryBloc>().add(StartGetOrderHistoryListSubscription(widget.unit.id));
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      // key: PageStorageKey('history'),
      child: BlocListener<OrderHistoryBloc, BaseOrderHistoryState>(
        listener: (BuildContext context, BaseOrderHistoryState state) {
          if (state is OrderHistoryLoadedState) {
            setState(() {
              _hasMoreItems = state.hasMoreItems;
              _nextToken = state.nextToken;
            });
          }
        },
        child: BlocBuilder<OrderHistoryBloc, BaseOrderHistoryState>(builder: (context, state) {
          // print('***** OrderHistoryScreen.bloc.state=$state');
          if (state is NoOrderHistoryLoaded) {
            return _noOrderHistory();
          }

          if (state is OrderHistoryLoadedState) {
            if (state.orders == null || (state.orders != null && state.orders!.isEmpty)) {
              return _noOrderHistory();
            }
            return _buildList(state.orders!);
          } else if (state is OrderLoadHistoryError) {
            return CommonErrorWidget(
              error: state.message!,
              description: state.details,
            );
          }

          return CenterLoadingWidget();
        }),
      ),
    );
  }

  Widget _buildList(List<Order> list) {
    return AnimationLimiter(
      child: ListView.builder(
        itemCount: list.length + 1,
        scrollDirection: Axis.vertical,
        physics: BouncingScrollPhysics(),
        itemBuilder: (context, position) {
          if (position < list.length) {
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
          } else if (_hasMoreItems) {
            return _buildLoadMoreItemsButton();
          } else {
            return Container();
          }
        },
      ),
    );
  }

  Widget _buildLoadMoreItemsButton() {
    return BlocBuilder<OrderHistoryBloc, BaseOrderHistoryState>(
      builder: (context, state) {
        if (state is OrderHistoryLoadingState) {
          return Container(
            height: 120,
            child: CenterLoadingWidget(),
          );
        }

        return Container(
          margin: EdgeInsets.only(bottom: 76.0),
          child: TextButton(
            style: TextButton.styleFrom(
              padding: EdgeInsets.all(0),
              shape: CircleBorder(
                side: BorderSide(
                  color: theme.secondary40.withOpacity(0.4),
                ),
              ),
              backgroundColor: Colors.transparent,
              primary: theme.secondary,
            ),
            onPressed: () => getIt<OrderHistoryBloc>().add(LoadMoreOrderHistory(widget.unit.id, _nextToken)),
            child: Text(
              trans('orders.loadMore'),
              textAlign: TextAlign.center,
              style: Fonts.satoshi(
                color: theme.secondary.withOpacity(0.3),
                fontSize: 20,
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _noOrderHistory() {
    return EmptyWidget(
      messageKey: 'orders.noOrderHistory',
      descriptionKey: 'orders.noActiveOrderDesc',
      buttonTextKey: 'orders.noActiveOrderButton',
      onTap: () => getIt<MainNavigationBloc>().add(
        DoMainNavigation(
          pageIndex: 0,
        ),
      ),
    );
  }
}
