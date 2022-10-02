import 'package:anyupp/core/dependency_indjection/dependency_injection.dart';
import 'package:anyupp/shared/auth.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../models/User.dart';

final componentsOfAProductProvider = StreamProvider.family<List<ProductConfigComponent>, String>((ref) {
  final AuthRepository _authRepository = getIt<AuthRepository>();
  return _authRepository.getAuthenticatedUserProfileStream();
});
