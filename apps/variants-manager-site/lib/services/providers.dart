import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'cognito_service.dart';
import 'graphql/graphql.dart';

final amplifyApiProvider = Provider<AmplifyApi>((ref) {
  final cognitoService = ref.watch(cognitoServiceProvider);
  return AmplifyApi(cognitoService: cognitoService);
});
