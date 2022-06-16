import 'package:fa_prev/modules/selectunit/widgets/flutter_qr_code_scanner.dart';
import 'package:flutter/material.dart';

void showQRScannerModal(BuildContext context, [Uri? initialUri]) {
  showModalBottomSheet(
    context: context,
    isDismissible: true,
    enableDrag: true,
    isScrollControlled: true,
    elevation: 4.0,
    backgroundColor: Colors.transparent,
    builder: (context) {
      return QRCodeScannerWidget(
        initialUri: initialUri,
        loadUnits: true,
      );
    },
  );
}
