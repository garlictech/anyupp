// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'search-by-radius-input.dart';

// **************************************************************************
// FunctionalDataGenerator
// **************************************************************************

abstract class $SearchByRadiusInput {
  const $SearchByRadiusInput();

  Location get location;
  double get radiusInMeters;
  String get objectType;
  int? get limit;
  String? get nextToken;

  SearchByRadiusInput copyWith({
    Location? location,
    double? radiusInMeters,
    String? objectType,
    int? limit,
    String? nextToken,
  }) =>
      SearchByRadiusInput(
        location: location ?? this.location,
        radiusInMeters: radiusInMeters ?? this.radiusInMeters,
        objectType: objectType ?? this.objectType,
        limit: limit ?? this.limit,
        nextToken: nextToken ?? this.nextToken,
      );

  SearchByRadiusInput copyUsing(
      void Function(SearchByRadiusInput$Change change) mutator) {
    final change = SearchByRadiusInput$Change._(
      this.location,
      this.radiusInMeters,
      this.objectType,
      this.limit,
      this.nextToken,
    );
    mutator(change);
    return SearchByRadiusInput(
      location: change.location,
      radiusInMeters: change.radiusInMeters,
      objectType: change.objectType,
      limit: change.limit,
      nextToken: change.nextToken,
    );
  }

  @override
  String toString() =>
      "SearchByRadiusInput(location: $location, radiusInMeters: $radiusInMeters, objectType: $objectType, limit: $limit, nextToken: $nextToken)";

  @override
  // ignore: avoid_equals_and_hash_code_on_mutable_classes
  bool operator ==(Object other) =>
      other is SearchByRadiusInput &&
      other.runtimeType == runtimeType &&
      location == other.location &&
      radiusInMeters == other.radiusInMeters &&
      objectType == other.objectType &&
      limit == other.limit &&
      nextToken == other.nextToken;

  @override
  // ignore: avoid_equals_and_hash_code_on_mutable_classes
  int get hashCode {
    var result = 17;
    result = 37 * result + location.hashCode;
    result = 37 * result + radiusInMeters.hashCode;
    result = 37 * result + objectType.hashCode;
    result = 37 * result + limit.hashCode;
    result = 37 * result + nextToken.hashCode;
    return result;
  }
}

class SearchByRadiusInput$Change {
  SearchByRadiusInput$Change._(
    this.location,
    this.radiusInMeters,
    this.objectType,
    this.limit,
    this.nextToken,
  );

  Location location;
  double radiusInMeters;
  String objectType;
  int? limit;
  String? nextToken;
}

// ignore: avoid_classes_with_only_static_members
class SearchByRadiusInput$ {
  static final location = Lens<SearchByRadiusInput, Location>(
    (locationContainer) => locationContainer.location,
    (locationContainer, location) =>
        locationContainer.copyWith(location: location),
  );

  static final radiusInMeters = Lens<SearchByRadiusInput, double>(
    (radiusInMetersContainer) => radiusInMetersContainer.radiusInMeters,
    (radiusInMetersContainer, radiusInMeters) =>
        radiusInMetersContainer.copyWith(radiusInMeters: radiusInMeters),
  );

  static final objectType = Lens<SearchByRadiusInput, String>(
    (objectTypeContainer) => objectTypeContainer.objectType,
    (objectTypeContainer, objectType) =>
        objectTypeContainer.copyWith(objectType: objectType),
  );

  static final limit = Lens<SearchByRadiusInput, int?>(
    (limitContainer) => limitContainer.limit,
    (limitContainer, limit) => limitContainer.copyWith(limit: limit),
  );

  static final nextToken = Lens<SearchByRadiusInput, String?>(
    (nextTokenContainer) => nextTokenContainer.nextToken,
    (nextTokenContainer, nextToken) =>
        nextTokenContainer.copyWith(nextToken: nextToken),
  );
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

SearchByRadiusInput _$SearchByRadiusInputFromJson(Map<String, dynamic> json) =>
    SearchByRadiusInput(
      location: Location.fromJson(json['location'] as Map<String, dynamic>),
      radiusInMeters: (json['radiusInMeters'] as num).toDouble(),
      objectType: json['objectType'] as String,
      limit: json['limit'] as int?,
      nextToken: json['nextToken'] as String?,
    );

Map<String, dynamic> _$SearchByRadiusInputToJson(
        SearchByRadiusInput instance) =>
    <String, dynamic>{
      'location': instance.location,
      'radiusInMeters': instance.radiusInMeters,
      'objectType': instance.objectType,
      'limit': instance.limit,
      'nextToken': instance.nextToken,
    };
