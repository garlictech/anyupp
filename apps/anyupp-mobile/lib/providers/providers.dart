import 'package:anyupp/domain/services/services.dart';
import 'package:anyupp/models/ProductComponent.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:rxdart/rxdart.dart';
import '/data/repositories/repositories.dart';
import '/device/repositories/repositories.dart';
import '/domain/repositories/repositories.dart';
import '/domain/usecases/usecases.dart';
import '/core/core.dart';
import '/models.dart';
import 'package:dartz/dartz.dart' as dartz;

// data/repositories
final geoLocationRepositoryProvider =
    Provider<GeoLocationRepository>((ref) => GeoLocationRepositoryImpl());

final userRepositoryProvider =
    Provider<UserRepository>((ref) => UserRepositoryAmplify());

final productRepositoryProvider =
    Provider<ProductRepository>((ref) => ProductRepositoryAmplify());

final productComponentRepositoryProvider = Provider<ProductComponentRepository>(
    (ref) => ProductComponentRepositoryAmplify());

// domain/usecases
final callWaiterUsecaseProvider =
    StateNotifierProvider<CallWaiterUsecase, CallWaiterState>((ref) {
  return CallWaiterUsecase();
});

// domain/services
final productProvider =
    FutureProvider.family<Product, String>((ref, productId) {
  final productRepository = ref.read(productRepositoryProvider);
  return productRepository.getProduct(productId);
});

final productComponentSetProvider =
    FutureProvider.family<ProductComponentSet, String>((ref, id) {
  final productRepository = ref.read(productComponentRepositoryProvider);
  return productRepository.getProductComponentSet(id);
});

final productComponentsOfAProductProvider =
    FutureProvider.family<List<ProductComponent>, String>(
        (ref, productId) async {
  return configComponentsOfAProduct(ref, productId);
});

final productComponentSetsOfAProductProvider =
    FutureProvider.family<List<ProductComponentSet>, String>(
        (ref, productId) async {
  final Product product = await ref.watch(productProvider(productId).future);

  final items = product.configSets
          ?.map((set) => set.productSetId)
          .map((componentSetId) => Stream.fromFuture(
              ref.read(productComponentSetProvider(componentSetId).future)))
          .toList() ??
      [];
  return ConcatStream(items).toList();
});

final productComponentDataOfProductsProvider = FutureProvider.family<
    dartz.Tuple2<List<ProductComponent>, List<ProductComponentSet>>,
    List<Product>>((ref, products) async {
  final components =
      await ref.watch(componentsOfProductsProvider(products).future);
  final componentSets =
      await ref.watch(componentSetsOfProductsProvider(products).future);

  return dartz.Tuple2(components, componentSets);
});

final productComponentDataOfFavoriteProductsProvider = FutureProvider.family<
    dartz.Tuple2<List<ProductComponent>, List<ProductComponentSet>>,
    List<FavoriteProduct>>((ref, favoriteProducts) async {
  final products = favoriteProducts.map((favprod) => favprod.product).toList();
  final components =
      await ref.watch(componentsOfProductsProvider(products).future);
  final componentSets =
      await ref.watch(componentSetsOfProductsProvider(products).future);

  return dartz.Tuple2(components, componentSets);
});

final productComponentsOfACartProvider =
    FutureProvider.family<List<ProductComponent>, Cart>((ref, cart) async {
  final items = cart.items
      .map((item) => Stream.fromFuture(
          ref.read(productComponentsOfAProductProvider(item.productId).future)))
      .toList();
  return ConcatStream(items)
      .toList()
      .then((lists) => lists.expand((i) => i).toList());
});

final productComponentsOfAnOrderProvider =
    FutureProvider.family<List<ProductComponent>, Order>((ref, order) async {
  final items = order.items
      .map((item) => Stream.fromFuture(
          ref.read(productComponentsOfAProductProvider(item.productId).future)))
      .toList();
  return ConcatStream(items)
      .toList()
      .then((lists) => lists.expand((i) => i).toList());
});

final componentsOfProductsProvider =
    FutureProvider.family<List<ProductComponent>, List<Product>>(
        (ref, products) async {
  final items = products
      .map((item) => Stream.fromFuture(
          ref.read(productComponentsOfAProductProvider(item.id).future)))
      .toList();
  return ConcatStream(items)
      .toList()
      .then((lists) => lists.expand((i) => i).toList());
});

final componentsOfProductsByIdsProvider =
    FutureProvider.family<List<ProductComponent>, List<String>>(
        (ref, productsIds) async {
  final items = productsIds
      .map((item) => Stream.fromFuture(
          ref.read(productComponentsOfAProductProvider(item).future)))
      .toList();
  return ConcatStream(items)
      .toList()
      .then((lists) => lists.expand((i) => i).toList());
});

final componentSetsOfProductsProvider =
    FutureProvider.family<List<ProductComponentSet>, List<Product>>(
        (ref, products) async {
  final items = products
      .map((item) => Stream.fromFuture(
          ref.read(productComponentSetsOfAProductProvider(item.id).future)))
      .toList();
  return ConcatStream(items)
      .toList()
      .then((lists) => lists.expand((i) => i).toList());
});
// ui
final themeProvider = Provider<ThemeChainData>((ref) {
  return defaultTheme();
});
