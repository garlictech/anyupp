// This is a basic Flutter widget test.
//
// To perform an interaction with a widget in your test, use the WidgetTester
// utility that Flutter provides. For example, you can send tap and scroll
// gestures. You can also use WidgetTester to find child widgets in the widget
// tree, read text, and verify that the values of widget properties are correct.

import 'dart:convert';
import 'dart:io';

import 'package:fa_prev/shared/affiliate.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {

  List<String> maleValid = ['LEGO Creator 10277 Krokodil lokomotív', 'BOSCH GSB 21-2 RCT', 'Fischer RC3 Combi 2020/21, méret: 44 EU'];
  List<String> femaleValid = ['iPhone 12 Mini 64GB fekete', 'LEGO Creator 10277 Krokodil lokomotív', 'BEYONCE Heat Rush EdT 100 ml'];

  test('Check affiniate ad selection by gender and age', () async {

    final file = File('test/data/project-3fa-affiliate-export.json');
    final json = jsonDecode(await file.readAsString());
    Affiliate affiliate = Affiliate.fromMap(json);
    // print('affiliate=$affiliate');

    for (int i = 0; i < 100; i++) {
      Advertisement result = await AffiliateUtils.getAdvertisement(affiliate.advertisements, 'male', null);
      bool ok = maleValid.contains(result.product.name);
      // print('MALE: ${result.product.name}=$ok');
      expect(ok, true);
    }

    for (int i = 0; i < 100; i++) {
      Advertisement result = await AffiliateUtils.getAdvertisement(affiliate.advertisements, 'female', null);
      bool ok = femaleValid.contains(result.product.name);
      // print('FEMALE: ${result.product.name}=$ok');
      expect(ok, true);
    }
  });
}
