import '/models.dart';

extension TipPolicyExtension on TipPolicy {
  bool get isEmpty => title == null || title!.isEmpty || percents.isEmpty;

  bool get isNotEmpty => !isEmpty;
}
