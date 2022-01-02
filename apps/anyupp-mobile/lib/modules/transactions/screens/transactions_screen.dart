import 'package:fa_prev/core/app-constants.dart';
import 'package:fa_prev/core/dependency_indjection/dependency_injection.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/core/units/bloc/unit_select_bloc.dart';
import 'package:fa_prev/models/GeoUnit.dart';
import 'package:fa_prev/models/Transaction.dart';
import 'package:fa_prev/modules/transactions/transactions.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/utils/navigator.dart';
import 'package:fa_prev/shared/widgets/app_bar.dart';
import 'package:fa_prev/shared/widgets/empty_widget.dart';
import 'package:fa_prev/shared/widgets/loading_widget.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_staggered_animations/flutter_staggered_animations.dart';
import 'package:pull_to_refresh/pull_to_refresh.dart';

class TransactionsScreen extends StatefulWidget {
  @override
  _TransactionsScreenState createState() => _TransactionsScreenState();
}

class _TransactionsScreenState extends State<TransactionsScreen> {
  RefreshController _refreshController =
      RefreshController(initialRefresh: false);
  String? _nextToken;
  late int _pageSize;
  late GeoUnit unit;

  @override
  void initState() {
    super.initState();
    _pageSize = getIt<AppConstants>().paginationSize;
    getIt<TransactionsBloc>().add(LoadTransactions(nextToken: null));

    UnitSelectState state = getIt<UnitSelectBloc>().state;
    if (state is UnitSelected) {
      unit = state.unit;
    }
  }

  void _onRefresh() async {
    _nextToken = null;
    getIt<TransactionsBloc>().add(Loading());
    getIt<TransactionsBloc>().add(LoadTransactions());
  }

  void _onLoading() async {
    _refreshController.loadComplete();
  }

  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(
        title: trans('profile.transactions.title'),
        elevation: 4.0,
      ),
      // The appBar head text
      backgroundColor: theme.secondary0,
      body: BlocBuilder<UnitSelectBloc, UnitSelectState>(
        builder: (context, state) {
          if (state is UnitSelected) {
            return _buildTransactions(context, state.unit);
          }
          return CenterLoadingWidget();
        },
      ),
    );
  }

  Widget _buildTransactions(BuildContext context, GeoUnit unit) {
    return BlocBuilder<TransactionsBloc, TransactionsState>(
      builder: (context, state) {
        if (state is TransactionsLoadedState) {
          _nextToken = state.response?.nextToken;
          _refreshController.refreshCompleted();
          return _buildList(state.response?.data ?? []);
        }
        return CenterLoadingWidget();
      },
    );
  }

  Widget _buildList(List<Transaction> list) {
    return AnimationLimiter(
        child: SmartRefresher(
      enablePullDown: true,
      header: WaterDropHeader(),
      footer: CustomFooter(
        builder: (BuildContext context, LoadStatus? mode) {
          Widget body;
          if (mode == LoadStatus.idle) {
            body = Text("pull up load");
          } else if (mode == LoadStatus.loading) {
            body = CenterLoadingWidget();
          } else if (mode == LoadStatus.failed) {
            body = Text("Load Failed!Click retry!");
          } else if (mode == LoadStatus.canLoading) {
            body = Text("release to load more");
          } else {
            body = Text("No more Data");
          }
          return Container(
            height: 55.0,
            child: Center(child: body),
          );
        },
      ),
      controller: _refreshController,
      onRefresh: _onRefresh,
      onLoading: _onLoading,
      child: list.isNotEmpty
          ? ListView.builder(
              itemCount: list.length,
              scrollDirection: Axis.vertical,
              physics: BouncingScrollPhysics(),
              itemBuilder: (context, position) {
                if (position == list.length - 1 &&
                    list.length % _pageSize == 0 &&
                    _nextToken != null) {
                  getIt<TransactionsBloc>()
                      .add(LoadTransactions(nextToken: _nextToken));
                }

                return AnimationConfiguration.staggeredList(
                  position: position,
                  duration: const Duration(milliseconds: 200),
                  child: SlideAnimation(
                    verticalOffset: 50.0,
                    child: FadeInAnimation(
                      child: TransactionCard(
                        transaction: list[position],
                        onTap: () => Nav.to(TransactionOrderDetailsScreen(
                          orderId: list[position].orderId,
                          unit: unit,
                        )),
                      ),
                    ),
                  ),
                );
              },
            )
          : _buildEmptyList(context),
    ));
  }

  Widget _buildEmptyList(BuildContext context) {
    return EmptyWidget(
      messageKey: 'profile.transactions.noTransactions',
    );
  }
}
