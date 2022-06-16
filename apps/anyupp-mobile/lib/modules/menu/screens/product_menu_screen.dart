import 'package:anchor_scroll_controller/anchor_scroll_controller.dart';
import 'package:anchor_scroll_controller/anchor_scroll_wrapper.dart';
import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/favorites/favorites.dart';
import 'package:fa_prev/modules/menu/menu.dart';
import 'package:fa_prev/shared/utils/unit_utils.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:pull_to_refresh/pull_to_refresh.dart';

class _CategoryMenuWidgets {
  // final List<Widget> widgets;
  final List<ProductCategory> productCategories;
  final bool hasFavorites;
  final Map<String, List<Widget>> mainCategoryWidgets;
  final Map<String, List<Widget>>? subCategoryWidgets;

  _CategoryMenuWidgets({
    // required this.widgets,
    required this.productCategories,
    required this.hasFavorites,
    required this.mainCategoryWidgets,
    this.subCategoryWidgets,
  });
}

class MenuScreen extends StatefulWidget {
  @override
  State<MenuScreen> createState() => _MenuScreenState();
}

class _MenuScreenState extends State<MenuScreen> with TickerProviderStateMixin {
  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (BuildContext context) {
        var bloc = getIt<ProductListBloc>();
        bloc.add(LoadAllProductList(
          unitId: currentUnit!.id,
        ));
        return bloc;
      },
      child: MenuScreenInner(),
    );
  }
}

class MenuScreenInner extends StatefulWidget {
  @override
  State<MenuScreenInner> createState() => _MenuScreenInnerState();
}

