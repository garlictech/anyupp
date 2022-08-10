import 'dart:collection';

import '/graphql/generated/crud-api.dart';
import '/models.dart';
import '/modules/adbanner/adbanner.dart';
import '/modules/menu/menu.dart';
import '/shared/locale/locale.dart';
import 'package:flutter/material.dart';

class GeneratedMenu {
  final List<ProductCategory> categories;
  // Key: Main category id, if null no subcategories present
  final Map<String, GeneratedSubMenu>? subMenu;

  // Main
  final Map<String, List<MenuListItem>>? mainCategoryMenuItems;

  const GeneratedMenu({
    required this.categories,
    this.subMenu,
    this.mainCategoryMenuItems,
  });

  bool get hasSubCategories => subMenu?.isNotEmpty == true;
}

class GeneratedSubMenu {
  // Sub categories of main category
  final List<ProductCategory> productCategories;
  // The full list of the menu of all the subcategories
  final List<MenuListItem> menuItems;

  final List<int> listIndexMap;
  final List<int> tabIndexMap;

  GeneratedSubMenu({
    required this.menuItems,
    required this.productCategories,
    required this.listIndexMap,
    required this.tabIndexMap,
  });
}

abstract class MenuListItem {
  final int position;
  const MenuListItem({required this.position});
}

class MenuItemHeader extends MenuListItem {
  final String title;
  final int position;

  const MenuItemHeader({
    required this.position,
    required this.title,
  }) : super(position: position);
}

class MenuItemFavorite extends MenuListItem {
  final int position;
  final Product product;
  final ProductItemDisplayState displayState;

  const MenuItemFavorite({
    required this.position,
    required this.product,
    required this.displayState,
  }) : super(position: position);
}

class MenuItemProduct extends MenuListItem {
  final int position;
  final Product product;
  final ProductItemDisplayState displayState;

  const MenuItemProduct({
    required this.position,
    required this.product,
    required this.displayState,
  }) : super(position: position);
}

class MenuItemAdBanner extends MenuListItem {
  final int position;
  final ImageAsset adBanner;

  const MenuItemAdBanner({
    required this.position,
    required this.adBanner,
  }) : super(position: position);
}

class ProductListWidgetGenerator {
  // final _RND = Random();
  int _tabPos = 0;
  int _itemPos = 0;
  // bool _bannerAdded = true;
  // int _bannerPosition = 0;

  void _reset() {
    _tabPos = 0;
    _itemPos = 0;
    // _bannerAdded = true;
    // _bannerPosition = 0;
  }

  GeneratedSubMenu generateSubMenu({
    required BuildContext context,
    required Unit unit,
    required List<ProductCategory> subCategories,
    required List<Product> products,
    required ServingMode servingMode,
  }) {
    var tempProducts = _filterUnavailableProducts(products, unit);
    var productMap = tempProducts.groupBy((p) => p.productCategoryId);
    int _tabPos = 0;
    int _itemPos = 0;
    List<int> listIndexMap = [];
    List<int> tabIndexMap = [];

    List<MenuListItem> listItems = [];
    List<ProductCategory> filteredProductCategories = [];

    for (int i = 0; i < subCategories.length; i++) {
      var category = subCategories[i];
      // Skip empty categories
      if (category.parentId == null ||
          productMap[category.id]?.isNotEmpty != true) {
        continue;
      }
      filteredProductCategories.add(category);
      var entries = productMap[category.id] ?? [];
      listIndexMap.add(_tabPos);
      tabIndexMap.add(_itemPos);

      listItems.add(MenuItemHeader(
        position: _itemPos++,
        title: getLocalizedText(context, category.name),
      ));
      listItems.addAll(
        entries.map(
          (product) {
            listIndexMap.add(_tabPos);
            return MenuItemProduct(
              position: _itemPos++,
              product: product,
              displayState: _getProductState(
                product,
                unit,
                servingMode,
              ),
            );
          },
        ),
      );
      MenuListItem? banner = _getBanner(listItems, unit);
      if (banner != null) {
        _itemPos++;
        listItems.add(banner);
      }
      _tabPos++;
    }

    return GeneratedSubMenu(
      productCategories: filteredProductCategories,
      menuItems: listItems,
      listIndexMap: listIndexMap,
      tabIndexMap: tabIndexMap,
    );
  }

