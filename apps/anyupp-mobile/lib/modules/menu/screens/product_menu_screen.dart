import 'dart:io';

import '/core/core.dart';
import '/graphql/generated/crud-api.dart';
import '/models.dart';
import '/modules/adbanner/adbanner.dart';
import '/modules/cart/cart.dart';
import '/modules/favorites/favorites.dart';
import '/modules/menu/menu.dart';
import '/modules/selectunit/selectunit.dart';
import '/shared/exception.dart';
import '/shared/locale/locale.dart';
import '/shared/nav.dart';
import '/shared/utils/format_utils.dart';
import '/shared/utils/unit_utils.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class _CategoryMenuWidgets {
  // final List<Widget> widgets;
  final List<ProductCategory> categories;
  final Map<String, List<ProductCategory>>? subCategoriesMap;
  final bool hasFavorites;
  final Map<String, List<Widget>> mainCategoryWidgetsMap;
//  final Map<String, List<Widget>>? subCategoryWidgetsMap;

  _CategoryMenuWidgets({
    // required this.widgets,
    required this.categories,
    required this.subCategoriesMap,
    required this.hasFavorites,
    required this.mainCategoryWidgetsMap,
//    this.subCategoryWidgetsMap,
  });

  bool hasSubCategories(String categoryId) {
    if (subCategoriesMap == null) {
      return false;
    } else {
      return subCategoriesMap![categoryId] != null;
    }
  }
}

class MenuScreen extends StatefulWidget {
  @override
  State<MenuScreen> createState() => _MenuScreenState();
}

class _MenuScreenState extends State<MenuScreen> {
  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: () async {
        getIt<ThemeBloc>().add(ResetTheme());
        return true;
      },
      child: BlocProvider(
        create: (BuildContext context) {
          var bloc = getIt<ProductListBloc>();
          bloc.add(LoadAllProductList(
            unitId: currentUnit!.id,
          ));
          return bloc;
        },
        child: MenuScreenInner(),
      ),
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
  final ProductListWidgetGenerator _generator = ProductListWidgetGenerator();
  bool _adBannerHidden = false;

  // Cart? _cart;

  int _selectedTab = 0;
  int _selectedSubTab = 0;
  int _favoritesIndex = 0;
  // final List<int> _listIndexMap = [];
  // final List<int> _tabIndexMap = [];

  @override
  void initState() {
    super.initState();
  }

  @override
  void dispose() {
    _tabController?.dispose();
    _subTabController?.dispose();
    super.dispose();
  }

  void _onRefresh() async {
    BlocProvider.of<ProductListBloc>(context).add(LoadAllProductList(
      unitId: currentUnit!.id,
    ));
  }

  void _onAddRemoveFavorites(List<FavoriteProduct>? favorites) async {
    BlocProvider.of<ProductListBloc>(context).add(RefreshFavoritesInProductList(
      favorites: favorites,
    ));
  }

