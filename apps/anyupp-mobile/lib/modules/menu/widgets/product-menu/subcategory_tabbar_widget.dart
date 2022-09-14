import '/core/theme/theme.dart';
import '/models.dart';
import '/shared/locale.dart';
import 'package:flutter/material.dart';

@immutable
class SubCategoryTabBarWidget extends StatelessWidget {
  final List<ProductCategory> productCategories;
  final TabController? controller;
  final ValueChanged<int> onTap;
  const SubCategoryTabBarWidget({
    Key? key,
    this.controller,
    required this.productCategories,
    required this.onTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return TabBar(
      controller: controller,
      isScrollable: true,
      indicatorSize: TabBarIndicatorSize.tab,
      indicatorColor: theme.primary,
      // indicator: BoxDecoration(
      //   color: theme.secondary,
      // ),
      labelColor: theme.primary,
      labelStyle: Fonts.hH5(),
      labelPadding: EdgeInsets.only(
        left: 8,
        right: 8,
      ),
      unselectedLabelColor: theme.secondary,
      unselectedLabelStyle: Fonts.hH5(
        color: theme.secondary64,
      ),
      tabs: productCategories
          .map((e) => Tab(
                text: getLocalizedText(context, e.name),
              ))
          .toList(),
    );
  }
}
