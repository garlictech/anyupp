import 'package:anyupp/models/extensions/ProductCategoryExtension.dart';
import 'package:flutter/material.dart';

import '/graphql/generated/crud-api.dart';
import '/models.dart';
import '/modules/adbanner/adbanner.dart';
import '/modules/menu/menu.dart';
import '/shared/locale/locale.dart';

class GeneratedMenu {
  // categories to display in tabs
  final List<ProductCategory> categories;

  // Key: Main category id, if null no subcategories present
  final Map<String, List<ProductCategory>>? subCategoriesMap;

  // a widget map will be generated based on this map
  final Map<String, List<MenuListItem>>? categoryMenuItemsMap;

  const GeneratedMenu({
    required this.categories,
    this.subCategoriesMap,
    this.categoryMenuItemsMap,
  });
}

class GeneratedSubMenu {
  // Sub categories of main category
  final List<ProductCategory> subCategories;

  GeneratedSubMenu({
    required this.subCategories,
  });
}

abstract class MenuListItem {}

class MenuItemHeader extends MenuListItem {
  final String title;

  MenuItemHeader({
    required this.title,
  });
}

class MenuItemFavorite extends MenuListItem {
  final Product product;
  final ProductItemDisplayState displayState;

  MenuItemFavorite({
    required this.product,
    required this.displayState,
  });
}

class MenuItemProduct extends MenuListItem {
  final Product product;
  final ProductItemDisplayState displayState;

  MenuItemProduct({
    required this.product,
    required this.displayState,
  });
}

class MenuItemAdBanner extends MenuListItem {
  final ImageAsset adBanner;

  MenuItemAdBanner({
    required this.adBanner,
  });
}

class ProductListWidgetGenerator {
  GeneratedMenu generateMenu({
    required BuildContext context,
    required Unit unit,
    required List<ProductCategory> categories,
    required List<Product> products,
    List<FavoriteProduct>? favorites,
    required ServingMode servingMode,
  }) {
    List<ProductCategory> filteredCategories = [];
    Map<String, List<ProductCategory>> subCategoriesMap = {};
    // Grouping products by product category
    List<Product> tempProducts = _filterUnavailableProducts(products, unit);
    Map<String, List<Product>> productsMap =
        tempProducts.groupBy((p) => p.productCategoryId);
    productsMap.removeWhere((key, value) => value.isEmpty);
    Map<String, List<MenuListItem>> categoryMenuItemsMap = {};

    // Add favorites section if any
    if (favorites?.isNotEmpty == true) {
      List<MenuListItem> favoriteItems = List<MenuListItem>.from(favorites!.map(
        (favorite) {
          return MenuItemFavorite(
              product: favorite.product,
              displayState: _getProductState(
                favorite.product,
                unit,
                servingMode,
              ));
        },
      ));

      MenuListItem? banner = _getBanner(unit);
      if (banner != null) {
        favoriteItems.add(banner);
      }
      categoryMenuItemsMap['favorites'] = favoriteItems;
    }

    // Build productCategory map, handle only main categories
    for (int i = 0; i < categories.length; i++) {
      ProductCategory category = categories[i];
      String? parentId = category.getParentId(unit);
      if (parentId == null) {
        // do not ignore categories which not contain products but contain subcategories
        /*
        if (productsMap[category.id] == null) {
          // if there is no product for this category: ignore
          continue;
        }*/

        // products of this category
        List<Product> entries = productsMap[category.id] ?? [];
        // add menuItems to menuItems of this category
        // add products too
        List<MenuListItem> productMenuItems =
            List<MenuListItem>.from(entries.map(
          (product) {
            return MenuItemProduct(
              product: product,
              displayState: _getProductState(
                product,
                unit,
                servingMode,
              ),
            );
          },
        ));
        // add a banner if possible
        MenuListItem? banner = _getBanner(unit);
        if (banner != null) {
          productMenuItems.add(banner);
        }

        // collect main categories
        filteredCategories.add(category);
        // collect menuItems for category ids
        categoryMenuItemsMap[category.id] = productMenuItems;
      }
    }

    // again, but handle only subcategories
    for (int i = 0; i < categories.length; i++) {
      ProductCategory category = categories[i];
      String? parentId = category.getParentId(unit);
      if (parentId != null) {
        if (productsMap[category.id] == null) {
          // if there is no product for this category: ignore
          continue;
        }

        // products of this category
        List<Product> entries = productsMap[category.id] ?? [];

        // add menuItems to menuItems of parent category
        List<MenuListItem> productMenuItems =
            categoryMenuItemsMap[parentId] ?? [];
        // add a header too
        productMenuItems.add(MenuItemHeader(
          title: getLocalizedText(context, category.name),
        ));
        // add products too
        productMenuItems.addAll(List<MenuListItem>.from(entries.map(
          (product) {
            return MenuItemProduct(
              product: product,
              displayState: _getProductState(
                product,
                unit,
                servingMode,
              ),
            );
          },
        )));
        // add a banner if possible
        MenuListItem? banner = _getBanner(unit);
        if (banner != null) {
          productMenuItems.add(banner);
        }

        // collect subcategories for category ids
        List<ProductCategory> subCategories =
            subCategoriesMap[parentId] ?? [];
        subCategories.add(category);
        subCategoriesMap[parentId!] = subCategories;

        // collect menuItems for category ids
        categoryMenuItemsMap[parentId!] = productMenuItems;
      }
    }

    // delete categories without products
    filteredCategories.removeWhere((category) => categoryMenuItemsMap[category.id] == null || categoryMenuItemsMap[category.id]!.isEmpty);

    return GeneratedMenu(
      categories: filteredCategories,
      subCategoriesMap: subCategoriesMap.isEmpty ? null : subCategoriesMap,
      categoryMenuItemsMap:
          categoryMenuItemsMap.isEmpty ? null : categoryMenuItemsMap,
    );
  }

  MenuListItem? _getBanner(
    Unit unit,
  ) {
    if (unit.adBannersEnabled == true) {
      ImageAsset? banner = getRandomBanner(banners: unit.adBanners);
      return MenuItemAdBanner(
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
