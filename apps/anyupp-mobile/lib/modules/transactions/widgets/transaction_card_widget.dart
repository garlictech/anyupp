import '/core/theme/theme.dart';
import '/models/Transaction.dart';
import '/models/core/parsers.dart';
import '/shared/locale.dart';
import '/shared/utils/format_utils.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class TransactionCard extends StatelessWidget {
  final Transaction transaction;
  final GestureTapCallback? onTap;

  TransactionCard({required this.transaction, this.onTap});
  final DateFormat parser = DateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
  final DateFormat formatter = DateFormat('yyyy.MM.dd');

  @override
  Widget build(BuildContext context) {
    DateTime? dateTime = transaction.createdAt != null
        ? parser.parseUTC(transaction.createdAt!)
        : null;

    return InkWell(
      onTap: onTap,
      child: Container(
        padding: EdgeInsets.only(
          top: 16.0,
          left: 16.0,
          right: 16.0,
        ),
        child: Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      dateTime == null
                          ? '-'
                          : formatter.format(dateTime.toLocal()),
                      style: Fonts.satoshi(
                        color: theme.secondary,
                        fontSize: 16.0,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    Text(
                      trans(context,
                          'profile.transactions.status.${enumToString(transaction.status)}'),
                      style: Fonts.satoshi(
                        color: theme.secondary,
                        fontSize: 14.0,
                        fontWeight: FontWeight.w400,
                      ),
                    )
                  ],
                ),
                Spacer(),
                Text(
                  formatCurrency(
                      transaction.total, transaction.currency ?? 'Ft'),
                  style: Fonts.satoshi(
                    color: theme.secondary,
                    fontSize: 14.0,
                    fontWeight: FontWeight.w400,
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.only(
                    bottom: 4.0,
                    left: 8.0,
                  ),
                  child: Icon(
                    Icons.chevron_right,
                    color: theme.secondary40,
                    size: 24,
                  ),
                ),
              ],
            ),
            Padding(
              padding: const EdgeInsets.only(top: 16.0),
              child: Divider(
                height: 1.0,
                color: theme.secondary12,
              ),
            )
          ],
        ),
      ),
    );
  }
}
