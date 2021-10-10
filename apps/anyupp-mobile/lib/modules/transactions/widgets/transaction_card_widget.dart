import 'package:fa_prev/core/dependency_indjection/dependency_injection.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/models/Transaction.dart';
import 'package:fa_prev/models/core/parsers.dart';
import 'package:fa_prev/modules/orders/orders.dart';
import 'package:fa_prev/modules/transactions/screens/order_details_screen.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/utils/format_utils.dart';
import 'package:fa_prev/shared/utils/navigator.dart';
import 'package:fa_prev/shared/widgets/transaction_info_widget.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class TransactionCard extends StatelessWidget {
  final Transaction transaction;

  TransactionCard({required this.transaction});
  final DateFormat parser = DateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
  final DateFormat formatter = DateFormat('yyyy-MM-dd HH:mm:ss');

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(
        top: 16.0,
        left: 12.0,
        right: 12.0,
      ),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(
          14.0,
        ),
        border: Border.all(
          width: 1.5,
          color: theme.secondary12,
        ),
        color: theme.secondary0,
      ),
      child: Container(
        padding: EdgeInsets.all(0.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.start,
          children: <Widget>[
            _buildTransactionHeader(context),
            _buildDivider(context),
            _buildTransactionDeatails(context),
            TransactionInfoWidget(transaction),
            _buildFooter(context),
          ],
        ),
      ),
    );
  }

  Widget _buildDivider(BuildContext context) {
    return Divider(
      color: theme.secondary64.withOpacity(0.4),
      height: 1.5,
    );
  }

  Widget _buildTransactionHeader(BuildContext context) {
    DateTime? dateTime = transaction.createdAt != null
        ? parser.parseUTC(transaction.createdAt!)
        : null;

    return ClipRect(
      child: Container(
        decoration: BoxDecoration(
            borderRadius: BorderRadius.only(
              topLeft: Radius.circular(14.0),
              topRight: Radius.circular(14.0),
            ),
            color: theme.secondary12),
        padding: EdgeInsets.only(
          top: 14.0,
          bottom: 14.0,
          left: 20.0,
          right: 20.0,
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Padding(
              padding: const EdgeInsets.only(
                right: 20.0,
              ),
              child: Text(
                dateTime == null ? '-' : formatter.format(dateTime.toLocal()),
                style: Fonts.satoshi(
                  fontSize: 12,
                  color: theme.secondary,
                ),
              ),
            ),
            GestureDetector(
              onTap: () {
                getIt<OrderBloc>()
                    .add(LoadOrderDetail(orderId: transaction.orderId));
                Nav.to(OrderDetailsScreenOld());
              },
              child: RichText(
                textAlign: TextAlign.center,
                text: TextSpan(
                  children: [
                    TextSpan(
                      text:
                          trans(context, 'profile.transactions.details') + ' ',
                      style: Fonts.satoshi(
                        fontSize: 14.0,
                        color: Color(0x993C2F2F),
                      ),
                    ),
                  ],
                ),
              ),
            )
          ],
        ),
      ),
    );
  }

  Widget _buildTransactionDeatails(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(
        top: 20.0,
        bottom: 20.0,
        left: 20.0,
        right: 20.0,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                trans(context, 'profile.transactions.status'),
                style: Fonts.satoshi(
                  fontSize: 14,
                  color: theme.secondary,
                  fontWeight: FontWeight.w700,
                ),
              ),
              Text(
                enumToString(transaction.status) ?? '-',
                style: Fonts.satoshi(
                  fontSize: 14,
                  color: theme.secondary,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ],
          ),
          SizedBox(
            height: 20,
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                trans(context, 'profile.transactions.paymentMethod'),
                style: Fonts.satoshi(
                  fontSize: 14,
                  color: theme.secondary,
                ),
              ),
              Text(
                transaction.type!,
                style: Fonts.satoshi(
                  fontSize: 14,
                  color: theme.secondary,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildFooter(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.only(
          bottomLeft: Radius.circular(14.0),
          bottomRight: Radius.circular(14.0),
        ),
        color: theme.secondary12,
      ),
      padding: EdgeInsets.only(
        top: 12.0,
        bottom: 20.0,
        left: 20.0,
        right: 20.0,
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            trans(context, 'orders.totalCost'),
            style: Fonts.satoshi(
              fontSize: 16,
              color: theme.secondary,
              fontWeight: FontWeight.w700,
            ),
          ),
          Text(
            formatCurrency(transaction.total, transaction.currency ?? 'ft'),
            style: Fonts.satoshi(
              fontSize: 16,
              color: theme.secondary,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }
}
