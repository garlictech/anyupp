import 'dart:collection';

import '/graphql/generated/crud-api.dart';
import '/models.dart';
import '/modules/adbanner/adbanner.dart';
import '/modules/menu/menu.dart';
import '/shared/locale/locale.dart';
import 'package:flutter/material.dart';

class GeneratedMenu {
  // categories to display in tabs
  final List<ProductCategory> categories;
  // Key: Main category id, if null no subcategories present
//  final Map<String, GeneratedSubMenu>? subCategoriesSubMenuMap;
  final Map<String, List<ProductCategory>>? subCategoriesMap;
  // a widget map will be generated based on this map
  final Map<String, List<MenuListItem>>? categoryMenuItemsMap;

  const GeneratedMenu({
    required this.categories,
    this.subCategoriesMap,
    this.categoryMenuItemsMap,
  });

  /*
  bool hasSubCategories() {
    return subCategoriesMap?.isNotEmpty == true;
  }

  bool hasSubCategoriesForCategoryId(String categoryId) {
    return subCategoriesMap?.isNotEmpty == true;
  }*/

}

class GeneratedSubMenu {
  // Sub categories of main category
  final List<ProductCategory> subCategories;
  // The full list of the menu of all the subcategories
//  final List<MenuListItem> menuItems;    // todo: ez sztem nem kell, mert csak a fő kategóriának vannak elemei

//  final List<int> listIndexes;
//  final List<int> tabIndexes;

  GeneratedSubMenu({
//    required this.menuItems,
    required this.subCategories,
//    required this.listIndexes, // todo ez mi?
//    required this.tabIndexes, // todo ez mi?
  });
}

abstract class MenuListItem {
//  final int position; // todo ez mi?
//  const MenuListItem({required this.position});
}

class MenuItemHeader extends MenuListItem {
  final String title;
//final int position;

  MenuItemHeader({
//    required int position,
    required this.title,
  }); //: super(position: position);
}

class MenuItemFavorite extends MenuListItem {
//final int position;
  final Product product;
  final ProductItemDisplayState displayState;

  MenuItemFavorite({
//    required int position,
    required this.product,
    required this.displayState,
  }); // : super(position: position);
}

class MenuItemProduct extends MenuListItem {
//final int position;
  final Product product;
  final ProductItemDisplayState displayState;

  MenuItemProduct({
//    required int position,
    required this.product,
    required this.displayState,
  }); // : super(position: position);
}

class MenuItemAdBanner extends MenuListItem {
//final int position;
  final ImageAsset adBanner;

  MenuItemAdBanner({
//    required int position,
    required this.adBanner,
  }); // : super(position: position);
}