class _MenuScreenInnerState extends State<MenuScreenInner>
    with TickerProviderStateMixin {
  TabController? _tabController;
  TabController? _subTabController;
  late final RefreshController _refreshController;
  late final AnchorScrollController _scrollController;
  final ProductListWidgetGenerator _generator = ProductListWidgetGenerator();

  int _selectedTab = 0;
  int _selectedSubTab = 0;
  int _favoritesIndex = 0;
  // final List<int> _listIndexMap = [];
  // final List<int> _tabIndexMap = [];

  @override
  void initState() {
    super.initState();

    _refreshController = RefreshController(initialRefresh: false);
    _scrollController = AnchorScrollController(
        // Majd ha lesz subcategory, akkor ezt kell beállítani
        //   onIndexChanged: (index, useScroll) {
        // bool isScrollingDown = _scrollController.position.userScrollDirection ==
        //     ScrollDirection.reverse;
        // int scrollPosition = isScrollingDown
        //     ? _listIndexMap[min(index + 5, _listIndexMap.length - 1)]
        //     : _listIndexMap[index];
        // _tabController?.animateTo(scrollPosition);
        // },
        );
  }

  @override
  void dispose() {
    _tabController?.dispose();
    _subTabController?.dispose();
    _scrollController.dispose();
    _refreshController.dispose();
    super.dispose();
  }

  void _onRefresh() async {
    BlocProvider.of<ProductListBloc>(context)
        .add(LoadAllProductList(unitId: currentUnit!.id));
    _refreshController.refreshCompleted();
  }

  void _onAddRemoveFavorites(List<FavoriteProduct>? favorites) async {
    BlocProvider.of<ProductListBloc>(context).add(RefreshFavoritesInProductList(
      favorites: favorites,
    ));
  }

  @override
  Widget build(BuildContext context) {
    GeoUnit? unit = currentUnit;
    assert(unit != null);
    return Scaffold(
      appBar: ProductMenuAppBar(
        supportedServiceModeCount: unit?.supportedServingModes.length ?? 0,
      ),
      backgroundColor: theme.secondary0,
      body: BlocListener<FavoritesBloc, FavoritesState>(
        listener: (context, state) {
          if (state is FavorteAddedOrRemoved) {
            _onAddRemoveFavorites(state.favorites);
          }
        },
        child: BlocBuilder<ProductListBloc, ProductListState>(
            builder: (context, state) {
          if (state is ProductListLoaded) {
            if (state.productCategories != null &&
                state.productCategories?.isNotEmpty == true) {
              return _buildMainMenu(
                context,
                unit!,
                state.productCategories!,
                state.products,
                state.favorites,
              );
            } else {
              return const NoProductCategoriesWidget();
            }
          }
          return const UnitMenuLoadingWidget();
        }),
      ),
    );
  }

  Widget _buildMainMenu(
    BuildContext context,
    GeoUnit unit,
    List<ProductCategory> productCategories,
    List<GeneratedProduct> products,
    List<FavoriteProduct>? favorites,
  ) {
    var menu = _buildProductList(
      context: context,
      unit: unit,
      productCategories: productCategories,
      products: products,
      favorites: favorites,
    );
    // log.e('_listIndexMap=${_listIndexMap}');
    // log.e('_tabIndexMap=${_tabIndexMap}');

    return SmartRefresher(
      enablePullDown: true,
      header: MaterialClassicHeader(),
      controller: _refreshController,
      onRefresh: _onRefresh,
      child: NestedScrollView(
        // controller: _scrollController,
        physics: BouncingScrollPhysics(),
        headerSliverBuilder: (BuildContext context, bool innerBoxIsScrolled) {
          // Animated Unit info
          return <Widget>[
            SliverAppBar(
              backgroundColor: theme.secondary0,
              expandedHeight: 270.0,
              flexibleSpace: FlexibleSpaceBar(
                background: UnitInfoHeaderWidget(
                  unit: unit,
                ),
              ),
            ),
            // Sticky Category header
            // Main and SubCategory
            SliverPersistentHeader(
              pinned: true,
              floating: true,
              delegate: SliverAppBarDelegate(
                minHeight:
                    58.0 + (menu.subCategoryWidgets != null ? 62.0 : 0.0),
                maxHeight:
                    58.0 + (menu.subCategoryWidgets != null ? 62.0 : 0.0),
                child: Material(
                  elevation: 1.0,
                  shadowColor: theme.secondary12,
                  child: Container(
                    padding: const EdgeInsets.only(left: 8.0, bottom: 4.0),
                    // margin: const EdgeInsets.only(top: 4.0, bottom: 8.0),
                    color: theme.secondary0,
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        // Main category tabbar
                        ClipRRect(
                          borderRadius: BorderRadius.only(
                            topLeft: Radius.circular(32.0),
                            bottomLeft: Radius.circular(32.0),
                            // bottomRight: Radius.circular(32.0),
                            // topRight: Radius.circular(32.0),
                          ),
                          child: ProductCategoryTabWidget(
                            tabController: _tabController!,
                            addFavorites: menu.hasFavorites,
                            productCategories: menu.productCategories,
                            onTap: (index) => _handleTabTap(context, index),
                          ),
                        ),
                        // Subcategory tabbar
                        if (menu.subCategoryWidgets != null)
                          IndexedStack(
                            index: 0,
                            children: menu.productCategories
                                .map(
                                  (e) => DefaultTabController(
                                    length: menu.productCategories.length,
                                    initialIndex: 0,
                                    child: SubCategoryTabBarWidget(
                                      // controller: _subTabController!,
                                      // controller: ,
                                      productCategories: menu.productCategories,
                                      onTap: (index) => log.i('onTap $index'),
                                    ),
                                  ),
                                )
                                .toList(),
                          ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ];
        },
        // Menu list
        body: TabBarView(
          controller: _tabController,
          physics: BouncingScrollPhysics(),
          children: [
            ...menu.mainCategoryWidgets.entries
                .map(
                  (entry) => SingleChildScrollView(
                    physics: BouncingScrollPhysics(),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: menu.mainCategoryWidgets[entry.key] ?? [],
                    ),
                  ),
                )
                .toList(),
          ],
        ),
      ),
    );
  }

  _CategoryMenuWidgets _buildProductList({
    required BuildContext context,
    required GeoUnit unit,
    required List<ProductCategory> productCategories,
    required List<GeneratedProduct> products,
    List<FavoriteProduct>? favorites,
  }) {
    _favoritesIndex = favorites?.isNotEmpty == true ? 1 : 0;

    _selectedTab = _favoritesIndex;
    _selectedSubTab = 0;
    var menu = _generator.generateMenu(
      context: context,
      unit: unit,
      productCategories: productCategories,
      products: products,
      servingMode: currentServingMode,
      favorites: favorites,
    );
    // log.d('Menu generated=${menu}');

    _tabController = TabController(
      length: menu.categories.length + _favoritesIndex,
      vsync: this,
      initialIndex: _selectedTab,
    );

    _subTabController = TabController(
      length: menu.categories.length,
      vsync: this,
      initialIndex: _selectedSubTab,
    );
    var servingMode = currentServingMode;

    Map<String, List<Widget>>? mainCategoryWidgets;
    Map<String, List<Widget>>? subCategoryWidgets;
    mainCategoryWidgets = {};

    // Add favorites tab
    if (_favoritesIndex > 0) {
      var items = _getWidgetsFromMenuItems(
        menu.mainCategoryMenuItems!['favorites']!,
        unit,
        servingMode,
      );
      mainCategoryWidgets['favorites'] = items;
    }

    if (!menu.hasSubCategories) {
      // Build main menu widgets without subcategories
      for (int i = 0; i < menu.categories.length; i++) {
        var category = menu.categories[i];
        var items = _getWidgetsFromMenuItems(
          menu.mainCategoryMenuItems![category.id]!,
          unit,
          servingMode,
        );
        mainCategoryWidgets[category.id] = items;
      }
    } else {
      subCategoryWidgets = {};
      menu.subMenu!.entries.forEach((element) {
        var categoryId = element.key;
        var items = _getWidgetsFromMenuItems(
          element.value.menuItems,
          unit,
          servingMode,
        );
        subCategoryWidgets?[categoryId] = items;
      });
    }

    return _CategoryMenuWidgets(
      productCategories: menu.categories,
      hasFavorites: _favoritesIndex == 1,
      mainCategoryWidgets: mainCategoryWidgets,
      subCategoryWidgets: subCategoryWidgets,
    );
  }

  _handleTabTap(BuildContext context, int index) {
    // int itemIndex = _tabIndexMap[index];
    // log.w('_handleTabTap[$index]=itemInMap:$itemIndex map:$_tabIndexMap');
    _scrollController.scrollToIndex(index: index, scrollSpeed: 3.0);
    // _tabController?.animateTo(index);
  }

  List<Widget> _getWidgetsFromMenuItems(
    List<MenuListItem> menuItems,
    GeoUnit unit,
    ServingMode servingMode,
  ) {
    List<Widget> results = [];
    for (int i = 0; i < menuItems.length; i++) {
      var item = menuItems[i];
      if (item is MenuItemHeader) {
        results.add(
          AnchorItemWrapper(
            index: item.position,
            controller: _scrollController,
            child: ProductCategoryHeaderWidget(
              name: item.title,
              // key: _tabKeys[cIndex],
            ),
          ),
        );
        continue;
      } else if (item is MenuItemFavorite) {
        results.add(AnchorItemWrapper(
          index: item.position,
          controller: _scrollController,
          child: ProductMenuItemWidget(
            displayState: item.displayState,
            unit: unit,
            item: item.product,
            servingMode: servingMode,
          ),
        ));
        continue;
      } else if (item is MenuItemProduct) {
        //
        results.add(AnchorItemWrapper(
          index: item.position,
          controller: _scrollController,
          child: ProductMenuItemWidget(
            displayState: item.displayState,
            unit: unit,
            item: item.product,
            servingMode: servingMode,
          ),
        ));
        continue;
      } else if (item is MenuItemAdBanner) {
        results.add(Container());
        continue;
      }
      throw Exception('Unknown item type');
    }
    return results;
  }
}
