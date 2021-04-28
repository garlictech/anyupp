// import 'dart:async';
// import 'dart:io';
// import 'dart:ui' show lerpDouble;

// import 'package:camera/camera.dart';
// import 'package:fa_prev/modules/selectunit/selectunit.dart';
// import 'package:fa_prev/shared/locale.dart';
// import 'package:fa_prev/modules/screens.dart';
// import 'package:fa_prev/models.dart';
// import 'package:fa_prev/shared/utils/deeplink_utils.dart';
// import 'package:fa_prev/shared/nav.dart';
// import 'package:fa_prev/shared/widgets.dart';
// import 'package:firebase_ml_vision/firebase_ml_vision.dart';
// import 'package:flutter/foundation.dart';
// import 'package:flutter/material.dart';
// import 'package:permission_handler/permission_handler.dart';

// enum AnimationState { search, barcodeNear, barcodeFound, endSearch }

// class SelectUnitQRCodeScannerScreen extends StatefulWidget {
//   const SelectUnitQRCodeScannerScreen({
//     this.navigateToCart = false,
//     this.validRectangle = const Rectangle(width: 150, height: 150),
//     this.frameColor = kShrineScrim,
//     this.traceMultiplier = 1.2,
//   });

//   final Rectangle validRectangle;
//   final Color frameColor;
//   final double traceMultiplier;
//   // TODO navigation hack, should replace with navigation bloc
//   final bool navigateToCart;

//   @override
//   _SelectUnitQRCodeScannerScreenState createState() => _SelectUnitQRCodeScannerScreenState();
// }

// class _SelectUnitQRCodeScannerScreenState extends State<SelectUnitQRCodeScannerScreen> with TickerProviderStateMixin {
//   CameraController _cameraController;
//   AnimationController _animationController;
//   String _scannerHint;
//   bool _closeWindow = false;
//   bool _streaming = false;
//   String _barcodePictureFilePath;
//   Size _previewSize;
//   AnimationState _currentState = AnimationState.search;
//   CustomPainter _animationPainter;
//   int _animationStart = DateTime.now().millisecondsSinceEpoch;
//   final BarcodeDetector _barcodeDetector = FirebaseVision.instance.barcodeDetector();

//   @override
//   void initState() {
//     super.initState();

//     // SystemChrome.setEnabledSystemUIOverlays(<SystemUiOverlay>[]);
//     // SystemChrome.setPreferredOrientations(
//     //   <DeviceOrientation>[DeviceOrientation.portraitUp],
//     // );
//     _checkCameraPermissions();
//   }

//   void _initCameraAndScanner() async {
//     print('_initCameraAndScanner().getCamera()');
//     await ScannerUtils.getCamera(CameraLensDirection.back).then(
//       (CameraDescription camera) async {
//         print('_initCameraAndScanner()._openCamera()');
//         await _openCamera(camera);
//         print('_initCameraAndScanner()._startStreamingImagesToScanner()');
//         await _startStreamingImagesToScanner(camera.sensorOrientation);
//         _switchAnimationState(AnimationState.search);
//       },
//     );
//   }

//   void _initAnimation(Duration duration) {
//     setState(() {
//       _animationPainter = null;
//     });

//     _animationController?.dispose();
//     _animationController = AnimationController(duration: duration, vsync: this);
//   }

//   void _switchAnimationState(AnimationState newState) {
//     if (newState == AnimationState.search) {
//       _initAnimation(const Duration(milliseconds: 750));

//       _animationPainter = RectangleOutlinePainter(
//         animation: RectangleTween(
//           Rectangle(
//             width: widget.validRectangle.width,
//             height: widget.validRectangle.height,
//             color: Colors.white,
//           ),
//           Rectangle(
//             width: widget.validRectangle.width * widget.traceMultiplier,
//             height: widget.validRectangle.height * widget.traceMultiplier,
//             color: Colors.transparent,
//           ),
//         ).animate(_animationController),
//       );

//       _animationController.addStatusListener((AnimationStatus status) {
//         if (status == AnimationStatus.completed) {
//           Future<void>.delayed(const Duration(milliseconds: 1600), () {
//             if (_currentState == AnimationState.search) {
//               _animationController.forward(from: 0);
//             }
//           });
//         }
//       });
//     } else if (newState == AnimationState.barcodeNear ||
//         newState == AnimationState.barcodeFound ||
//         newState == AnimationState.endSearch) {
//       double begin;
//       if (_currentState == AnimationState.barcodeNear) {
//         begin = lerpDouble(0.0, 0.5, _animationController.value);
//       } else if (_currentState == AnimationState.search) {
//         _initAnimation(const Duration(milliseconds: 500));
//         begin = 0.0;
//       }