class ProductListWidgetGenerator {
  // final _RND = Random();
//  int _tabPos = 0;
//  int _itemPos = 0;
  // bool _bannerAdded = true;
  // int _bannerPosition = 0;
/*
  void _reset() {
//    _tabPos = 0;
    _itemPos = 0;
    // _bannerAdded = true;
    // _bannerPosition = 0;
  }
*/
  /*
  GeneratedSubMenu generateSubMenu({
    required BuildContext context,
    required Unit unit,
    required List<ProductCategory> subCategories,
    required List<Product> products,
    required ServingMode servingMode,
  }) {
    List<Product> tempProducts = _filterUnavailableProducts(products, unit);
    Map<String, List<Product>> productsMap = tempProducts.groupBy((p) => p.productCategoryId);
//    int _tabPos = 0;
//    int _itemPos = 0;
//    List<int> listIndexes = [];
//    List<int> tabIndexes = [];

    //List<MenuListItem> listItems = [];
    List<ProductCategory> filteredSubCategories = [];

    for (int i = 0; i < subCategories.length; i++) {
      ProductCategory category = subCategories[i];
      // Skip empty categories
      if (category.parentId == null ||
          productsMap[category.id]?.isNotEmpty != true) {
        continue;
      }
      filteredSubCategories.add(category);
//      var entries = productMap[category.id] ?? [];
//      listIndexes.add(_tabPos);
//      tabIndexes.add(_itemPos);

      /*
      listItems.add(MenuItemHeader(
        position: _itemPos++,
        title: getLocalizedText(context, category.name),
      ));
      listItems.addAll(
        entries.map(
          (product) {
            listIndexes.add(_tabPos);
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
      */
    }

    return GeneratedSubMenu(
      subCategories: filteredSubCategories,
//      menuItems: listItems,
//      listIndexes: listIndexes,
//      tabIndexes: tabIndexes,
    );
  }*/

  GeneratedMenu generateMenu({
    required BuildContext context,
    required Unit unit,
    required List<ProductCategory> categories,
    required List<Product> products,
    List<FavoriteProduct>? favorites,
    required ServingMode servingMode,
  }) {
//    List<MenuListItem> listItems = [];
    List<ProductCategory> filteredCategories = [];
    Map<String, List<ProductCategory>> subCategoriesMap = {};
//    _reset();
    // Grouping products by product category
    List<Product> tempProducts = _filterUnavailableProducts(products, unit);
    Map<String, List<Product>> productsMap = tempProducts.groupBy((p) => p.productCategoryId);
    productsMap.removeWhere((key, value) => value.isEmpty);
    Map<String, List<MenuListItem>> categoryMenuItemsMap = {};

    // Add favorites section if any
    if (favorites?.isNotEmpty == true) {
      // log.e('_tabPositionMap[${_tabIndexMap.length - 1}]=$_itemPos');
      // listItems.add(MenuItemHeader(
      //   position: _itemPos++,
      //   title: transEx(context, 'main.menu.favorites'),
      // ));
      List<MenuListItem> favoriteItems = List<MenuListItem>.from(favorites!.map(
        (favorite) {
          return MenuItemFavorite(
//              position: _itemPos++,
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
//      MenuListItem? banner = _getBanner(listItems, unit);
      MenuListItem? banner = _getBanner(unit);
      if (banner != null) {
        favoriteItems.add(banner);
      }
//      listItems.addAll(favoriteItems);
      categoryMenuItemsMap['favorites'] = favoriteItems;
    }

    // Build productCategory map, handle only main categories
//    for (int i = 0; i < categories.length; i++) {
    for (int i = categories.length - 1; i >= 0; i--) {
      ProductCategory category = categories[i];
      if (category.parentId == null) {
        /*
        // collect subcategories below this category
        List<ProductCategory> subCategories = categories
            .where((element) =>
                (element.parentId != null && element.parentId == category.id))
            .toList();
        if (subCategories.isNotEmpty) {
          // if there are subcategories then handle them separately
          subCategoriesSubMenuMap[category.id] = generateSubMenu(
            context: context,
            unit: unit,
            subCategories: subCategories,
            products: products,
            servingMode: servingMode,
          );
          // todo
//filteredProductCategories.add(category);
          continue;
        }
        // from here there is no subcategory, handle one category with its products:
        */

        // do not ignore categories which not contain products but contain subcategories
        /*
        if (productsMap[category.id] == null) {
          // if there is no product for this category: ignore
          continue;
        }*/

        // products of this category
        List<Product> entries = productsMap[category.id] ?? [];
        // add menuitems to menuitems of this category
        // add products too
        List<MenuListItem> productMenuItems = List<MenuListItem>.from(entries.map(
          (product) {
            return MenuItemProduct(
//              position: _itemPos++,
              product: product,
              displayState: _getProductState(
                product,
                unit,
                servingMode,
              ),
            );
          },
        ));
//        if (productMenuItems.isNotEmpty) {
//          MenuListItem? banner = _getBanner(productMenuItems, unit);
          // add a banner if possible
          MenuListItem? banner = _getBanner(unit);
          if (banner != null) {
            productMenuItems.add(banner);
          }

        // collect main categories
          filteredCategories.add(category);
//          listItems.addAll(productMenuItems);
          // collect menuitems for category ids
          categoryMenuItemsMap[category.id] = productMenuItems;
//        }
      }
    }


    // again, but handle only subcategories
    for (int i = 0; i < categories.length; i++) {
      ProductCategory category = categories[i];
      if (category.parentId != null) {
        if (productsMap[category.id] == null) {
          // if there is no product for this category: ignore
          continue;
        }

        // products of this category
        List<Product> entries = productsMap[category.id] ?? [];

        // add menuitems to menuitems of parent category
        List<MenuListItem> productMenuItems = categoryMenuItemsMap[category.parentId] ?? [];
        // add a header too
        productMenuItems.add(MenuItemHeader(
//          position: _itemPos++,
          title: getLocalizedText(context, category.name),
        ));
        // add products too
        productMenuItems.addAll(
            List<MenuListItem>.from(entries.map(
                  (product) {
                return MenuItemProduct(
//                  position: _itemPos++,
                  product: product,
                  displayState: _getProductState(
                    product,
                    unit,
                    servingMode,
                  ),
                );
              },
            ))
        );
        // add a banner if possible
        MenuListItem? banner = _getBanner(unit);
        if (banner != null) {
          productMenuItems.add(banner);
        }

        // collect subcategories for category ids
        List<ProductCategory> subCategories = subCategoriesMap[category.parentId] ?? [];
        subCategories.add(category);
        subCategoriesMap[category.parentId!] = subCategories;

        // collect menuitems for category ids
        categoryMenuItemsMap[category.parentId!] = productMenuItems;

      }
    }


    return GeneratedMenu(
      categories: filteredCategories,
      subCategoriesMap: subCategoriesMap.isEmpty ? null : subCategoriesMap,
      categoryMenuItemsMap:
          categoryMenuItemsMap.isEmpty ? null : categoryMenuItemsMap,
    );
  }

  MenuListItem? _getBanner(
    //List<MenuListItem> listItems,
    Unit unit,
  ) {
    if (unit.adBannersEnabled == true) {
      ImageAsset? banner = getRandomBanner(banners: unit.adBanners);
      return MenuItemAdBanner(
//        position: _itemPos++,
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

  /*
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
      ProductCategory category = productCategories[i];
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
  }*/

}
