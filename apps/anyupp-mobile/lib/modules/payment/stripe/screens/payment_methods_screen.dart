import '/core/core.dart';
import '/models.dart';
import '/modules/cart/cart.dart';
import '/modules/payment/stripe/stripe.dart';
import '/shared/locale.dart';
import '/shared/utils/navigator.dart';
import '/shared/widgets.dart';
import '/shared/widgets/platform_alert_dialog.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_slidable/flutter_slidable.dart';
import 'package:pull_to_refresh/pull_to_refresh.dart';

class StripePaymentMethodsScreen extends StatefulWidget {
  @override
  _StripePaymentMethodsScreenState createState() =>
      _StripePaymentMethodsScreenState();
}

class _StripePaymentMethodsScreenState
    extends State<StripePaymentMethodsScreen> {
  int selectedItem = 0;
  int? initialIndex;
  bool _loading = false;
  RefreshController _refreshController =
      RefreshController(initialRefresh: false);

  @override
  void initState() {
    super.initState();
    getIt<StripePaymentBloc>().add(PaymentMethodListEvent());
  }

  void _onRefresh() async {
    getIt<StripePaymentBloc>().add(PaymentMethodListEvent());
    _refreshController.refreshCompleted();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: theme.secondary0,
      appBar: _loading
          ? null
          : CustomAppBar(
              title: trans('payment.stripe.title'),
              elevation: 4.0,
            ),
      body: SmartRefresher(
        enablePullDown: true,
        header: MaterialClassicHeader(),
        controller: _refreshController,
        onRefresh: _onRefresh,
        child: BlocListener<StripePaymentBloc, StripePaymentState>(
          listener: (context, state) {
            if (state is StripeCardCreated) {
              showSuccessDialog(
                context: context,
                title: trans('payment.manageCard.success'),
                message: trans('payment.manageCard.card_added'),
              );
              getIt<StripePaymentBloc>().add(PaymentMethodListEvent());
            }
            if (state is StripeError) {
              Nav.pop();
            }
          },
          child: BlocBuilder<StripePaymentBloc, StripePaymentState>(
            builder: (context, StripePaymentState state) {
              if (state is StripePaymentMethodsList) {
                return _buildCardList(state.data!);
              }
              return Scaffold(body: CenterLoadingWidget());
            },
          ),
        ),
      ),
    );
  }

  Widget _buildCardList(List<StripePaymentMethod> cards) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        ListView.separated(
          shrinkWrap: true,
          itemCount: cards.length,
          physics: BouncingScrollPhysics(),
          separatorBuilder: (context, index) => Divider(
            height: 1.0,
            color: theme.secondary16,
          ),
          itemBuilder: (context, index) {
            StripePaymentMethod method = cards[index];
            return Slidable(
              child: CardListTileWidget(
                method: method,
              ),
              actionPane: SlidableDrawerActionPane(),
              actionExtentRatio: 0.25,
              secondaryActions: <Widget>[
                IconSlideAction(
                  color: theme.secondary0,
                  iconWidget: CircleAvatar(
                    backgroundColor: theme.secondary12,
                    child: Icon(
                      Icons.delete,
                      color: theme.secondary,
                    ),
                  ),
                  onTap: () => _showDeleteCardDialog(method),
                ),
              ],
            );
          },
        ),
        AddNewPaymentMethodTextLinkWidget(),
      ],
    );
  }

  Future<void> _showDeleteCardDialog(StripePaymentMethod method) async {
    await showDialog(
      context: context,
      builder: (BuildContext context) {
        return PlatformAlertDialog(
          title: transEx(context, 'payment.delete.title'),
          description: transEx(context, 'payment.delete.description'),
          cancelButtonText: transEx(context, 'payment.delete.cancel'),
          okButtonText: transEx(context, 'payment.delete.ok'),
          onOkPressed: () async {
            Nav.pop();
            log.d('Deleting card=${method.id}');
            if (method.id != null) {
              getIt<StripePaymentBloc>().add(DeleteStripeCardEvent(method.id!));
            }
          },
          onCancelPressed: () {
            Nav.pop();
          },
        );
      },
    );
  }
}
