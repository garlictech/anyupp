import 'package:fa_prev/models/Order.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/core/theme/theme.dart';

class InvoiceInfoWidget extends StatelessWidget {
  final Order order;
  const InvoiceInfoWidget(this.order);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(20.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            trans(context, 'payment.paymentInfo.invoicing.invoice_info'),
            style: GoogleFonts.poppins(
              fontSize: 14,
              color: theme.text,
              fontWeight: FontWeight.w700,
            ),
          ),
          GestureDetector(
            onTap: () => launch(order.transactionItem?.invoice?.pdfUrl),
            child: Text(
              trans(context, 'payment.paymentInfo.invoicing.show'),
              style: GoogleFonts.poppins(
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
