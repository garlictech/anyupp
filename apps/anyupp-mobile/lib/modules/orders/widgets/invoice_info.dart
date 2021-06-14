import 'dart:convert';
import 'dart:io';

import 'package:fa_prev/models/Order.dart';
import 'package:fa_prev/shared/utils/navigator.dart';
import 'package:fa_prev/shared/widgets/app_bar.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:open_file/open_file.dart';
import 'package:path_provider/path_provider.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:webview_flutter/webview_flutter.dart';

class TransactionInfoWidget extends StatelessWidget {
  final Order order;
  const TransactionInfoWidget(this.order);

  @override
  Widget build(BuildContext context) {
    bool showInvoice;
    if (order.transactionItem?.invoice?.pdfUrl != null) {
      showInvoice = true;
    } else if (order.transactionItem?.receipt?.pdfData != null) {
      showInvoice = false;
    }
    if (showInvoice == null) {
      return Container();
    } else if (showInvoice) {
      return buildInfo(context, true);
    } else {
      return buildInfo(context, false);
    }
  }

  createAndOpenPdf(String baseString) async {
    if (baseString != null) {
      var bytes = base64Decode(baseString.replaceAll('\n', ''));
      final output = await getTemporaryDirectory();
      final file = File("${output.path}/temp.pdf");
      await file.writeAsBytes(bytes.buffer.asUint8List());
      await OpenFile.open("${output.path}/temp.pdf");
    }
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
            style: GoogleFonts.poppins(
              fontSize: 14,
              color: theme.text,
              fontWeight: FontWeight.w700,
            ),
          ),
          GestureDetector(
            onTap: () => isInvoice
                ? Navigator.push(context,
                    MaterialPageRoute(builder: (context) => PdfWebView(order.transactionItem?.invoice?.pdfUrl)))
                : createAndOpenPdf(order.transactionItem?.receipt?.pdfData),
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

class PdfWebView extends StatefulWidget {
  final String url;
  PdfWebView(this.url, {Key key}) : super(key: key);

  @override
  _PdfWebViewState createState() => _PdfWebViewState();
}

class _PdfWebViewState extends State<PdfWebView> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: appBar(theme,
          onBackButtonPressed: () => Nav.pop()),
      body: WebView(
        initialUrl: widget.url,
        javascriptMode: JavascriptMode.unrestricted,
      ),
    );
  }
}
