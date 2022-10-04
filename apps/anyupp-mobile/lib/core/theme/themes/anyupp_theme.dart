import 'package:flutter/material.dart';

import '/core/theme/theme.dart';

class ThemeAnyUpp extends ThemeChainData {
  ThemeAnyUpp()
      : super(
            light: true,

            // fix colors
            primary: Color(0xFF309791),
            secondary0: Color(0xFFFFFFFF),
            secondary: Color(0xFF373737),
            secondary64: Color(0xFF7F7F7F), // old: 0xFF303030
            secondary40: Color(0xFFAFAFAF), // old: 0xFFC3CACD
            //secondary24: Color(0xFFCFCFCF), // TODO add and use this color
            secondary16: Color(0xFFDFDFDF), // old: 0xFFE7E5D0
            secondary12: Color(0xFFE7E7E7), // old: 0xFFD6DDE0
            //secondary6: Color(0xFFF3F3F3), // TODO add and use this color

            // unit can change these colors:
            icon: Color(0xFF309791),
            button: Color(0xFF309791),
            buttonText: Color(0xFFFFFFFF),
            highlight: Color(0xFF309791));
}
