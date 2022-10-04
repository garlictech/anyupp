import 'package:flutter/material.dart';

extension BuildContextExtension on BuildContext {

  /// Gets widget coordinates relative to this widget
  Rect offsetDescendantRectToMyCoords(BuildContext childContext) {
    Rect rect = this.getDrawingRect()!;
    Rect viewRect = childContext.getDrawingRect()!;
    return Rect.fromLTRB(viewRect.left - rect.left, viewRect.top - rect.top,
        viewRect.right - rect.left, viewRect.bottom - rect.top);
  }

  /// Gets coordinates of a BuildContext of widget
  Rect? getDrawingRect() {
    RenderObject? renderObject = findRenderObject();
    final translation = renderObject?.getTransformTo(null).getTranslation();
    if (translation != null && renderObject?.paintBounds != null) {
      final Offset offset = Offset(translation.x, translation.y);
      return renderObject!.paintBounds.shift(offset);
    } else {
      return null;
    }
  }

  double getLeft() {
    Rect? rect = getDrawingRect();
    if (rect == null) {
      return 0;
    } else {
      return rect.left;
    }
  }

  double getRight() {
    Rect? rect = getDrawingRect();
    if (rect == null) {
      return 0;
    } else {
      return rect.right;
    }
  }

  double getBottom() {
    Rect? rect = getDrawingRect();
    if (rect == null) {
      return 0;
    } else {
      return rect.bottom;
    }
  }

  double getTop() {
    Rect? rect = getDrawingRect();
    if (rect == null) {
      return 0;
    } else {
      return rect.top;
    }
  }

  double getWidth() {
    Rect? rect = getDrawingRect();
    if (rect == null) {
      return 0;
    } else {
      return rect.width;
    }
  }

  double getHeight() {
    Rect? rect = getDrawingRect();
    if (rect == null) {
      return 0;
    } else {
      return rect.height;
    }
  }
}
