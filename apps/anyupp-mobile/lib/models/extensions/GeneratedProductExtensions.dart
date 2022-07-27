import '/graphql/generated/crud-api.dart';
import '/models.dart';

extension GeneratedProductExtension on GeneratedProduct {
  bool isAvailableInServingMode(ServingMode? mode) {
    return mode != null && supportedServingModes.contains(mode);
  }
}
