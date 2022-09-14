import '/models/LocalizedItem.dart';

extension LocalizedItemExtension on LocalizedItem {
  bool get isEmpty => _empty(hu) && _empty(en) && _empty(de);

  bool get isNotEmpty => !isEmpty;

  bool _empty(String? s) => s == null || s.isEmpty;
}
