import 'package:flutter/material.dart';
import '/core/core.dart';

class ProductCategoryHeaderWidget extends StatelessWidget {
  final String name;
  const ProductCategoryHeaderWidget({Key? key, required this.name})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      color: theme.secondary.withOpacity(0.04),
      padding: const EdgeInsets.only(
        top: 24.0,
        bottom: 12.0,
      ),
      child: Padding(
        padding: const EdgeInsets.only(left: 16.0),
        child: Text(
          name,
          style: Fonts.hH5(
            color: theme.secondary,
          ),
        ),
      ),
    );
  }
}
