import 'package:anyupp/core/theme/theme.dart';
import 'package:anyupp/models.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tinycolor2/tinycolor2.dart';
import '../mock/mock_data_faker.dart';

void main() {
  String getHtmlHexColorStringFromColor(Color color) {
    return '#' + TinyColor(color).toHex8().substring(2);
  }

  group('Testing themes with the new theme system...', () {
    late ThemeChainData _theme;
    late GeoUnit _unit;

    setUp(() async {
      _theme = ThemeChainData(
          light: true,
          primary: Color(0xFF30BF60),
          secondary: Color(0xFF373737),
          secondary0: Color(0xFFFFFFFF),
          secondary12: Color(0xfff1f1f1),
          secondary16: Color(0xffdedede),
          secondary40: Color(0xffacacac),
          secondary64: Color(0xff7b7b7b),
          icon: Color(0xFF30BF60),
          button: Color(0xFF30BF60),
          buttonText: Color(0xFFFFFFFF),
          highlight: Color(0xFF30BF60));
      expect(_theme, isNotNull);

      _unit =
          MockGenerator.generateUnit(name: 'TEST Theme Unit', currency: 'huf');
      expect(_unit, isNotNull);
    });

    test(
        'Test Anyupp theme with primary and secondary colors, other colors null',
        () async {
      expect(_theme, isNotNull);
      expect(_unit, isNotNull);

      GeoUnit testUnit = _unit.copyWith(
        style: _unit.style.copyWith(
          colors: _unit.style.colors.copyWith(
            primary: getHtmlHexColorStringFromColor(_theme.highlight),
            secondary: getHtmlHexColorStringFromColor(_theme.secondary),
          ),
        ),
      );

      ThemeChainData generated = unitThemeToThemeChainData(testUnit);

      expect(generated, isNotNull);
      expect(generated.primary, equals(_theme.highlight));
      expect(generated.secondary, equals(_theme.secondary));
    });

    test(
        'Test Anyupp theme without primary and secondary colors, fallback old colors',
        () async {
      expect(_theme, isNotNull);
      expect(_unit, isNotNull);

      GeoUnit testUnit = _unit.copyWith(
        style: _unit.style.copyWith(
          colors: ChainStyleColors(
            indicator: getHtmlHexColorStringFromColor(_theme.highlight),
            textDark: getHtmlHexColorStringFromColor(_theme.secondary),
          ),
        ),
      );

      ThemeChainData generated = unitThemeToThemeChainData(testUnit);

      expect(generated, isNotNull);
      expect(generated.primary, equals(_theme.highlight));
      expect(generated.secondary, equals(_theme.secondary));
    });

    test('Test Anyupp theme without any colors, fallback to default colors',
        () async {
      expect(_theme, isNotNull);
      expect(_unit, isNotNull);

      GeoUnit testUnit = _unit.copyWith(
        style: _unit.style.copyWith(
          colors: ChainStyleColors(),
        ),
      );

      ThemeChainData generated = unitThemeToThemeChainData(testUnit);

      expect(generated, isNotNull);
      expect(generated.primary, equals(_theme.highlight));
      expect(generated.secondary, equals(_theme.secondary));
    });
  });
}
