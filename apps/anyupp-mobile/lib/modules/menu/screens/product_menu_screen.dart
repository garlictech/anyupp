import 'dart:io';
import 'dart:math';

import 'package:anyupp/shared/utils/buildcontext_extension.dart';
import 'package:anyupp/shared/utils/rect_extension.dart';
import 'package:anyupp/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

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

  int _selectedTab = 0;
  int _selectedSubTab = 0;
  int _favoritesIndex = 0;
  late _CategoryMenuWidgets widgetsMenu;

  final GlobalKey _subCatTabKey = GlobalKey(debugLabel: "_subCatTabKey");

  //final ScrollController _scrollController = ScrollController();
  bool _isScrollNotificationEnabled = true;

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
          return Stack(
            children: [
              Positioned(
                left: 0,
                right: 0,
                bottom: 0,
                height: 134,
                child: IgnorePointer(
                  child: Container(
                    width: double.infinity,
                    height: 134,
                    decoration: BoxDecoration(
                        gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [
                        Color(0x00FFFFFF),
                        Color(0xE0FFFFFF),
                      ],
                    )),
                  ),
                ),
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Padding(
                    padding: EdgeInsets.only(
                      right: 16.0,
                      bottom: Platform.isIOS ? 32.0 : 16.0,
                    ),
                    child: FloatingActionButton(
                      backgroundColor: UnitUtils.isClosed(unit)
                          ? theme.button.withOpacity(0.5)
                          : theme.button,
                      //tooltip: trans('selectUnit.scanQR'), todo: do it later?
                      child: Icon(
                        Icons.qr_code_scanner,
                        color: theme.secondary0,
                      ),
                      onPressed: UnitUtils.isClosed(unit)
                          ? null
                          : () => showQRScannerModal(context, false),
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
                            onPressed: () => UnitUtils.isClosed(unit)
                                ? null
                                : Nav.to(
                                    CartScreen(),
                                    animationType: NavAnim.SLIDEIN_DOWN,
                                  ),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: UnitUtils.isClosed(unit)
                                  ? theme.button.withOpacity(0.5)
                                  : theme.button,
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
              ),
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
    _initProductList(
      context: context,
      unit: unit,
      productCategories: productCategories,
      products: products,
      favorites: favorites,
    );

    // has any category sub categories?
    bool hasAnySubCategories = false;
    if (widgetsMenu.categories.isNotEmpty) {
      hasAnySubCategories = widgetsMenu.subCategoriesMap != null;
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
                  minHeight: 58.0 + (hasAnySubCategories ? 46.0 : 0.0),
                  maxHeight: 58.0 + (hasAnySubCategories ? 46.0 : 0.0),
                  child: Material(
                    elevation: 1.0,
                    shadowColor: theme.secondary12,
                    child: Container(
                      padding: const EdgeInsets.only(left: 8.0, bottom: 4.0),
                      // margin: const EdgeInsets.only(top: 4.0, bottom: 8.0),
                      color: theme.secondary0,
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          // Main category tabBar
                          ProductCategoryTabWidget(
                            tabController: _tabController!,
                            addFavorites: widgetsMenu.hasFavorites,
                            categories: widgetsMenu.categories,
                            onTap: (index) => _handleTabTap(context, index),
                          ),
                          // builder for setState refresh
                          if (hasAnySubCategories)
                            StatefulBuilder(
                                key: _subCatTabKey,
                                builder: (BuildContext context,
                                    StateSetter setState) {
                                  // calculate cur category
                                  List<ProductCategory>? subCategories = getCurrentSubcategories(_tabController!.index);
                                  return Column(
                                    children: [
                                      // Subcategory tabBar
                                      if (subCategories != null && subCategories.isNotEmpty)
                                        IndexedStack(index: 0, children: [
                                          SubCategoryTabBarWidget(
                                            controller: _subTabController!,
                                            subCategories: subCategories!,
                                            onTap: (index) => _handleSubTabTap(
                                                context, index),
                                          ),
                                        ]),
                                      if (subCategories == null || subCategories.isEmpty)
                                        Container(
                                          height: 50,
                                        ),
                                    ],
                                  );
                                }),
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
                      child: SwipeDetector(
                        onSwipeLeft: () {
                          if (_tabController!.length >
                              _tabController!.index + 1) {
                            int index = _tabController!.index + 1;
                            _tabController!.index = index;
                            _handleTabTap(context, index);
                          }
                        },
                        onSwipeRight: () {
                          if (_tabController!.length > 0 &&
                              _tabController!.index > 0) {
                            int index = _tabController!.index - 1;
                            _tabController!.index = index;
                            _handleTabTap(context, index);
                          }
                        },
                        child: NotificationListener<ScrollEndNotification>(
                          onNotification: (scrollEnd) {
                            if (_isScrollNotificationEnabled) {
                              // iterate over widgets of current category
                              ProductCategory category =
                                  widgetsMenu.categories[_tabController!.index];
                              int count = -1;
                              for (Widget widget in widgetsMenu
                                  .mainCategoryWidgetsMap[category.id]!) {
                                if (widget is ProductCategoryHeaderWidget) {
                                  count++;
                                  // get bounds of header widget
                                  GlobalKey key = widget.key as GlobalKey;
                                  Rect? headerRect =
                                      key.currentContext?.getDrawingRect()!;
                                  if (headerRect != null) {
                                    // get bounds of scrollView
                                    final ScrollableState scrollableState =
                                        Scrollable.of(key.currentContext!)!;
                                    Rect scrollRect = scrollableState.context
                                        .getDrawingRect()!;
                                    // is this header widget in the visible area of the scrollView
                                    //print("rect: $headerRect   rect2: $scrollRect");
                                    if (headerRect.top > 180 &&
                                        scrollRect.containsRect(headerRect)) {
                                      // change sub category (first 180 point is for headers)
                                      _selectedSubTab = count;
                                      _subTabController!.animateTo(count);
                                      break;
                                    }
                                  }
                                }
                              }
                            }
                            return false;
                          },
                          child: SingleChildScrollView(
                            // controller: _scrollController,
                            primary: true,
                            // physics: BouncingScrollPhysics(),
                            child: Column(
                              mainAxisSize: MainAxisSize.min,
                              children: widgetsMenu
                                      .mainCategoryWidgetsMap[entry.key] ??
                                  [],
                            ),
                          ),
                        ),
                      )))
                  .toList(),
            ],
          ),
        ));
  }

  List<ProductCategory>? getCurrentSubcategories(int index) {
    ProductCategory? category;
    List<ProductCategory>? subCategories = [];
    if (widgetsMenu.categories.isNotEmpty && widgetsMenu.categories.length > index) {
      category = widgetsMenu.categories[index];
      if (widgetsMenu.subCategoriesMap != null) {
        subCategories = widgetsMenu.subCategoriesMap![category.id!];
      }
    }
    return subCategories;
  }

  void _initProductList({
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

    ServingMode servingMode = currentServingMode;

    Map<String, List<Widget>>? mainCategoryWidgetsMap;
    mainCategoryWidgetsMap = {};

    // todo: we must test it, I think we should handle it in another mode
    // Add favorites tab
    if (_favoritesIndex > 0) {
      List<Widget> items = _getWidgetsFromMenuItems(
        menu.categoryMenuItemsMap!['favorites']!,
        unit,
        servingMode,
      );
      mainCategoryWidgetsMap['favorites'] = items;
    }

    // Build main menu widgets (without subcategories)
    for (int i = 0; i < menu.categories.length; i++) {
      ProductCategory category = menu.categories[i];
      List<Widget> items = _getWidgetsFromMenuItems(
        menu.categoryMenuItemsMap![category.id]!,
        unit,
        servingMode,
      );
      mainCategoryWidgetsMap[category.id] = items;
    }

    widgetsMenu = _CategoryMenuWidgets(
      categories: menu.categories,
      subCategoriesMap: menu.subCategoriesMap,
      hasFavorites: _favoritesIndex == 1,
      mainCategoryWidgetsMap: mainCategoryWidgetsMap,
    );

    // todo: we must test it, I think we should handle the _favoritesIndex in another mode
    _tabController = TabController(
      length: menu.categories.length + _favoritesIndex,
      vsync: this,
      initialIndex: _selectedTab,
    );

    initSubTabControllerForTabIndex(0);

  }

  void initSubTabControllerForTabIndex(int index) {
    List<ProductCategory>? subCategories = getCurrentSubcategories(index);
    //print("subCategories: $subCategories");
    _subTabController = TabController(
      length: subCategories?.length ?? 0,
      vsync: this,
      initialIndex: _selectedSubTab,
    );
  }

  _handleTabTap(BuildContext context, int index) {
    //print("_handleTabTap  index: $index  _selectedTab: $_selectedTab");

    _selectedTab = index;

    initSubTabControllerForTabIndex(index);

    // init sub tab bar index
    if (_subTabController!.length > 0) {
      _subTabController!.index = 0;
    }

    /* this would be good, but controller does not work with primary: true
    // scroll to top (without tab controller)
    // refresh only the subCategory tab widget
    _subCatTabKey.currentState?.setState(() {
      _scrollController.jumpTo(0);
    });
    */

    // refresh the subCategory tab widget
    _subCatTabKey.currentState?.setState(() {
      // scroll to top (without tab controller)
      Future.delayed(Duration(milliseconds: 100), () {
        ProductCategory category =
            widgetsMenu.categories[_tabController!.index];
        for (Widget widget
            in widgetsMenu.mainCategoryWidgetsMap[category.id]!) {
          GlobalKey? key = widget.key as GlobalKey?;
          //print("_handleTabTap  widget: $widget   key.currentContext: ${key?.currentContext}");
          if (key != null && key.currentContext != null) {
            _isScrollNotificationEnabled = false;
            Scrollable.ensureVisible(key.currentContext!,
                    duration: Duration(milliseconds: 50), alignment: 0)
                .then((value) => _isScrollNotificationEnabled = true);
            break;
          }
        }
      });
    });
  }

  _handleSubTabTap(BuildContext context, int index) {
    //print("** _handleSubTabTap  index: $index  _selectedSubTab: $_selectedSubTab");

    _selectedSubTab = index;

    // calculate scroll position manually. Problem: Scrollable.ensureVisible is unusable in nested scrolls, because the result scroll position is not accurate
    double pos = 0;
    // search the header
    int count = -1;
    ProductCategory category = widgetsMenu.categories[_tabController!.index];
    for (Widget widget in widgetsMenu.mainCategoryWidgetsMap[category.id]!) {
      if (widget is ProductMenuItemWidget) {
        pos += 113;
      } else if (widget is ProductCategoryHeaderWidget) {
        count++;
        if (count == index) {
          GlobalKey? key = widget.key as GlobalKey?;
          if (key != null && key.currentContext != null) {
            ScrollableState? scrollable = Scrollable.of(key!.currentContext!);
            if (scrollable != null) {
              // scroll to position
              /*scrollable!.position.ensureVisible(
              key!.currentContext!.findRenderObject()!,
              );*/
              if (pos == 0) {
                pos = -1; // otherwise the scroll position will be wrong
              } else {
                pos = max(pos - 120, 0);
              }
              print("pos: $pos");
              _isScrollNotificationEnabled = false;
              scrollable!.position.animateTo(pos,
                  duration: Duration(milliseconds: 500), curve: Curves.ease)
                  .then((value) => _isScrollNotificationEnabled = true);
              //scrollable!.position.jumpTo(-10);
            }
          }
          break;
        } else {
          pos += 56;
        }
      }
    }

    /* solution with Scrollable.ensureVisible, but it seems buggy
    // search the header
    int count = -1;
    ProductCategory category = widgetsMenu.categories[_tabController!.index];
    for (Widget widget in widgetsMenu.mainCategoryWidgetsMap[category.id]!) {
      /* you should measure the size of widgets, but after scroll there is no currentContext for every widget
      // get bounds of scrollView
      // menuItem: 113   header: 56
      Rect? scrollRect = (widget.key as GlobalKey).currentContext?.getDrawingRect()!;
      print("  scrollRect: $scrollRect} ${scrollRect!.bottom - scrollRect!.top} ${widget.runtimeType}");
      */
      if (widget is ProductCategoryHeaderWidget) {
        count++;
        if (count == index) {
          // work with this header
          //print("****** count: $count  index: $index  widget: ${widget.name} ${widget.key}  ${(widget.key as GlobalKey).currentContext}");
          GlobalKey? key = widget.key as GlobalKey?;
          if (key != null && key.currentContext != null) {
            /*
            // get bounds of scrollView
            Rect scrollRect = (widget.key as GlobalKey).currentContext!.getDrawingRect()!;
            print("       scrollRect: $scrollRect}");
            _scrollController.animateTo(scrollRect.top, duration: Duration(milliseconds: 500), curve: Curves.easeOut);
            */
            _isScrollNotificationEnabled = false;
            Scrollable.ensureVisible(key.currentContext!,
                    duration: Duration(milliseconds: 200))
                /*.then((value) =>
                    // bug? scroll again
                    Scrollable.ensureVisible(
                        (widget.key as GlobalKey).currentContext!,
                        duration: Duration(milliseconds: 200),
                        alignment: 0))*/
                .then(
              (value) => _isScrollNotificationEnabled = true,
            );
            return;
          }
          return;
        }
      }
    }*/

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
            key: GlobalKey(),
            name: item.title,
          ),
        );
        continue;
      } else if (item is MenuItemFavorite) {
        results.add(ProductMenuItemWidget(
          key: GlobalKey(),
          displayState: item.displayState,
          unit: unit,
          item: item.product,
          servingMode: servingMode,
        ));
        continue;
      } else if (item is MenuItemProduct) {
        //
        results.add(ProductMenuItemWidget(
          key: GlobalKey(),
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

    // because of bottom paddings of listview
    if (results.length > 1) {
      results.add(Container(height: 100));
    }

    return results;
  }
}

class _CategoryMenuWidgets {
  final List<ProductCategory> categories;
  final Map<String, List<ProductCategory>>? subCategoriesMap;
  final bool hasFavorites;
  final Map<String, List<Widget>> mainCategoryWidgetsMap;

  _CategoryMenuWidgets({
    required this.categories,
    required this.subCategoriesMap,
    required this.hasFavorites,
    required this.mainCategoryWidgetsMap,
  });

  bool hasSubCategories(String categoryId) {
    if (subCategoriesMap == null) {
      return false;
    } else {
      return subCategoriesMap![categoryId] != null;
    }
  }
}
