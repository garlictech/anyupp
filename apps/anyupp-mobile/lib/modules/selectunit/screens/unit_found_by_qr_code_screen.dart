import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/selectunit/selectunit.dart';
import 'package:flutter/material.dart';

class UnitFoundByQRCodeScreen extends StatelessWidget {
  final String unitId;
  final Place place;
  final bool navigateToCart;
  final bool loadUnits;
  final bool popWhenClose;

  UnitFoundByQRCodeScreen({
    required this.unitId,
    required this.place,
    this.navigateToCart = false,
    this.loadUnits = true,
    this.popWhenClose = false,
  });

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Scaffold(
        backgroundColor: Colors.white,
        body: UnitFoundByQRCodeWidget(
          unitId: unitId,
          place: place,
          navigateToCart: navigateToCart,
          loadUnits: loadUnits,
          popWhenClose: popWhenClose,
        ),
      ),
    );
  }
}
