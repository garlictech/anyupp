import 'package:functional_data/functional_data.dart';
import 'package:json_annotation/json_annotation.dart';

import 'location.dart';

part 'search-by-radius-input.g.dart';

@FunctionalData()
@JsonSerializable()
class SearchByRadiusInput extends $SearchByRadiusInput {
  @override
  final Location location;
  @override
  final double radiusInMeters;
  @override
  final String objectType;
  @override
  final int? limit;
  @override
  final String? nextToken;

  SearchByRadiusInput(
      {required this.location,
      required this.radiusInMeters,
      required this.objectType,
      this.limit,
      this.nextToken});

  factory SearchByRadiusInput.fromJson(Map<String, dynamic> json) =>
      _$SearchByRadiusInputFromJson(json);

  Map<String, dynamic> toJson() => _$SearchByRadiusInputToJson(this);
}
