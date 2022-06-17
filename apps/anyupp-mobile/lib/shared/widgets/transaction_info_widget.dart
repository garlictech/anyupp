import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/models/Transaction.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/utils/pdf_utils.dart';
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher_string.dart';

class TransactionInfoWidget extends StatelessWidget {
  final Transaction transactionItem;
  const TransactionInfoWidget(this.transactionItem);

  @override
  Widget build(BuildContext context) {
    if (transactionItem.receipt?.pdfData == null &&
        transactionItem.invoice?.pdfUrl == null) {
      return Container();
    }

    bool showInvoice = false;
    if (transactionItem.invoice?.pdfUrl != null) {
      showInvoice = true;
    } else if (transactionItem.receipt?.pdfData != null) {
      showInvoice = false;
    }
    return buildInfo(context, showInvoice);
  }

  Widget buildInfo(BuildContext context, bool isInvoice) {
    return Padding(
      padding: const EdgeInsets.all(20.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            isInvoice
                ? trans(context, 'payment.paymentInfo.invoicing.invoice_info')
                : trans(context, 'payment.paymentInfo.invoicing.receipt_info'),
            style: Fonts.satoshi(
              fontSize: 14,
              color: theme.secondary,
              fontWeight: FontWeight.w700,
            ),
          ),
          GestureDetector(
            onTap: () => isInvoice
                ? launchUrlString(transactionItem.invoice!.pdfUrl!)
                : createAndOpenPdf(transactionItem.receipt?.pdfData),
            child: Text(
              trans(context, 'payment.paymentInfo.invoicing.show'),
              style: Fonts.satoshi(
                fontSize: 14,
                color: theme.highlight,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
