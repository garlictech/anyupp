import 'package:flutter/material.dart';

typedef void OnWidgetSizeChange(Size size);

/// [MeasuredWidget] Calculated the size of it's child in runtime.
/// Simply wrap your widget with [MeasuredWidget] and listen to size changes with [onChange].
class MeasuredWidget extends StatefulWidget {
  final Widget child;
  final OnWidgetSizeChange? onChange;

  const MeasuredWidget({required this.child, this.onChange});
  @override
  _MeasuredWidgetState createState() => _MeasuredWidgetState();
}

class _MeasuredWidgetState extends State<MeasuredWidget> {
  final GlobalKey widgetKey = GlobalKey();
  var oldSize;

  @override
  void initState() {
    WidgetsBinding.instance.addPostFrameCallback(_postFrameCallback);
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    WidgetsBinding.instance.addPostFrameCallback(_postFrameCallback);
    return Container(
      key: widgetKey,
      child: widget.child,
    );
  }

  void _postFrameCallback(_) {
    var context = widgetKey.currentContext;
    if (context != null) {
      RenderObject? ro = context.findRenderObject();
      if (ro is RenderBox && !ro.debugNeedsLayout) {
        Size? newSize = context.size;
        if (newSize == Size.zero) return;
        if (oldSize == newSize) return;
        oldSize = newSize;
        if (newSize != null && widget.onChange != null) {
          widget.onChange!(newSize);
        }
      }
    }
  }
}
