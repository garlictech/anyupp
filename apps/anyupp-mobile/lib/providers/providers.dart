import 'package:anyupp/domain/services/services.dart';
import 'package:anyupp/models/ProductComponent.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '/data/repositories/repositories.dart';
import '/device/repositories/repositories.dart';
import '/domain/repositories/repositories.dart';
import '/domain/usecases/usecases.dart';
import '/core/core.dart';
import '/models.dart';

// data/repositories
final geoLocationRepositoryProvider =
    Provider<GeoLocationRepository>((ref) => GeoLocationRepositoryImpl());

final userRepositoryProvider =
    Provider<UserRepository>((ref) => UserRepositoryAmplify());

final productRepositoryProvider =
    Provider<ProductRepository>((ref) => ProductRepositoryAmplify());

final productComponentRepositoryProvider =
    Provider<ProductComponentRepository>((ref) => ProductComponentRepositoryAmplify());
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

final productComponentsOfAProductProvider =
    FutureProvider.family<List<ProductComponent>, String>(
        (ref, productId) async {
        return configComponentsOfAProduct(ref, productId);
});

// ui
final themeProvider = Provider<ThemeChainData>((ref) {
  return defaultTheme();
});
