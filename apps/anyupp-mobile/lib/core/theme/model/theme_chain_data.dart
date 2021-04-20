import 'package:flutter/material.dart';

import 'package:fa_prev/models.dart';

class ThemeChainData {
  final Color background;
  final Color background2;
  final Color text;
  final Color text2;
  final Color indicator;
  final Color highlight;
  final Color disabled;
  final Color border;
  final Color border2;
  final ChainStyleImages images;

  ThemeChainData({
    this.background,
    this.background2,
    this.text,
    this.text2,
    this.indicator,
    this.highlight,
    this.disabled,
    this.border,
    this.border2,
    this.images,
  });

  @override
  String toString() {
    return 'ThemeChainData(background: $background, background2: $background2, text: $text, text2: $text2, indicator: $indicator, highlight: $highlight, disabled: $disabled, border: $border, border2: $border2, images: $images)';
  }
}
