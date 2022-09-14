import 'dart:async';
import 'dart:io';

import '/core/core.dart';
import '/models.dart';
import '/models/Place.dart';
import '/modules/selectunit/selectunit.dart';
import '/shared/locale.dart';
import '/shared/nav.dart';
import '/shared/utils/deeplink_utils.dart';
import '/shared/utils/navigator.dart';
import '/shared/utils/stage_utils.dart';
import 'package:flutter/material.dart';
import 'package:qr_code_scanner/qr_code_scanner.dart';

import '../../../shared/widgets/back_button_widget.dart';

enum AnimationState { search, barcodeNear, barcodeFound, endSearch }

class QRCodeScannerWidget extends StatefulWidget {
  final Color frameColor;
  final double traceMultiplier;
  final Rectangle validRectangle;
  final Uri? initialUri;

  final bool navigateToCart;
  final bool popWhenClose;
  final bool loadUnits;

  QRCodeScannerWidget({
    this.initialUri,
    this.navigateToCart = false,
    this.loadUnits = true,
    this.popWhenClose = false,
    this.frameColor = kShrineScrim,
    this.traceMultiplier = 1.2,
    this.validRectangle = const Rectangle(width: 150, height: 150),
  });

  @override
  State<StatefulWidget> createState() => _QRCodeScannerWidgetState();
}

class _QRCodeScannerWidgetState extends State<QRCodeScannerWidget>
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
    if (widget.initialUri != null) {
      WidgetsBinding.instance.addPostFrameCallback(((timeStamp) {
        handleUri(widget.initialUri!);
      }));
    }
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
    return Container(
        height: MediaQuery.of(context).size.height * .9,
        // margin: EdgeInsets.only(top: 64.0),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.only(
            topLeft: Radius.circular(16.0),
            topRight: Radius.circular(16.0),
          ),
          color: theme.secondary0,
        ),
        padding: EdgeInsets.only(
          // top: 12.0,
          // left: 16.0,
          // right: 16.0,
          // bottom: 16.0,
          bottom: MediaQuery.of(context).viewInsets.bottom,
        ),
        child: Column(
          children: [
            Stack(
              children: [
                Align(
                  alignment: Alignment.topLeft,
                  child: Padding(
                    padding: const EdgeInsets.only(left: 8.0, top: 4.0),
                    child: BackButtonWidget(
                      // iconSize: 2,
                      showBorder: false,
                    ),
                  ),
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Padding(
                      padding: const EdgeInsets.only(top: 12.0),
                      child: Container(
                        height: 4.0,
                        width: 40.0,
                        margin: const EdgeInsets.only(bottom: 32.0),
                        decoration: BoxDecoration(
                          color: theme.secondary16,
                          borderRadius: const BorderRadius.all(
                            Radius.circular(8.0),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                Positioned(
                    right: 10,
                    child: isDev
                        ? IconButton(
                            icon: Icon(
                              Icons.qr_code_2,
                              color: Color(0xFF303030),
                            ),
                            onPressed: () async {
                              setState(() {
                                _unitId =
                                    'a-kesdobalo'; // seeded_unit_c1_g1_1_id -MGMw7p0gQsX31ZLZOkK
                                _place = Place(table: '01', seat: '02');
                                _qr_scan_state = false;
                              });
                            },
                          )
                        : Container()),
              ],
            ),
            Container(
              height: MediaQuery.of(context).size.height * .81,
              child: _qr_scan_state
                  ? Column(
                      children: [
                        Expanded(flex: 3, child: _buildQrScanningWidget()),
                        Expanded(
                          flex: 1,
                          child: Container(
                            color: theme.secondary0,
                            child: SingleChildScrollView(
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
                                        fontWeight: FontWeight.w500,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                      ],
                    )
                  : UnitFoundByQRCodeWidget(
                      place: _place!,
                      unitId: _unitId!,
                      loadUnits: widget.loadUnits,
                      navigateToCart: widget.navigateToCart,
                      popWhenClose: widget.popWhenClose,
                      onQRChecked: (valid) => Nav.pop<bool>(valid),
                    ),
            )
          ],
        ));
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

  void handleUri(Uri uri) {
    if (isValidQRUrl(uri)) {
      // await _takePicture();

      final unitId = uri.pathSegments[0];
      final table = uri.pathSegments[1];

      String? seat;
      if (uri.pathSegments.length == 3) {
        seat = uri.pathSegments[2];
      }
      final Place place = Place(table: table, seat: seat);
      // log.d('***** BARCODE.UNIT=$unitId, TABLE=$table, SEAT=$seat');
      // showNotification(context, 'New Seat Reserved', 'Seat $seat reserved at Table $table', null);

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
      log.d('********* BARCODE FOUND.uri=$uri');
      // log.d('********* BARCODE FOUND.uri.scheme=${uri.scheme}');
      // log.d('********* BARCODE FOUND.uri.path=${uri.path}');
      // log.d('********* BARCODE FOUND.uri.query=${uri.query}');
      // log.d('********* BARCODE FOUND.uri.origin=${uri.origin}');
      // log.d('********* BARCODE FOUND.uri.pathSegments=${uri.pathSegments}');
      // log.d('********* BARCODE FOUND.uri.port=${uri.port}');
      handleUri(uri);

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
