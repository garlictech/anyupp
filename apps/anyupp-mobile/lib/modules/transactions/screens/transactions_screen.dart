import 'package:fa_prev/core/dependency_indjection/dependency_injection.dart';
import 'package:fa_prev/core/units/bloc/unit_select_bloc.dart';
import 'package:fa_prev/models/GeoUnit.dart';
import 'package:fa_prev/models/TransactionItem.dart';
import 'package:fa_prev/modules/transactions/widgets/transaction_card_widget.dart';
import 'package:fa_prev/shared/utils/navigator.dart';
import 'package:fa_prev/shared/widgets/app_bar.dart';
import 'package:fa_prev/shared/widgets/loading_widget.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_staggered_animations/flutter_staggered_animations.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:fa_prev/modules/transactions/transactions.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:pull_to_refresh/pull_to_refresh.dart';

class TransactionsScreen extends StatefulWidget {
  @override
  _TransactionsScreenState createState() => _TransactionsScreenState();
}

class _TransactionsScreenState extends State<TransactionsScreen> {
  RefreshController _refreshController =
      RefreshController(initialRefresh: false);

  void _onRefresh() async {
    getIt<TransactionsBloc>().add(Loading());
    getIt<TransactionsBloc>().add(LoadTransactions());

  }

  void _onLoading() async {
    _refreshController.loadComplete();
  }

  Widget build(BuildContext context) {
    return Scaffold(
      appBar: appBar(theme,
          onBackButtonPressed: () => Nav.pop(),
          title: trans('profile.menu.transactions')),
      // The appBar head text
      backgroundColor: theme.background,
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
        if (state is TransactionsInitial) {
          getIt<TransactionsBloc>().add(LoadTransactions());
        }
        if (state is TransactionsLoadedState) {
          _refreshController.refreshCompleted();
          return _buildList(state.items);
          // }
        }
        return CenterLoadingWidget();
      },
    );
  }

  Widget _buildList(List<TransactionItem> list) {
    return AnimationLimiter(
        child: SmartRefresher(
      enablePullDown: true,
      header: WaterDropHeader(),
      footer: CustomFooter(
        builder: (BuildContext context, LoadStatus mode) {
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
                return AnimationConfiguration.staggeredList(
                  position: position,
                  duration: const Duration(milliseconds: 375),
                  child: SlideAnimation(
                    verticalOffset: 50.0,
                    child: FadeInAnimation(
                      child: TransactionCard(
                        transactionItem: list[position],
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
    return Container(
      child: Center(
        child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: <Widget>[
              Text(
                trans('profile.transactions.noTransactions'),
                style: GoogleFonts.poppins(
                  fontSize: 18.0,
                  fontWeight: FontWeight.bold,
                  color: theme.text,
                ),
              )
            ]),
      ),
    );
  }
}
