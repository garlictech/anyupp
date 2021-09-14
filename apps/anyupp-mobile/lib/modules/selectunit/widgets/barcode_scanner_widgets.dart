import 'dart:ui' show lerpDouble;

import 'package:flutter/material.dart';

const Color kShrinePink50 = Color(0xFFFEEAE6);
const Color kShrinePink100 = Color(0xFFFEDBD0);
const Color kShrineFrameBrown = Color(0x8A442C2E);
const Color kShrineScrim = Color(0x73442C2E);

class WindowPainter extends CustomPainter {
  WindowPainter({
    required this.windowSize,
    this.outerFrameColor = Colors.white54,
    this.innerFrameColor = const Color(0xFF442C2E),
    this.innerFrameStrokeWidth = 3,
    this.closeWindow = false,
  });

  final Size windowSize;
  final Color outerFrameColor;
  final Color innerFrameColor;
  final double innerFrameStrokeWidth;
  final bool closeWindow;

  @override
  void paint(Canvas canvas, Size size) {
    final Offset center = size.center(Offset.zero);
    final double windowHalfWidth = windowSize.width / 2;
    final double windowHalfHeight = windowSize.height / 2;

    final Rect windowRect = Rect.fromLTRB(
      center.dx - windowHalfWidth,
      center.dy - windowHalfHeight,
      center.dx + windowHalfWidth,
      center.dy + windowHalfHeight,
    );

    final Rect left = Rect.fromLTRB(0, windowRect.top, windowRect.left, windowRect.bottom);
    final Rect top = Rect.fromLTRB(0, 0, size.width, windowRect.top);
    final Rect right = Rect.fromLTRB(
      windowRect.right,
      windowRect.top,
      size.width,
      windowRect.bottom,
    );
    final Rect bottom = Rect.fromLTRB(
      0,
      windowRect.bottom,
      size.width,
      size.height,
    );

    canvas.drawRect(
        windowRect,
        Paint()
          ..color = innerFrameColor
          ..style = PaintingStyle.stroke
          ..strokeWidth = innerFrameStrokeWidth);

    final Paint paint = Paint()..color = outerFrameColor;
    canvas.drawRect(left, paint);
    canvas.drawRect(top, paint);
    canvas.drawRect(right, paint);
    canvas.drawRect(bottom, paint);

    if (closeWindow) {
      canvas.drawRect(windowRect, paint);
    }
  }

  @override
  bool shouldRepaint(WindowPainter oldDelegate) => oldDelegate.closeWindow != closeWindow;
}

class Rectangle {
  const Rectangle({required this.width, required this.height, this.color});

  final double width;
  final double height;
  final Color? color;

  static Rectangle lerp(Rectangle begin, Rectangle end, double t) {
    late Color? color;
    if (t > .5) {
      color = Color.lerp(begin.color, end.color, (t - .5) / .25);
    } else {
      color = begin.color;
    }

    return Rectangle(
      width: lerpDouble(begin.width, end.width, t)!,
      height: lerpDouble(begin.height, end.height, t)!,
      color: color,
    );
  }
}

class RectangleTween extends Tween<Rectangle> {
  RectangleTween(Rectangle begin, Rectangle end) : super(begin: begin, end: end);

  @override
  Rectangle lerp(double t) => Rectangle.lerp(begin!, end!, t);
}

class RectangleOutlinePainter extends CustomPainter {
  RectangleOutlinePainter({
    required this.animation,
    this.strokeWidth = 3,
  }) : super(repaint: animation);

  final Animation<Rectangle> animation;
  final double strokeWidth;

  @override
  void paint(Canvas canvas, Size size) {
    final Rectangle rectangle = animation.value;

    final Paint paint = Paint()
      ..strokeWidth = strokeWidth
      ..color = rectangle.color ?? Colors.white
      ..style = PaintingStyle.stroke;

    final Offset center = size.center(Offset.zero);
    final double halfWidth = rectangle.width / 2;
    final double halfHeight = rectangle.height / 2;

    final Rect rect = Rect.fromLTRB(
      center.dx - halfWidth,
      center.dy - halfHeight,
      center.dx + halfWidth,
      center.dy + halfHeight,
    );

    canvas.drawRect(rect, paint);
  }

  @override
  bool shouldRepaint(RectangleOutlinePainter oldDelegate) => false;
}

class RectangleTracePainter extends CustomPainter {
  RectangleTracePainter({
    required this.animation,
    required this.rectangle,
    this.strokeWidth = 3,
  }) : super(repaint: animation);

  final Animation<double> animation;
  final Rectangle rectangle;
  final double strokeWidth;

  @override
  void paint(Canvas canvas, Size size) {
    final double value = animation.value;

    final Offset center = size.center(Offset.zero);
    final double halfWidth = rectangle.width / 2;
    final double halfHeight = rectangle.height / 2;

    final Rect rect = Rect.fromLTRB(
      center.dx - halfWidth,
      center.dy - halfHeight,
      center.dx + halfWidth,
      center.dy + halfHeight,
    );

    final Paint paint = Paint()
      ..strokeWidth = strokeWidth
      ..color = rectangle.color ?? Colors.white;

    final double halfStrokeWidth = strokeWidth / 2;

    final double heightProportion = (halfStrokeWidth + rect.height) * value;
    final double widthProportion = (halfStrokeWidth + rect.width) * value;

    canvas.drawLine(
      Offset(rect.right, rect.bottom + halfStrokeWidth),
      Offset(rect.right, rect.bottom - heightProportion),
      paint,
    );

    canvas.drawLine(
      Offset(rect.right + halfStrokeWidth, rect.bottom),
      Offset(rect.right - widthProportion, rect.bottom),
      paint,
    );

    canvas.drawLine(
      Offset(rect.left, rect.top - halfStrokeWidth),
      Offset(rect.left, rect.top + heightProportion),
      paint,
    );

    canvas.drawLine(
      Offset(rect.left - halfStrokeWidth, rect.top),
      Offset(rect.left + widthProportion, rect.top),
      paint,
    );
  }

  @override
  bool shouldRepaint(RectangleTracePainter oldDelegate) => false;
}