  @override
  Widget build(BuildContext context) {
    Unit? unit = currentUnit;
    assert(unit != null);
    return Scaffold(
      appBar: ProductMenuAppBar(
        supportedServiceModeCount: unit?.supportedServingModes.length ?? 0,
      ),
      backgroundColor: theme.secondary0,
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
      floatingActionButton: StreamBuilder<Cart?>(
        stream: getIt<CartRepository>().getCurrentCartStream(unit!.id),
        builder: (context, AsyncSnapshot<Cart?> snapshot) {
          Cart? cart = snapshot.data;
          return Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            mainAxisSize: MainAxisSize.min,
            children: [
              Padding(
                padding: EdgeInsets.only(
                  right: 16.0,
                  bottom: Platform.isIOS ? 32.0 : 16.0,
                ),
                child: FloatingActionButton(
                  backgroundColor: theme.button,
                  child: Icon(
                    Icons.qr_code_scanner,
                    color: theme.secondary0,
                  ),
                  onPressed: () => showQRScannerModal(context, false),
                ),
              ),
              cart != null
                  ? Container(
                      height: 56.0,
                      // width: double.infinity,
                      margin: EdgeInsets.only(
                        bottom: 16.0,
                        left: 16.0,
                        right: 16.0,
                      ),
                      child: ElevatedButton(
                        onPressed: () => Nav.to(
                          CartScreen(),
                          animationType: NavAnim.SLIDEIN_DOWN,
                        ),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: theme.button,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(40),
                          ),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Spacer(),
                            Text(
                              // trans("cart.addToCart").toUpperCase(),
                              '${trans("cart.myCart")} (${formatCurrency(cart.totalPrice, cart.items[0].sumPriceShown.currency)})',
                              style: Fonts.satoshi(
                                fontSize: 16.0,
                                fontWeight: FontWeight.w700,
                                color: theme.buttonText,
                              ),
                            ),
                            Spacer(),
                            Icon(
                              Icons.arrow_forward,
                              color: theme.buttonText,
                            )
                          ],
                        ),
                      ))
                  : Container(),
            ],
          );
        },
      ),
      body: MultiBlocListener(
        listeners: [
          BlocListener<FavoritesBloc, FavoritesState>(
            listener: (context, state) {
              if (state is FavorteAddedOrRemoved) {
                _onAddRemoveFavorites(state.favorites);
              }
            },
          ),
          BlocListener<ExceptionBloc, ExceptionState>(
            listener: (BuildContext context, ExceptionState state) {
              if (state is ExceptionShowState) {
                log.d('Main.ExceptionState=$state');
                // Future.delayed(Duration(seconds: 1)).then((_) =>
                //     getIt<ExceptionBloc>().add(ShowException(state.exception)));
                showExceptionDialog(
                  context,
                  state.exception,
                  theme.primary,
                );
              }
            },
          ),
        ],
        child: BlocBuilder<ProductListBloc, ProductListState>(
          builder: (context, state) {
            if (state is ProductListLoaded) {
              if (state.productCategories != null &&
                  state.productCategories?.isNotEmpty == true) {
                return _buildMainMenu(
                  context,
                  unit,
                  state.productCategories!,
                  state.products,
                  state.favorites,
                );
              } else {
                return const NoProductCategoriesWidget();
              }
            }
            return const UnitMenuLoadingWidget();
          },
        ),
      ),
    );
  }

  Widget _buildMainMenu(
    BuildContext context,
    Unit unit,
    List<ProductCategory> productCategories,
    List<Product> products,
    List<FavoriteProduct>? favorites,
  ) {
    _CategoryMenuWidgets widgetsMenu = _buildProductList(
      context: context,
      unit: unit,
      productCategories: productCategories,
      products: products,
      favorites: favorites,
    );
    // log.e('_listIndexMap=${_listIndexMap}');
    // log.e('_tabIndexMap=${_tabIndexMap}');


    ProductCategory? category;
    List<ProductCategory>? subCategories = [];
    bool hasSubCategories = false;
    if (widgetsMenu.categories.isNotEmpty) {
      category = widgetsMenu.categories[_tabController!.index];
      hasSubCategories = widgetsMenu.hasSubCategories(category.id);
      if (widgetsMenu.subCategoriesMap != null) {
        subCategories = widgetsMenu.subCategoriesMap![category.id!];
      }
    }

    return RefreshIndicator(
        onRefresh: () async => _onRefresh(),
        color: theme.button,
        child: NestedScrollView(
          physics: const BouncingScrollPhysics(),
          headerSliverBuilder: (BuildContext context, bool innerBoxIsScrolled) {
            // Animated Unit info
            return <Widget>[
              SliverAppBar(
                backgroundColor: theme.secondary0,
                automaticallyImplyLeading: false,
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
                      58.0 + (hasSubCategories ? 64.0 : 0.0),
                  maxHeight:
                      58.0 + (hasSubCategories ? 64.0 : 0.0),
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
                          ProductCategoryTabWidget(
                            tabController: _tabController!,
                            addFavorites: widgetsMenu.hasFavorites,
                            categories: widgetsMenu.categories,
                            onTap: (index) => _handleTabTap(context, index),
                          ),
                          // Subcategory tabbar
                          if (hasSubCategories)
                            IndexedStack(
                              index: 0,
                              children: [
                                //for (Widget widget in curSubCategoryWidgets)
                                  SubCategoryTabBarWidget(
                                    controller: _subTabController!,
                                    subCategories: subCategories!,
                                    onTap: (index) => log.i('onTap $index'),
                                  ),
                              ]

                            ),
                            /*IndexedStack(
                              index: 0,
                              children: menu.productCategories
                                  .map(
                                    (e) => DefaultTabController(
                                      length: widgetsMenu.productCategories.length,
                                      initialIndex: 0,
                                      child: SubCategoryTabBarWidget(
                                        // controller: _subTabController!,
                                        // controller: ,
                                        productCategories:
                                            widgetsMenu.productCategories,
                                        onTap: (index) => log.i('onTap $index'),
                                      ),
                                    ),
                                  )
                                  .toList(),
                            ),*/
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
            physics: NeverScrollableScrollPhysics(), //BouncingScrollPhysics(),
            children: [
              ...widgetsMenu.mainCategoryWidgetsMap.entries
                  .map((entry) => RefreshIndicator(
                      onRefresh: () async => _onRefresh(),
                      color: theme.button,
                      child: SingleChildScrollView(
                        // controller: _scrollController,
                        primary: true,
                        // physics: BouncingScrollPhysics(),
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: widgetsMenu.mainCategoryWidgetsMap[entry.key] ?? [],
                        ),
                      )))
                  .toList(),
            ],
          ),
        ));
  }

  _CategoryMenuWidgets _buildProductList({
    required BuildContext context,
    required Unit unit,
    required List<ProductCategory> productCategories,
    required List<Product> products,
    List<FavoriteProduct>? favorites,
  }) {
    _favoritesIndex = favorites?.isNotEmpty == true ? 1 : 0;

    _selectedTab = _favoritesIndex;
    _selectedSubTab = 0;
    GeneratedMenu menu = _generator.generateMenu(
      context: context,
      unit: unit,
      categories: productCategories,
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
    ServingMode servingMode = currentServingMode;

    Map<String, List<Widget>>? mainCategoryWidgetsMap;
//    Map<String, List<Widget>>? subCategoryWidgetsMap;
    mainCategoryWidgetsMap = {};

    // Add favorites tab
    if (_favoritesIndex > 0) {
      List<Widget> items = _getWidgetsFromMenuItems(
        menu.categoryMenuItemsMap!['favorites']!,
        unit,
        servingMode,
      );
      mainCategoryWidgetsMap['favorites'] = items;
    }

//    if (!menu.hasSubCategories) {
      // Build main menu widgets without subcategories
      for (int i = 0; i < menu.categories.length; i++) {
        ProductCategory category = menu.categories[i];
        List<Widget> items = _getWidgetsFromMenuItems(
          menu.categoryMenuItemsMap![category.id]!,
          unit,
          servingMode,
        );
        mainCategoryWidgetsMap[category.id] = items;
      }
/*    } else {
      subCategoryWidgetsMap = {};
      menu.subCategoriesMap!.entries.forEach((element) {
        var categoryId = element.key;
        List<Widget> items = _getWidgetsFromMenuItems(
          element.value.menuItems,
          unit,
          servingMode,
        );
        subCategoryWidgetsMap?[categoryId] = items;
      });
    }*/

    return _CategoryMenuWidgets(
      categories: menu.categories,
      subCategoriesMap: menu.subCategoriesMap,
      hasFavorites: _favoritesIndex == 1,
      mainCategoryWidgetsMap: mainCategoryWidgetsMap,
//      subCategoryWidgetsMap: subCategoryWidgetsMap,
    );
  }

  _handleTabTap(BuildContext context, int index) {
    // int itemIndex = _tabIndexMap[index];
    // log.w('_handleTabTap[$index]=itemInMap:$itemIndex map:$_tabIndexMap');
    // _scrollController.scrollToIndex(index: index, scrollSpeed: 2.0);
    // _tabController?.animateTo(index);
    print("index: $index  _selectedTab: $_selectedTab");
    _selectedTab = index;
    // refresh subcategories
    /*setState(() {

    });*/
  }

  List<Widget> _getWidgetsFromMenuItems(
    List<MenuListItem> menuItems,
    Unit unit,
    ServingMode servingMode,
  ) {
    List<Widget> results = [];
    for (int i = 0; i < menuItems.length; i++) {
      MenuListItem item = menuItems[i];
      if (item is MenuItemHeader) {
        results.add(
          ProductCategoryHeaderWidget(
            name: item.title,
            // key: _tabKeys[cIndex],
          ),
        );
        continue;
      } else if (item is MenuItemFavorite) {
        results.add(ProductMenuItemWidget(
          displayState: item.displayState,
          unit: unit,
          item: item.product,
          servingMode: servingMode,
        ));
        continue;
      } else if (item is MenuItemProduct) {
        //
        results.add(ProductMenuItemWidget(
          displayState: item.displayState,
          unit: unit,
          item: item.product,
          servingMode: servingMode,
        ));
        continue;
      } else if (item is MenuItemAdBanner) {
        if (!_adBannerHidden) {
          results.add(
            AdBannerCardWidget(
              banner: item.adBanner,
              animated: true,
              onClosed: () {
                setState(() {
                  _adBannerHidden = true;
                });
              },
            ),
          );
        }
        continue;
      }
      throw Exception('Unknown item type');
    }
    return results;
  }
}
