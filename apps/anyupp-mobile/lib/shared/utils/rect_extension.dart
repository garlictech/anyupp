import 'package:flutter/material.dart';

extension RectExtension on Rect {
  bool _containsOffset(Offset offset) {
    return offset.dx >= left &&
        offset.dx <= right &&
        offset.dy >= top &&
        offset.dy <= bottom;
  }

  bool containsRect(Rect rect) {
    if (!this._containsOffset(Offset(rect.left, rect.top))) {
      return false;
    }
    if (!this._containsOffset(Offset(rect.left, rect.bottom))) {
      return false;
    }
    if (!this._containsOffset(Offset(rect.right, rect.top))) {
      return false;
    }
    if (!this._containsOffset(Offset(rect.right, rect.bottom))) {
      return false;
    }
    return true;
  }
}
