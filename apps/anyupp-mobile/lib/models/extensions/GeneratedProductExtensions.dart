import 'package:fa_prev/graphql/generated/crud-api.dart';
import 'package:fa_prev/models.dart';

extension GeneratedProductExtension on GeneratedProduct {
  bool isAvailableInServingMode(ServingMode? mode) {
    return mode != null && supportedServingModes.contains(mode);
  }
}
