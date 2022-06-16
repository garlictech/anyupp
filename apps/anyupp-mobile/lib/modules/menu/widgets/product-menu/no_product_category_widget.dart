import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';

class NoProductCategoriesWidget extends StatelessWidget {
  const NoProductCategoriesWidget({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Container(
        margin: EdgeInsets.symmetric(horizontal: 8.0),
        child: EmptyWidget(
          messageKey: 'main.noCategories',
          background: Colors.transparent,
        ),
      ),
    );
  }
}
