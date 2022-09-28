import '/core/theme/theme.dart';
import '/models.dart';
import '/modules/menu/menu.dart';
import '/shared/locale.dart';
import 'package:flutter/material.dart';

class ProductCategoryTabWidget extends StatefulWidget {
  final TabController tabController;
  final List<ProductCategory> categories;
  final ValueChanged<int> onTap;
  final bool addFavorites;

  ProductCategoryTabWidget({
    Key? key,
    required this.tabController,
    required this.categories,
    required this.onTap,
    required this.addFavorites,
  }) : super(key: key);

  @override
  State<ProductCategoryTabWidget> createState() =>
      _ProductCategoryTabWidgetState();
}

class _ProductCategoryTabWidgetState extends State<ProductCategoryTabWidget> {
  int? _cachedFromIdx;

  int? _cachedToIdx;

  @override
  Widget build(BuildContext context) {
    return ColoredTabBar(
      color: theme.secondary.withOpacity(0.06),
      width: double.infinity,
      tabBar: TabBar(
        physics: const BouncingScrollPhysics(),
        padding: EdgeInsets.zero,
        controller: widget.tabController,
        isScrollable: true,
        indicatorSize: TabBarIndicatorSize.tab,
        indicator: BoxDecoration(
          borderRadius: BorderRadius.circular(
            32.0,
          ),
          color: theme.secondary0,
        ),
        labelColor: theme.secondary,
        // labelStyle: Fonts.hH5(),
        labelPadding: EdgeInsets.only(
          left: 4,
          right: 4,
        ),
        indicatorPadding: EdgeInsets.only(top: 2.0, bottom: 2.0),
        unselectedLabelColor: theme.secondary,
        unselectedLabelStyle: Fonts.hH5(
          color: theme.secondary,
        ),
        indicatorWeight: 0,
        tabs: _getTabBarTitles(context, widget.categories),
        onTap: widget.onTap,
      ),
    );
  }

  List<Widget> _getTabBarTitles(
    BuildContext context,
    List<ProductCategory> productCategories,
  ) {
    int favoritesIndex = widget.addFavorites ? 1 : 0;
    List<Widget> results =
        widget.addFavorites ? [_getTab(trans('main.menu.favorites'), 0)] : [];
    for (int i = 0; i < productCategories.length; i++) {
      results.add(_getTab(getLocalizedText(context, productCategories[i].name),
          i + favoritesIndex));
    }

    return results;
  }

  Widget _getTab(String title, int index) {
    return Tab(
      height: 50,
      child: AnimatedBuilder(
        animation: widget.tabController.animation as Listenable,
        builder: (ctx, snapshot) {
          final forward = widget.tabController.offset > 0;
          final backward = widget.tabController.offset < 0;
          int _fromIndex;
          int _toIndex;
          double progress;

          // This value is true during the [animateTo] animation that's triggered when the user taps a [TabBar] tab.
          // It is false when [offset] is changing as a consequence of the user dragging the [TabBarView].
          if (widget.tabController.indexIsChanging) {
            _fromIndex = widget.tabController.previousIndex;
            _toIndex = widget.tabController.index;
            _cachedFromIdx = widget.tabController.previousIndex;
            _cachedToIdx = widget.tabController.index;
            progress =
                (widget.tabController.animation!.value - _fromIndex).abs() /
                    (_toIndex - _fromIndex).abs();
          } else {
            if (_cachedFromIdx == widget.tabController.previousIndex &&
                _cachedToIdx == widget.tabController.index) {
              // When user tap on a tab bar and the animation is completed, it will execute this block
              // This block will not be called when user draging the TabBarView
              _fromIndex = _cachedFromIdx!;
              _toIndex = _cachedToIdx!;
              progress = 1;
              _cachedToIdx = null;
              _cachedFromIdx = null;
            } else {
              _cachedToIdx = null;
              _cachedFromIdx = null;
              _fromIndex = widget.tabController.index;
              _toIndex = forward
                  ? _fromIndex + 1
                  : backward
                      ? _fromIndex - 1
                      : _fromIndex;
              progress =
                  (widget.tabController.animation!.value - _fromIndex).abs();
            }
          }
//print("index: $index  _fromIndex: $_fromIndex  _toIndex: $_toIndex  progress: $progress");
          return Container(
            margin: EdgeInsets.zero,
            padding: const EdgeInsets.only(
              left: 16,
              right: 16,
              top: 10,
              bottom: 10,
            ),
            decoration: BoxDecoration(
              color: index == _fromIndex
                  ? Color.lerp(theme.secondary0, theme.secondary12, progress)
                  : index == _toIndex
                      ? Color.lerp(theme.secondary12, theme.secondary0, progress)
                      : Color.lerp(
                          theme.secondary12, theme.secondary12, progress),
              borderRadius: BorderRadius.circular(32),
            ),
            child: Text(
              title,
              style: Fonts.hH5(),
            ),
          );
        },
      ),
    );
  }
}
