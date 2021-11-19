import 'dart:math';
import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:qr_code_scanner/qr_code_scanner.dart';

class QrScannerOverlayShapeExt extends QrScannerOverlayShape {
  QrScannerOverlayShapeExt({
    this.borderColor = Colors.red,
    this.borderWidth = 3.0,
    this.overlayColor = const Color.fromRGBO(0, 0, 0, 80),
    this.borderRadius = 0,
    this.borderLength = 40,
    this.cutOutSize = 250,
    this.cutOutBottomOffset = 0,
    this.borderPadding = 0,
  }) : assert(borderLength <= cutOutSize / 2 + borderWidth * 2,
            "Border can't be larger than ${cutOutSize / 2 + borderWidth * 2}");

  final Color borderColor;
  final double borderWidth;
  final Color overlayColor;
  final double borderRadius;
  final double borderLength;
  final double cutOutSize;
  final double cutOutBottomOffset;
  final double borderPadding;

  @override
  EdgeInsetsGeometry get dimensions => const EdgeInsets.all(10);

  @override
  Path getInnerPath(Rect rect, {TextDirection? textDirection}) {
    return Path()
      ..fillType = PathFillType.evenOdd
      ..addPath(getOuterPath(rect), Offset.zero);
  }

  @override
  Path getOuterPath(Rect rect, {TextDirection? textDirection}) {
    Path _getLeftTopPath(Rect rect) {
      return Path()
        ..moveTo(rect.left, rect.bottom)
        ..lineTo(rect.left, rect.top)
        ..lineTo(rect.right, rect.top);
    }

    return _getLeftTopPath(rect)
      ..lineTo(
        rect.right,
        rect.bottom,
      )
      ..lineTo(
        rect.left,
        rect.bottom,
      )
      ..lineTo(
        rect.left,
        rect.top,
      );
  }

  @override
  void paint(Canvas canvas, Rect rect, {TextDirection? textDirection}) {
    final width = rect.width;
    final borderWidthSize = width / 2;
    final height = rect.height;
    final borderOffset = borderWidth / 2;
    final _borderLength = borderLength > cutOutSize / 2 + borderWidth * 2 ? borderWidthSize / 2 : borderLength;
    final _cutOutSize = cutOutSize < width ? cutOutSize : width - borderOffset;

    final backgroundPaint = Paint()
      ..color = overlayColor
      ..style = PaintingStyle.fill;

    final borderPaint = Paint()
      ..color = borderColor
      ..style = PaintingStyle.stroke
      ..strokeWidth = borderWidth;

    final boxPaint = Paint()
      ..color = borderColor
      ..style = PaintingStyle.fill
      ..blendMode = BlendMode.dstOut;

    final cutOutRect2 = Rect.fromLTWH(
      rect.left + width / 2 - _cutOutSize / 2 + borderOffset,
      -cutOutBottomOffset + rect.top + height / 2 - _cutOutSize / 2 + borderOffset,
      _cutOutSize - borderOffset * 2,
      _cutOutSize - borderOffset * 2,
    );

    final cutOutRect = cutOutRect2.inflate(borderPadding);

    canvas
      ..saveLayer(
        rect,
        backgroundPaint,
      )
      ..drawRect(
        rect,
        backgroundPaint,
      )
      // Draw top right corner
      ..drawArc(
          Rect.fromLTRB(
            cutOutRect.right - _borderLength,
            cutOutRect.top,
            cutOutRect.right,
            cutOutRect.top + _borderLength,
          ),
          1.5 * pi,
          pi / 2,
          false,
          borderPaint)
      ..drawLine(
        Offset(cutOutRect.right - _borderLength, cutOutRect.top),
        Offset(cutOutRect.right - _borderLength / 2, cutOutRect.top),
        borderPaint,
      )
      ..drawLine(
        Offset(cutOutRect.right, cutOutRect.top + _borderLength / 2),
        Offset(cutOutRect.right, cutOutRect.top + _borderLength),
        borderPaint,
      )
      // Draw top left corner
      ..drawArc(
          Rect.fromLTRB(
            cutOutRect.left,
            cutOutRect.top,
            cutOutRect.left + _borderLength,
            cutOutRect.top + _borderLength,
          ),
          pi,
          pi / 2,
          false,
          borderPaint)
      ..drawLine(
        Offset(cutOutRect.left + _borderLength / 2, cutOutRect.top),
        Offset(cutOutRect.left + _borderLength, cutOutRect.top),
        borderPaint,
      )
      ..drawLine(
        Offset(cutOutRect.left, cutOutRect.top + _borderLength / 2),
        Offset(cutOutRect.left, cutOutRect.top + _borderLength),
        borderPaint,
      )
      // Draw bottom right corner
      ..drawArc(
          Rect.fromLTRB(
            cutOutRect.right - _borderLength,
            cutOutRect.bottom - _borderLength,
            cutOutRect.right,
            cutOutRect.bottom,
          ),
          2 * pi,
          pi / 2,
          false,
          borderPaint)
      ..drawLine(
        Offset(cutOutRect.right, cutOutRect.bottom - _borderLength / 2),
        Offset(cutOutRect.right, cutOutRect.bottom - _borderLength),
        borderPaint,
      )
      ..drawLine(
        Offset(cutOutRect.right - _borderLength / 2, cutOutRect.bottom),
        Offset(cutOutRect.right - _borderLength, cutOutRect.bottom),
        borderPaint,
      )
      // Draw bottom left corner
      ..drawArc(
          Rect.fromLTRB(
            cutOutRect.left,
            cutOutRect.bottom - _borderLength,
            cutOutRect.left + _borderLength,
            cutOutRect.bottom,
          ),
          2.5 * pi,
          pi / 2,
          false,
          borderPaint)
      ..drawLine(
        Offset(cutOutRect.left, cutOutRect.bottom - _borderLength / 2),
        Offset(cutOutRect.left, cutOutRect.bottom - _borderLength),
        borderPaint,
      )
      ..drawLine(
        Offset(cutOutRect.left + _borderLength / 2, cutOutRect.bottom),
        Offset(cutOutRect.left + _borderLength, cutOutRect.bottom),
        borderPaint,
      )
      ..drawRRect(
        RRect.fromRectAndRadius(
          cutOutRect2,
          Radius.circular(8.0),
        ),
        boxPaint,
      )
      ..restore();
  }

  @override
  ShapeBorder scale(double t) {
    return QrScannerOverlayShapeExt(
      borderColor: borderColor,
      borderWidth: borderWidth,
      overlayColor: overlayColor,
    );
  }
}
