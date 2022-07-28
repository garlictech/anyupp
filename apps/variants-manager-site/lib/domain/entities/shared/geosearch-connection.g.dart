// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'geosearch-connection.dart';

// **************************************************************************
// FunctionalDataGenerator
// **************************************************************************

abstract class $GeosearchConnectionData {
  const $GeosearchConnectionData();

  List<String>? get items;
  String? get nextToken;
  int? get total;

  GeosearchConnectionData copyWith({
    List<String>? items,
    String? nextToken,
    int? total,
  }) =>
      GeosearchConnectionData(
        items: items ?? this.items,
        nextToken: nextToken ?? this.nextToken,
        total: total ?? this.total,
      );

  GeosearchConnectionData copyUsing(
      void Function(GeosearchConnectionData$Change change) mutator) {
    final change = GeosearchConnectionData$Change._(
      this.items,
      this.nextToken,
      this.total,
    );
    mutator(change);
    return GeosearchConnectionData(
      items: change.items,
      nextToken: change.nextToken,
      total: change.total,
    );
  }

  @override
  String toString() =>
      "GeosearchConnectionData(items: $items, nextToken: $nextToken, total: $total)";

  @override
  // ignore: avoid_equals_and_hash_code_on_mutable_classes
  bool operator ==(Object other) =>
      other is GeosearchConnectionData &&
      other.runtimeType == runtimeType &&
      items == other.items &&
      nextToken == other.nextToken &&
      total == other.total;

  @override
  // ignore: avoid_equals_and_hash_code_on_mutable_classes
  int get hashCode {
    var result = 17;
    result = 37 * result + items.hashCode;
    result = 37 * result + nextToken.hashCode;
    result = 37 * result + total.hashCode;
    return result;
  }
}

class GeosearchConnectionData$Change {
  GeosearchConnectionData$Change._(
    this.items,
    this.nextToken,
    this.total,
  );

  List<String>? items;
  String? nextToken;
  int? total;
}

// ignore: avoid_classes_with_only_static_members
class GeosearchConnectionData$ {
  static final items = Lens<GeosearchConnectionData, List<String>?>(
    (itemsContainer) => itemsContainer.items,
    (itemsContainer, items) => itemsContainer.copyWith(items: items),
  );

  static final nextToken = Lens<GeosearchConnectionData, String?>(
    (nextTokenContainer) => nextTokenContainer.nextToken,
    (nextTokenContainer, nextToken) =>
        nextTokenContainer.copyWith(nextToken: nextToken),
  );

  static final total = Lens<GeosearchConnectionData, int?>(
    (totalContainer) => totalContainer.total,
    (totalContainer, total) => totalContainer.copyWith(total: total),
  );
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GeosearchConnectionData _$GeosearchConnectionDataFromJson(
        Map<String, dynamic> json) =>
    GeosearchConnectionData(
      items:
          (json['items'] as List<dynamic>?)?.map((e) => e as String).toList(),
      nextToken: json['nextToken'] as String?,
      total: json['total'] as int?,
    );

Map<String, dynamic> _$GeosearchConnectionDataToJson(
        GeosearchConnectionData instance) =>
    <String, dynamic>{
      'items': instance.items,
      'nextToken': instance.nextToken,
      'total': instance.total,
    };
