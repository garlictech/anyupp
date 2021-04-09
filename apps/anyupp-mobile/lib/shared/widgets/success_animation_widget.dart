import 'package:flutter/material.dart';
import 'package:vector_math/vector_math_64.dart' as math;
import 'dart:ui';
import 'package:flutter_sequence_animation/flutter_sequence_animation.dart';

// Responsible for the check mark animation that appears after payment
class SuccessAnimationWidget extends StatefulWidget {
  @override
  State<StatefulWidget> createState() {
    return SuccessAnimationWidgetState();
  }
}

class SuccessAnimationWidgetState extends State<SuccessAnimationWidget> with SingleTickerProviderStateMixin {
  AnimationController animationController;

  SequenceAnimation sequenceAnimation;

  @override
  void initState() {
    int factor = 50;
    animationController = AnimationController(vsync: this);
    sequenceAnimation = SequenceAnimationBuilder()
        .addAnimatable(
            animatable: Tween(begin: 0.0, end: 0.70),
            from: Duration(milliseconds: 3 * factor),
            to: Duration(milliseconds: 10 * factor),
            tag: "start")
        .addAnimatable(
            animatable: Tween(begin: 0.0, end: 1.0),
            from: Duration(milliseconds: 0),
            to: Duration(milliseconds: 10 * factor),
            tag: "end",
            curve: Curves.easeOut)
        .animate(animationController);

    // Delay
    Future.delayed(Duration(milliseconds: 200)).then((_) {
      animationController.forward();
    });

    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
        animation: animationController,
        builder: (c, w) {
          return CustomPaint(
            painter: _CustomPainter(
              strokeStart: sequenceAnimation['start'].value,
              strokeEnd: sequenceAnimation['end'].value,
              context: context,
            ),
          );
        });
  }
}

class _CustomPainter extends CustomPainter {
  Paint _paint = Paint();
  BuildContext context;

  double _r = 32.0;
  double factor = 0.96;

  double strokeStart;
  double strokeEnd;
  double total = 0;

  double _strokeStart;
  double _strokeEnd;

  _CustomPainter({this.strokeEnd, this.strokeStart, this.context}) {
    _paint.strokeCap = StrokeCap.round;
    _paint.style = PaintingStyle.stroke;

    _paint.strokeWidth = 4.0;

    Path path = createPath();
    PathMetrics metrics = path.computeMetrics();
    for (PathMetric pathMetric in metrics) {
      total += pathMetric.length;
    }

    _strokeStart = strokeStart * total;
    _strokeEnd = strokeEnd * total;
  }

  Path createPath() {
    Path path = Path();
    path.addArc(
        Rect.fromCircle(center: Offset(_r, _r), radius: _r), math.radians(60.0 - 30.0), math.radians(-200.0));
    path.lineTo(24.0, 46.0);
    path.lineTo(49.0, 18.0);
    return path;
  }

  @override
  void paint(Canvas canvas, Size size) {
    Path path = Path();
    path.addArc(Rect.fromCircle(center: Offset(_r, _r), radius: _r), 0.0, math.radians(360.0));

    // Responsible for the color of the circle(ring) around the checkmark
    _paint.color = Theme.of(context).primaryColor.withOpacity(0.7);
    canvas.drawPath(path, _paint);

    // Responsible for the color of the checkmark
    _paint.color = Theme.of(context).primaryColor;
    path = createPath();
    PathMetrics metrics = path.computeMetrics();
    for (PathMetric pathMetric in metrics) {
      canvas.drawPath(pathMetric.extractPath(_strokeStart, _strokeEnd), _paint);
    }
  }

  @override
  bool shouldRepaint(_CustomPainter oldDelegate) {
    return strokeStart != oldDelegate.strokeStart || strokeEnd != oldDelegate.strokeEnd;
  }
}
