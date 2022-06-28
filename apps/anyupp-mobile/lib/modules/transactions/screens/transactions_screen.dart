import 'package:fa_prev/core/app-constants.dart';
import 'package:fa_prev/core/dependency_indjection/dependency_injection.dart';
import 'package:fa_prev/core/theme/theme.dart';
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

  @override
  void initState() {
    super.initState();
    _pageSize = getIt<AppConstants>().paginationSize;
    getIt<TransactionsBloc>().add(LoadTransactions(nextToken: null));
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
      body: BlocBuilder<TransactionsBloc, TransactionsState>(
        builder: (context, state) {
          if (state is TransactionsLoadedState) {
            _nextToken = state.response?.nextToken;
            _refreshController.refreshCompleted();
            var list = state.response?.data ?? [];
            return AnimationLimiter(
                child: SmartRefresher(
              enablePullDown: true,
              header: MaterialClassicHeader(),
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
                                onTap: () =>
                                    Nav.to(TransactionOrderDetailsScreen(
                                  key: UniqueKey(),
                                  orderId: list[position].orderId,
                                )),
                              ),
                            ),
                          ),
                        );
                      },
                    )
                  : EmptyWidget(
                      messageKey: 'profile.transactions.noTransactions',
                    ),
            ));
          }
          return CenterLoadingWidget();
        },
      ),
    );
  }
}
