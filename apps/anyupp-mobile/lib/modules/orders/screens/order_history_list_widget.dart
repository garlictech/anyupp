import 'package:anyupp/providers/providers.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '/core/core.dart';
import '/models.dart';
import '/modules/orders/orders.dart';
import '/modules/orders/utils/order_afterpay_utils.dart';
import '/shared/locale.dart';
import '/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_staggered_animations/flutter_staggered_animations.dart';

class OrderHistoryListWidget extends ConsumerStatefulWidget {
  const OrderHistoryListWidget();

  @override
  _OrderHistoryListWidgetState createState() => _OrderHistoryListWidgetState();
}

class _OrderHistoryListWidgetState
    extends ConsumerState<OrderHistoryListWidget> {
  bool _hasMoreItems = false;
  String? _nextToken;

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
        child: BlocBuilder<OrderHistoryBloc, BaseOrderHistoryState>(
            builder: (context, state) {
          // log.d('***** OrderHistoryScreen.bloc.state=$state');
          if (state is NoOrderHistoryLoaded) {
            return Container();
          }

          if (state is OrderHistoryLoadedState) {
            if (state.orders == null ||
                (state.orders != null && state.orders!.isEmpty)) {
              return Container();
            }
            return _buildList(groupOrdersListByTransactionIdWithMerge(
              orders: state.orders!,
            ));
          } else if (state is OrderLoadHistoryError) {
            return CommonErrorWidget(
              error: state.message!,
              description: state.details,
            );
          }

          return Container();

          // return Container(
          //   margin: EdgeInsets.only(top: 48),
          //   child: CenterLoadingWidget(),
          // );
        }),
      ),
    );
  }

  Widget _buildList(List<Order> list) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          margin: EdgeInsets.only(
            top: 56.0,
            left: 16.0,
            bottom: 12.0,
          ),
          child: Text(
            trans('orders.titleOrderHistory'),
            style: Fonts.satoshi(
              color: theme.secondary64,
              fontSize: 14.0,
              fontWeight: FontWeight.w400,
            ),
          ),
        ),
        AnimationLimiter(
          child: ListView.builder(
            shrinkWrap: true,
            itemCount: list.length + 1,
            scrollDirection: Axis.vertical,
            physics: BouncingScrollPhysics(),
            itemBuilder: (context, position) {
              if (position < list.length) {
                return AnimationConfiguration.staggeredList(
                  position: position,
                  duration: const Duration(milliseconds: 200),
                  child: SlideAnimation(
                    verticalOffset: 50.0,
                    child: FadeInAnimation(
                      child: Consumer(builder: (context, ref, c) {
                        final productIds = list[position]
                            .items
                            .map((item) => item.productId)
                            .toList();

                        final AsyncValue components = ref.watch(
                            componentsOfProductsByIdsProvider(productIds));

                        return components.when(
                            loading: () => Container(),
                            error: (err, stack) => Container(),
                            data: (data) => CurrentOrderCardWidget(
                                  order: list[position],
                                ));
                      }),
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
        ),
      ],
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
            ),
            onPressed: () =>
                getIt<OrderHistoryBloc>().add(LoadMoreOrderHistory(_nextToken)),
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
}
