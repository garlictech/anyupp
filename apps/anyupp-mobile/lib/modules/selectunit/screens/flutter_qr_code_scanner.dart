import 'dart:async';
import 'dart:io';
import 'dart:ui';

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
  final Rectangle validRectangle;

  // TODO navigation hack, should replace with navigation bloc
  final bool navigateToCart;

  QRCodeScannerScreen({
    this.navigateToCart = false,
    this.frameColor = kShrineScrim,
    this.traceMultiplier = 1.2,
    this.validRectangle = const Rectangle(width: 150, height: 150),
  });

  @override
  State<StatefulWidget> createState() => _QRCodeScannerScreenState();
}

class _QRCodeScannerScreenState extends State<QRCodeScannerScreen>
    with TickerProviderStateMixin {
  Barcode result;
  QRViewController controller;
  final GlobalKey qrKey = GlobalKey(debugLabel: 'QR');
  bool flashState = false;

  AnimationController _animationController;
  bool _closeWindow = false;
  bool _streaming = false;
  String _barcodePictureFilePath;
  Size _previewSize;
  AnimationState _currentState = AnimationState.search;
  CustomPainter _animationPainter;
  int _animationStart = DateTime.now().millisecondsSinceEpoch;

  @override
  void initState() {
    setFlashState();
    _switchAnimationState(AnimationState.search);
    // TODO: implement initState
    super.initState();
  }

  Future<void> setFlashState() async {
    this.flashState = await controller.getFlashStatus();
    setState(() {});
  }

  void _initAnimation(Duration duration) {
    setState(() {
      _animationPainter = null;
    });

    _animationController?.dispose();
    _animationController = AnimationController(duration: duration, vsync: this);
  }

  void _switchAnimationState(AnimationState newState) {
    if (newState == AnimationState.search) {
      _initAnimation(const Duration(milliseconds: 750));

      _animationPainter = RectangleOutlinePainter(
        animation: RectangleTween(
          Rectangle(
            width: widget.validRectangle.width,
            height: widget.validRectangle.height,
            color: Colors.white,
          ),
          Rectangle(
            width: widget.validRectangle.width * widget.traceMultiplier,
            height: widget.validRectangle.height * widget.traceMultiplier,
            color: Colors.transparent,
          ),
        ).animate(_animationController),
      );

      _animationController.addStatusListener((AnimationStatus status) {
        if (status == AnimationStatus.completed) {
          Future<void>.delayed(const Duration(milliseconds: 1600), () {
            if (_currentState == AnimationState.search) {
              _animationController.forward(from: 0);
            }
          });
        }
      });
    } else if (newState == AnimationState.barcodeNear ||
        newState == AnimationState.barcodeFound ||
        newState == AnimationState.endSearch) {
      double begin;
      if (_currentState == AnimationState.barcodeNear) {
        begin = lerpDouble(0.0, 0.5, _animationController.value);
      } else if (_currentState == AnimationState.search) {
        _initAnimation(const Duration(milliseconds: 500));
        begin = 0.0;
      }

      _animationPainter = RectangleTracePainter(
        rectangle: Rectangle(
          width: widget.validRectangle.width,
          height: widget.validRectangle.height,
          color: newState == AnimationState.endSearch
              ? Colors.transparent
              : Colors.white,
        ),
        animation: Tween<double>(
          begin: begin,
          end: newState == AnimationState.barcodeNear ? 0.5 : 1.0,
        ).animate(_animationController),
      );

      if (newState == AnimationState.barcodeFound) {
        _animationController.addStatusListener((AnimationStatus status) {
          if (status == AnimationStatus.completed) {
            Future<void>.delayed(const Duration(milliseconds: 300), () {
              if (_currentState != AnimationState.endSearch) {
                _switchAnimationState(AnimationState.endSearch);
                setState(() {});
                // _showBottomSheet();
              }
            });
          }
        });
      }
    }

    _currentState = newState;
    if (newState != AnimationState.endSearch) {
      _animationController.forward(from: 0);
      _animationStart = DateTime.now().millisecondsSinceEpoch;
    }
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
            Container(
              constraints: const BoxConstraints.expand(),
              child: CustomPaint(
                painter: WindowPainter(
                  windowSize: Size(widget.validRectangle.width,
                      widget.validRectangle.height),
                  outerFrameColor: widget.frameColor,
                  closeWindow: _closeWindow,
                  innerFrameColor: _currentState == AnimationState.endSearch
                      ? Colors.transparent
                      : kShrineFrameBrown,
                ),
              ),
            ),
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
            Container(
              constraints: const BoxConstraints.expand(),
              child: CustomPaint(
                painter: _animationPainter,
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
                    flashState ? Icons.flash_on : Icons.flash_off,
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
    return QRView(
      key: qrKey,
      onQRViewCreated: _onQRViewCreated,
      overlay: QrScannerOverlayShape(
          //borderColor: kShrineFrameBrown,
          borderRadius: 0,
          borderLength: 0,
          borderWidth: 0,
          cutOutSize: widget.validRectangle.height),
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
    _currentState = AnimationState.endSearch;
    _animationController?.dispose();
    controller?.dispose();
    super.dispose();
  }
}