  GeneratedMenu generateMenu({
    required BuildContext context,
    required Unit unit,
    required List<ProductCategory> productCategories,
    required List<Product> products,
    List<FavoriteProduct>? favorites,
    required ServingMode servingMode,
  }) {
    List<MenuListItem> listItems = [];
    List<ProductCategory> filteredProductCategories = [];
    Map<String, GeneratedSubMenu> subProductCategories = {};
    _reset();
    // Grouping products by product category
    var tempProducts = _filterUnavailableProducts(products, unit);
    var productMap = tempProducts.groupBy((p) => p.productCategoryId);
    productMap.removeWhere((key, value) => value.isEmpty);
    Map<String, List<MenuListItem>> mainCategoryMenuItems = {};

    // Add favorties section if any
    if (favorites?.isNotEmpty == true) {
      // log.e('_tabPositionMap[${_tabIndexMap.length - 1}]=$_itemPos');
      // listItems.add(MenuItemHeader(
      //   position: _itemPos++,
      //   title: transEx(context, 'main.menu.favorites'),
      // ));
      List<MenuListItem> favoriteItems = List<MenuListItem>.from(favorites!.map(
        (favorite) {
          return MenuItemFavorite(
              position: _itemPos++,
              product: favorite.product,
              displayState: _getProductState(
                favorite.product,
                unit,
                servingMode,
              ));
        },
      ));

      // _checkAndAddBanner(listItems, unit.adBanners);
      // _addBanner(listItems, unit);
      MenuListItem? banner = _getBanner(listItems, unit);
      if (banner != null) {
        favoriteItems.add(banner);
      }
      listItems.addAll(favoriteItems);
      mainCategoryMenuItems['favorites'] = favoriteItems;
    }

    // Build productCategory map
    for (int i = 0; i < productCategories.length; i++) {
      var category = productCategories[i];
      if (category.parentId == null) {
        var subCategories = productCategories
            .where((element) =>
                (element.parentId != null && element.parentId != category.id))
            .toList();
        if (subCategories.isNotEmpty) {
          subProductCategories[category.id] = generateSubMenu(
            context: context,
            unit: unit,
            subCategories: subCategories,
            products: products,
            servingMode: servingMode,
          );
          continue;
        }
        if (productMap[category.id] == null) {
          continue;
        }
        var entries = productMap[category.id] ?? [];
        List<MenuListItem> productItems = List<MenuListItem>.from(entries.map(
          (product) {
            return MenuItemProduct(
              position: _itemPos++,
              product: product,
              displayState: _getProductState(
                product,
                unit,
                servingMode,
              ),
            );
          },
        ));
        if (productItems.isNotEmpty) {
          MenuListItem? banner = _getBanner(productItems, unit);
          if (banner != null) {
            productItems.add(banner);
          }
          filteredProductCategories.add(category);
          listItems.addAll(productItems);
          mainCategoryMenuItems[category.id] = productItems;
        }
      }
    }

    return GeneratedMenu(
      categories: filteredProductCategories,
      subMenu: subProductCategories.isEmpty ? null : subProductCategories,
      mainCategoryMenuItems:
          mainCategoryMenuItems.isEmpty ? null : mainCategoryMenuItems,
    );
  }

  MenuListItem? _getBanner(
    List<MenuListItem> listItems,
    Unit unit,
  ) {
    if (unit.adBannersEnabled == true) {
      var banner = getRandomBanner(banners: unit.adBanners);
      return MenuItemAdBanner(
        position: _itemPos++,
        adBanner: banner ?? ImageAsset(imageUrl: 'assets/images/test_1.png'),
      );
    }
    return null;
  }

  // void _checkAndAddBanner(
  //   List<MenuListItem> listItems,
  //   List<ImageAsset>? adBanners,
  // ) {
  //   if (!_bannerAdded && _itemPos == _bannerPosition) {
  //     _bannerAdded = true;
  //     var banner = getRandomBanner(banners: adBanners);
  //     listItems.add(MenuItemAdBanner(
  //       position: _itemPos++,
  //       adBanner: banner ?? ImageAsset(imageUrl: 'assets/images/test_1.png'),
  //     ));
  //   }
  // }

  List<Product> _filterUnavailableProducts(
    List<Product> products,
    Unit unit,
  ) {
    if (unit.soldOutVisibilityPolicy == SoldOutVisibilityPolicy.invisible) {
      List<Product> availableProducts =
          products.where((p) => !p.soldOut).toList();
      return availableProducts;
    } else {
      return products;
    }
  }

  ProductItemDisplayState _getProductState(
    Product product,
    Unit unit,
    ServingMode servingMode,
  ) {
    bool isAvailableInThisServingMode =
        product.isAvailableInServingMode(servingMode);
    bool isSoldOut = product.soldOut;
    bool isHidden = isSoldOut &&
        unit.soldOutVisibilityPolicy == SoldOutVisibilityPolicy.invisible;
    ProductItemDisplayState displayState = ProductItemDisplayState.NORMAL;
    if (isSoldOut) {
      displayState = ProductItemDisplayState.SOLDOUT;
    } else if (!isAvailableInThisServingMode) {
      displayState = ProductItemDisplayState.DISABLED;
    }

    if (isHidden) {
      return ProductItemDisplayState.HIDDEN;
    }

    return displayState;
  }

  List<MenuListItem> generateMenuForCategory(
      BuildContext context,
      Unit unit,
      List<ProductCategory> productCategories,
      LinkedHashMap<String, List<Product>> productMap,
      ServingMode servingMode,
      List<int> listIndexMap,
      List<int> tabIndexMap) {
    List<MenuListItem> listItems = [];
    for (int i = 0; i < productCategories.length; i++) {
      var category = productCategories[i];
      if (category.parentId != null) {
        continue;
      }
      // Skip empty categories
      if (productMap[category.id] == null) {
        continue;
      }

      var entries = productMap[category.id] ?? [];
      listIndexMap.add(_tabPos);
      tabIndexMap.add(_itemPos);

      listItems.add(MenuItemHeader(
        position: _itemPos++,
        title: getLocalizedText(context, category.name),
      ));
      listItems.addAll(
        entries.map(
          (product) {
            listIndexMap.add(_tabPos);
            return MenuItemProduct(
              position: _itemPos++,
              product: product,
              displayState: _getProductState(
                product,
                unit,
                servingMode,
              ),
            );
          },
        ),
      );
      _tabPos++;
    }
    return [];
  }
}
