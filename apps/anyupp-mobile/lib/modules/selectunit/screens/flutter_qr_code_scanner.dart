import 'dart:async';
import 'dart:io';

import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/models/Place.dart';
import 'package:fa_prev/modules/selectunit/selectunit.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/nav.dart';
import 'package:fa_prev/shared/utils/deeplink_utils.dart';
import 'package:fa_prev/shared/utils/navigator.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:qr_code_scanner/qr_code_scanner.dart';

enum AnimationState { search, barcodeNear, barcodeFound, endSearch }

class QRCodeScannerScreen extends StatefulWidget {
  final Color frameColor;
  final double traceMultiplier;
  final Rectangle validRectangle;

  final bool navigateToCart;
  final bool popWhenClose;
  final bool loadUnits;

  QRCodeScannerScreen({
    this.navigateToCart = false,
    this.loadUnits = true,
    this.popWhenClose = false,
    this.frameColor = kShrineScrim,
    this.traceMultiplier = 1.2,
    this.validRectangle = const Rectangle(width: 150, height: 150),
  });

  @override
  State<StatefulWidget> createState() => _QRCodeScannerScreenState();
}

class _QRCodeScannerScreenState extends State<QRCodeScannerScreen>
    with TickerProviderStateMixin {
  Barcode? result;
  late QRViewController controller;
  final GlobalKey qrKey = GlobalKey(debugLabel: 'QR');
  bool flashState = false;

  String? _unitId;
  Place? _place;
  bool _qr_scan_state = true;

  @override
  void initState() {
    super.initState();
    setToolbarThemeV1(theme);
  }

  Future<void> setFlashState() async {
    this.flashState = await controller.getFlashStatus() ?? false;
    setState(() {});
  }

  // In order to get hot reload to work we need to pause the camera if the platform
  // is android, or resume the camera if the platform is iOS.
  @override
  void reassemble() {
    super.reassemble();
    if (Platform.isAndroid) {
      controller.pauseCamera();
    } else if (Platform.isIOS) {
      controller.resumeCamera();
    }
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Scaffold(
        appBar: _qr_scan_state == true
            ? AppBar(
                backgroundColor: theme.secondary0,
                leading: BackButtonWidget(
                  color: theme.secondary,
                  showBorder: false,
                  iconSize: 24.0,
                ),
                // actions: isDev
                //     ? [
                //         IconButton(
                //           icon: Icon(Icons.qr_code_2),
                //           onPressed: () async {
                //             setState(() {
                //               _unitId = 'seeded_unit_c1_g1_1_id';
                //               _place = Place(table: '01', seat: '02');
                //               _qr_scan_state = false;
                //             });
                //           },
                //         ),
                //       ]
                //     : null,
              )
            : null,
        body:
            _qr_scan_state ? _buildQrScanningWidget() : _buildUnitFoundWidget(),
      ),
    );
  }

  Widget _buildUnitFoundWidget() {
    return Container(
      child: UnitFoundByQRCodeWidget(
        place: _place!,
        unitId: _unitId!,
        loadUnits: widget.loadUnits,
        navigateToCart: widget.navigateToCart,
        popWhenClose: widget.popWhenClose,
        onQRChecked: (valid) => Nav.pop<bool>(valid),
      ),
    );
  }

  Widget _buildQrScanningWidget() {
    return Stack(
      children: <Widget>[
        _buildQrView(context),
        Positioned(
          right: 0.0,
          top: 0.0,
          child: IconButton(
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
        ),
        Positioned(
          left: 0.0,
          bottom: 0.0,
          right: 0.0,
          // height: 56,
          child: Container(
            color: theme.secondary0,
            child: Column(
              children: [
                Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 32.0,
                    vertical: 16.0,
                  ),
                  child: Text(
                    trans('qrScan.info'),
                    textAlign: TextAlign.center,
                    style: Fonts.satoshi(
                      fontSize: 18.0,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.only(
                    bottom: 32.0,
                    left: 64.0,
                    right: 64.0,
                  ),
                  child: Text(
                    trans('qrScan.infoDesc'),
                    textAlign: TextAlign.center,
                    style: Fonts.satoshi(
                      fontSize: 14.0,
                      fontWeight: FontWeight.w400,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
        // Container(
        //   constraints: const BoxConstraints.expand(),
        //   child: CustomPaint(
        //     painter: _animationPainter,
        //   ),
        // ),
      ],
    );
  }

  Widget _buildQrView(BuildContext context) {
    return QRView(
      key: qrKey,
      onQRViewCreated: _onQRViewCreated,
      overlay: QrScannerOverlayShapeExt(
        borderColor: theme.secondary16,
        borderRadius: 16.0,
        borderLength: 52,
        borderWidth: 4,
        borderPadding: 20,
        cutOutSize: widget.validRectangle.height,
        // cutOutBottomOffset: 16.0,

        overlayColor: Colors.black.withOpacity(0.7),
      ),
    );
  }

  void _onQRViewCreated(QRViewController controller) {
    setState(() {
      this.controller = controller;
    });
    controller.scannedDataStream.listen((scanData) async {
      if (scanData.code == null) {
        return;
      }

      final Uri uri = Uri.parse(scanData.code!);
      print('********* BARCODE FOUND.uri=$uri');
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

        setState(() {
          _unitId = unitId;
          _place = place;
          _qr_scan_state = false;
        });

        // bool? result = await Nav.toWithResult<bool>(UnitFoundByQRCodeScreen(
        //   place: place,
        //   unitId: unitId,
        //   navigateToCart: widget.navigateToCart,
        //   loadUnits: widget.loadUnits,
        //   popWhenClose: widget.popWhenClose,
        // ));
        // Nav.pop(result);
        controller.dispose();
      }
      setState(() {
        result = scanData;
      });
    });
  }

  @override
  void dispose() {
    // _currentState = AnimationState.endSearch;
    // _animationController?.dispose();
    controller.dispose();
    super.dispose();
  }
}
