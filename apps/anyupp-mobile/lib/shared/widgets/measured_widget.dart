import 'package:flutter/material.dart';

typedef void OnWidgetSizeChange(Size size);

/// [MeasuredWidget] Calculated the size of it's child in runtime.
/// Simply wrap your widget with [MeasuredWidget] and listen to size changes with [onChange].
class MeasuredWidget extends StatefulWidget {
  final Widget child;
  final OnWidgetSizeChange onChange;

  const MeasuredWidget({Key key, this.onChange, this.child}) : super(key: key);
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
    RenderObject ro = context.findRenderObject();
    if (ro is RenderBox) {
      Size newSize = context.size;
      if (newSize == Size.zero) return;
      if (oldSize == newSize) return;
      oldSize = newSize;
      widget.onChange(newSize);
    }
  }
}