//       _animationPainter = RectangleTracePainter(
//         rectangle: Rectangle(
//           width: widget.validRectangle.width,
//           height: widget.validRectangle.height,
//           color: newState == AnimationState.endSearch ? Colors.transparent : Colors.white,
//         ),
//         animation: Tween<double>(
//           begin: begin,
//           end: newState == AnimationState.barcodeNear ? 0.5 : 1.0,
//         ).animate(_animationController),
//       );

//       if (newState == AnimationState.barcodeFound) {
//         _animationController.addStatusListener((AnimationStatus status) {
//           if (status == AnimationStatus.completed) {
//             Future<void>.delayed(const Duration(milliseconds: 300), () {
//               if (_currentState != AnimationState.endSearch) {
//                 _switchAnimationState(AnimationState.endSearch);
//                 setState(() {});
//                 // _showBottomSheet();
//               }
//             });
//           }
//         });
//       }
//     }

//     _currentState = newState;
//     if (newState != AnimationState.endSearch) {
//       _animationController.forward(from: 0);
//       _animationStart = DateTime.now().millisecondsSinceEpoch;
//     }
//   }

//   Future<void> _checkCameraPermissions() async {
//     print('_checkCameraPermissions()');
//     if (!await Permission.camera.request().isGranted) {
//       if (await Permission.camera.isPermanentlyDenied) {
//         print('_checkCameraPermissions().PermanentlyDenied!');
//         await showConfirmDialog(
//           context,
//           title: trans('qrScan.permission.denied.title'),
//           message: trans('qrScan.permission.denied.message'),
//           cancelText: trans('qrScan.permission.denied.cancel'),
//           confirmText: trans('qrScan.permission.denied.confirm'),
//           onCancel: () {
//             if (widget.navigateToCart) {
//               Nav.reset(MainNavigation(pageIndex: widget.navigateToCart ? 4 : 0));
//             } else {
//               Nav.pop();
//             }
//           },
//           onConfirm: () {
//             print('_checkCameraPermissions().PermanentlyDenied.onConfirm()');
//             openAppSettings();
//             Nav.pop();
//           },
//         );
//       } else {
//         print('_checkCameraPermissions().notGranted!');
//         await showConfirmDialog(
//           context,
//           title: trans('qrScan.permission.notGranted.title'),
//           message: trans('qrScan.permission.notGranted.message'),
//           cancelText: trans('qrScan.permission.notGranted.cancel'),
//           confirmText: trans('qrScan.permission.notGranted.confirm'),
//           onCancel: () {
//             print('_checkCameraPermissions().onCancel()');

//             if (widget.navigateToCart) {
//               Nav.reset(MainNavigation(pageIndex: widget.navigateToCart ? 4 : 0));
//             } else {
//               Nav.pop();
//             }
//           },
//           onConfirm: () {
//             print('_checkCameraPermissions().onConfirm()');
//             _checkCameraPermissions();
//           },
//         );
//       }
//     } else {
//       _initCameraAndScanner();
//     }
//   }

//   Future<void> _openCamera(CameraDescription camera) async {
//     final ResolutionPreset preset =
//         defaultTargetPlatform == TargetPlatform.android ? ResolutionPreset.medium : ResolutionPreset.medium;

//     _cameraController = CameraController(camera, preset, enableAudio: false);
//     await _cameraController.initialize();

//     _previewSize = _cameraController.value.previewSize;
//     setState(() {});
//   }

//   Future<void> _startStreamingImagesToScanner(int sensorOrientation) async {
//     bool isDetecting = false;
//     final MediaQueryData data = MediaQuery.of(context);

//     this._streaming = true;

//     await _cameraController.startImageStream((CameraImage image) {
//       if (isDetecting) {
//         return;
//       }

//       isDetecting = true;

