import 'package:anyupp/core/dependency_indjection/dependency_injection.dart';
import 'package:anyupp/models/Product.dart';
import 'package:anyupp/shared/auth.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final productProvider = StreamProvider.family<Product, String>((ref, productId) {
  final AuthRepository _authRepository = getIt<AuthRepository>();
  return _authRepository.getAuthenticatedUserProfileStream();
});
