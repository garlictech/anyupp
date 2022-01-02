import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/cart/cart.dart';
import 'package:fa_prev/modules/payment/stripe/stripe.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/utils/navigator.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_slidable/flutter_slidable.dart';

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

  @override
  void initState() {
    super.initState();
    getIt<StripePaymentBloc>().add(PaymentMethodListEvent());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: theme.secondary0,
      appBar: _loading
          ? null
          : CustomAppBar(
              title: trans('payment.title'),
              elevation: 4.0,
            ),
      body: BlocListener<StripePaymentBloc, StripePaymentState>(
        listener: (context, state) {
          if (state is StripeCardCreated) {
            showSuccessDialog(
              context,
              trans("payment.manageCard.success"),
              trans("payment.manageCard.card_added"),
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
        return AlertDialog(
          title: Text(transEx(context, 'payment.delete.title')),
          content: Text(transEx(context, 'payment.delete.description')),
          // actionsAlignment: MainAxisAlignment.spaceBetween,
          actions: [
            TextButton(
              child: Text(transEx(context, 'payment.delete.cancel')),
              onPressed: () {
                Nav.pop();
              },
            ),
            TextButton(
              child: Text(transEx(context, 'payment.delete.ok')),
              onPressed: () async {
                Nav.pop();
                print('Deleting card=${method.id}');
                if (method.id != null) {
                  getIt<StripePaymentBloc>()
                      .add(DeleteStripeCardEvent(method.id!));
                }
              },
            ),
          ],
        );
      },
    );
  }
}