//       ScannerUtils.detect(
//         image: image,
//         detectInImage: _barcodeDetector.detectInImage,
//         imageRotation: sensorOrientation,
//       ).then(
//         (dynamic result) {
//           // if (result.length > 0) {
//           //   print('***** BARCODES FOUND=$result');
//           // }
//           _handleResult(
//             barcodes: result,
//             data: data,
//             imageSize: Size(image.width.toDouble(), image.height.toDouble()),
//           );
//         },
//       ).whenComplete(() => isDetecting = false);
//     });
//   }

//   bool get _barcodeNearAnimationInProgress {
//     return _currentState == AnimationState.barcodeNear &&
//         DateTime.now().millisecondsSinceEpoch - _animationStart < 2500;
//   }

//   void _handleResult(
//       {@required List<Barcode> barcodes, @required MediaQueryData data, @required Size imageSize}) async {
//     if (!_cameraController.value.isStreamingImages) {
//       return;
//     }

//     final EdgeInsets padding = data.padding;
//     final double maxLogicalHeight = data.size.height - padding.top - padding.bottom;

//     // Width & height are flipped from CameraController.previewSize on iOS
//     final double imageHeight = defaultTargetPlatform == TargetPlatform.iOS ? imageSize.height : imageSize.width;

//     final double imageScale = imageHeight / maxLogicalHeight;
//     final double halfWidth = imageScale * widget.validRectangle.width / 2;
//     final double halfHeight = imageScale * widget.validRectangle.height / 2;

//     final Offset center = imageSize.center(Offset.zero);
//     final Rect validRect = Rect.fromLTRB(
//       center.dx - halfWidth,
//       center.dy - halfHeight,
//       center.dx + halfWidth,
//       center.dy + halfHeight,
//     );

//     for (Barcode barcode in barcodes) {
//       // final Rect intersection = validRect.intersect(barcode.boundingBox);

//       // final double barcodeSize = barcode.boundingBox.width * barcode.boundingBox.height * 2;
//       // final double windowSize = widget.validRectangle.width * widget.validRectangle.height;
//       final bool doesContain = true; //  (barcodeSize > windowSize * 0.8) && (barcodeSize < windowSize * 1.05);

//       if (doesContain) {
//         if (_currentState != AnimationState.barcodeFound) {
//           if (barcode?.valueType == BarcodeValueType.url) {
//             final Uri uri = Uri.parse(barcode.url.url);
//             // print('********* BARCODE FOUND.uri.scheme=${uri.scheme}');
//             // print('********* BARCODE FOUND.uri.path=${uri.path}');
//             // print('********* BARCODE FOUND.uri.query=${uri.query}');
//             // print('********* BARCODE FOUND.uri.origin=${uri.origin}');
//             // print('********* BARCODE FOUND.uri.pathSegments=${uri.pathSegments}');
//             // print('********* BARCODE FOUND.uri.port=${uri.port}');

//             if (isValidQRUrl(uri)) {
//               setState(() {
//                 _closeWindow = true;
//                 _scannerHint = trans('qrScan.loading');
//               });

//               // TODO if need the image of the barcode uncomment this code
//               await _cameraController.stopImageStream();
//               this._streaming = false;
//               // await _takePicture();

//               final unitId = uri.pathSegments[0];
//               final table = uri.pathSegments[1];
//               final seat = uri.pathSegments[2];
//               final Place place = Place(table: table, seat: seat);
//               // print('***** BARCODE.UNIT=$unitId, TABLE=$table, SEAT=$seat');
//               _switchAnimationState(AnimationState.barcodeFound);
//               // showNotification(context, 'New Seat Reserved', 'Seat $seat reversed at Table $table', null);
//               Nav.reset(UnitFoundByQRCodeScreen(
//                         place: place,
//                         unitId: unitId,
//                         navigateToCart: widget.navigateToCart,
//                       ));
//               return;
//             }
//           }
//         }
//         return;
//       } else if (barcode.boundingBox.overlaps(validRect)) {
//         if (_currentState != AnimationState.barcodeNear) {
//           _scannerHint = trans('qrScan.moveCloser');
//           _switchAnimationState(AnimationState.barcodeNear);
//           setState(() {});
//         }
//         return;
//       }
//     }

//     if (_barcodeNearAnimationInProgress) {
//       return;
//     }

//     if (_currentState != AnimationState.search) {
//       _scannerHint = null;
//       _switchAnimationState(AnimationState.search);
//       setState(() {});
//     }
//   }

//   @override
//   void dispose() {
//     _currentState = AnimationState.endSearch;
//     _animationController?.dispose();

