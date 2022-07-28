import 'package:variants_manager_site/data/repositories/variant_appsync.dart';

import '/services/providers.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '/domain/domain.dart';
import '/data/repositories/admin_user_appsync.dart';
import 'repositories/product_appsync.dart';
import 'repositories/unit_appsync.dart';

final adminUserRepositoryProvider = Provider<AdminUserRepository>((ref) {
  final amplifyApi = ref.watch(amplifyApiProvider);
  return AdminUserRepositoryAppsync(amplifyApi);
});

final unitRepositoryProvider = Provider<UnitRepository>((ref) {
  final amplifyApi = ref.watch(amplifyApiProvider);
  return UnitRepositoryAppsync(amplifyApi);
});

final productRepositoryProvider = Provider<ProductRepository>((ref) {
  final amplifyApi = ref.watch(amplifyApiProvider);
  return ProductRepositoryAppsync(amplifyApi);
});

final variantRepositoryProvider = Provider<VariantRepository>((ref) {
  final amplifyApi = ref.watch(amplifyApiProvider);
  return VariantRepositoryAppsync(amplifyApi);
});
