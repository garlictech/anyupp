import 'dart:async';
import 'dart:io';

import 'package:fa_prev/models.dart';
import 'package:fa_prev/models/Place.dart';
import 'package:fa_prev/modules/screens.dart';
import 'package:fa_prev/modules/selectunit/screens/unit_found_by_qr_code_screen.dart';
import 'package:fa_prev/modules/selectunit/selectunit.dart';
import 'package:fa_prev/modules/selectunit/widgets/barcode_scanner_widgets.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/nav.dart';
import 'package:fa_prev/shared/utils/deeplink_utils.dart';
import 'package:fa_prev/shared/utils/navigator.dart';
import 'package:flutter/material.dart';
import 'package:qr_code_scanner/qr_code_scanner.dart';


class QRCodeScannerScreen extends StatefulWidget {
  final Color frameColor;
  final double traceMultiplier;
  // TODO navigation hack, should replace with navigation bloc
  final bool navigateToCart;

  QRCodeScannerScreen({
    this.navigateToCart = false,
    this.frameColor = kShrineScrim,
    this.traceMultiplier = 1.2,
  });

  @override
  State<StatefulWidget> createState() => _QRCodeScannerScreenState();
}

class _QRCodeScannerScreenState extends State<QRCodeScannerScreen> {
  Barcode result;
  QRViewController controller;
  final GlobalKey qrKey = GlobalKey(debugLabel: 'QR');
  bool flashState = false;

  @override
  void initState() {
    setFlashState();
    // TODO: implement initState
    super.initState();
  }

  Future<void> setFlashState() async {
    this.flashState = await controller.getFlashStatus();
    setState(() {});
  }

  // In order to get hot reload to work we need to pause the camera if the platform
  // is android, or resume the camera if the platform is iOS.
  @override
  void reassemble() {
    super.reassemble();
    if (Platform.isAndroid) {
      controller.pauseCamera();
    }
    controller.resumeCamera();
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Scaffold(
        body: Stack(
          children: <Widget>[
            _buildQrView(context),
            Positioned(
              left: 0,
              right: 0,
              top: 0,
              child: Container(
                height: 56,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: const <Color>[Colors.black87, Colors.transparent],
                  ),
                ),
              ),
            ),
            Positioned(
              left: 0.0,
              bottom: 0.0,
              right: 0.0,
              height: 56,
              child: Container(
                color: kShrinePink50,
                child: Center(
                  child: Text(
                    trans('qrScan.pointCamera'),
                    style: Theme.of(context).textTheme.button,
                  ),
                ),
              ),
            ),
            AppBar(
              leading: IconButton(
                icon: const Icon(Icons.close, color: Colors.white),
                onPressed: () => Nav.pop(),
              ),
              backgroundColor: Colors.transparent,
              elevation: 0.0,
              actions: <Widget>[
                IconButton(
                  icon: Icon(
                    flashState ? Icons.flash_off : Icons.flash_on,
                    color: Colors.white,
                  ),
                  onPressed: () async {
                    await controller.toggleFlash();
                    await setFlashState();
                    setState(() {});
                  },
                ),
                IconButton(
                  icon: const Icon(
                    Icons.help_outline,
                    color: Colors.white,
                  ),
                  onPressed: () {},
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQrView(BuildContext context) {
    // For this example we check how width or tall the device is and change the scanArea and overlay accordingly.
    var scanArea = (MediaQuery.of(context).size.width < 400 ||
            MediaQuery.of(context).size.height < 400)
        ? 250.0
        : 400.0;
    // To ensure the Scanner view is properly sizes after rotation
    // we need to listen for Flutter SizeChanged notification and update controller
    return QRView(
      key: qrKey,
      onQRViewCreated: _onQRViewCreated,
      overlay: QrScannerOverlayShape(
          borderColor: kShrineFrameBrown,
          borderRadius: 10,
          borderLength: 30,
          borderWidth: 10,
          cutOutSize: scanArea),
    );
  }

  void _onQRViewCreated(QRViewController controller) {
    setState(() {
      this.controller = controller;
    });
    controller.scannedDataStream.listen((scanData) {
      final Uri uri = Uri.parse(scanData.code);
      // print('********* BARCODE FOUND.uri.scheme=${uri.scheme}');
      // print('********* BARCODE FOUND.uri.path=${uri.path}');
      // print('********* BARCODE FOUND.uri.query=${uri.query}');
      // print('********* BARCODE FOUND.uri.origin=${uri.origin}');
      // print('********* BARCODE FOUND.uri.pathSegments=${uri.pathSegments}');
      // print('********* BARCODE FOUND.uri.port=${uri.port}');

      if (isValidQRUrl(uri)) {
        // await _takePicture();

        final unitId = uri.pathSegments[0];
        final table = uri.pathSegments[1];
        final seat = uri.pathSegments[2];
        final Place place = Place(table: table, seat: seat);
        // print('***** BARCODE.UNIT=$unitId, TABLE=$table, SEAT=$seat');
        // showNotification(context, 'New Seat Reserved', 'Seat $seat reversed at Table $table', null);
        Nav.reset(UnitFoundByQRCodeScreen(
          place: place,
          unitId: unitId,
          navigateToCart: widget.navigateToCart,
        ));
        return;
      }
      setState(() {
        result = scanData;
      });
    });
  }

  @override
  void dispose() {
    controller?.dispose();
    super.dispose();
  }
}