//     _barcodeDetector.close().whenComplete(() {
//       if (_cameraController != null) {
//         if (this._streaming) {
//           _cameraController.stopImageStream().whenComplete(() => _cameraController.dispose());
//           this._streaming = false;
//         } else {
//           _cameraController.dispose();
//         }
//       }
//     });

//     super.dispose();
//   }

//   Widget _buildCameraPreview() {
//     return Container(
//       color: Colors.black,
//       child: Transform.scale(
//         scale: _getImageZoom(MediaQuery.of(context)),
//         child: Center(
//           child: AspectRatio(
//             aspectRatio: _cameraController.value.aspectRatio,
//             child: CameraPreview(_cameraController),
//           ),
//         ),
//       ),
//     );
//   }

//   double _getImageZoom(MediaQueryData data) {
//     final double logicalWidth = data.size.width;
//     final double logicalHeight = _previewSize.aspectRatio * logicalWidth;

//     final EdgeInsets padding = data.padding;
//     final double maxLogicalHeight = data.size.height - padding.top - padding.bottom;

//     return maxLogicalHeight / logicalHeight;
//   }

//   // void _reset() {
//   //   _initCameraAndScanner();
//   //   setState(() {
//   //     _closeWindow = false;
//   //     _barcodePictureFilePath = null;
//   //     _scannerHint = null;
//   //     _switchAnimationState(AnimationState.search);
//   //   });
//   // }

//   @override
//   Widget build(BuildContext context) {
//     Widget background;
//     if (_barcodePictureFilePath != null) {
//       background = Container(
//         color: Colors.black,
//         child: Transform.scale(
//           scale: _getImageZoom(MediaQuery.of(context)),
//           child: Center(
//             child: Image.file(
//               File(_barcodePictureFilePath),
//               fit: BoxFit.fitWidth,
//             ),
//           ),
//         ),
//       );
//     } else if (_cameraController != null && _cameraController.value.isInitialized) {
//       background = _buildCameraPreview();
//     } else {
//       background = Container(
//         color: Colors.black,
//       );
//     }

//     return SafeArea(
//       child: Scaffold(
//         body: Stack(
//           children: <Widget>[
//             background,
//             Container(
//               constraints: const BoxConstraints.expand(),
//               child: CustomPaint(
//                 painter: WindowPainter(
//                   windowSize: Size(widget.validRectangle.width, widget.validRectangle.height),
//                   outerFrameColor: widget.frameColor,
//                   closeWindow: _closeWindow,
//                   innerFrameColor: _currentState == AnimationState.endSearch ? Colors.transparent : kShrineFrameBrown,
//                 ),
//               ),
//             ),
//             Positioned(
//               left: 0,
//               right: 0,
//               top: 0,
//               child: Container(
//                 height: 56,
//                 decoration: BoxDecoration(
//                   gradient: LinearGradient(
//                     begin: Alignment.topCenter,
//                     end: Alignment.bottomCenter,
//                     colors: const <Color>[Colors.black87, Colors.transparent],
//                   ),
//                 ),
//               ),
//             ),
//             Positioned(
//               left: 0.0,
//               bottom: 0.0,
//               right: 0.0,
//               height: 56,
//               child: Container(
//                 color: kShrinePink50,
//                 child: Center(
//                   child: Text(
//                     _scannerHint ?? trans('qrScan.pointCamera'),
//                     style: Theme.of(context).textTheme.button,
//                   ),
//                 ),
//               ),
//             ),
//             Container(
//               constraints: const BoxConstraints.expand(),
//               child: CustomPaint(
//                 painter: _animationPainter,
//               ),
//             ),
//             AppBar(
//               leading: IconButton(
//                 icon: const Icon(Icons.close, color: Colors.white),
//                 onPressed: () => Nav.pop(),
//               ),
//               backgroundColor: Colors.transparent,
//               elevation: 0.0,
//               actions: <Widget>[
//                 IconButton(
//                   icon: const Icon(
//                     Icons.flash_off,
//                     color: Colors.white,
//                   ),
//                   onPressed: () {},
//                 ),
//                 IconButton(
//                   icon: const Icon(
//                     Icons.help_outline,
//                     color: Colors.white,
//                   ),
//                   onPressed: () {},
//                 ),
//               ],
//             ),
//           ],
//         ),
//       ),
//     );
//   }
// }
