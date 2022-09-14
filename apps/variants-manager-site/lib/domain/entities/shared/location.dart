import 'package:functional_data/functional_data.dart';
import 'package:json_annotation/json_annotation.dart';

part 'location.g.dart';

@FunctionalData()
@JsonSerializable()
class Location extends $Location {
  @override
  final double lat;
  @override
  final double lon;

  const Location({
    required this.lat,
    required this.lon,
  });

  factory Location.fromJson(Map<String, dynamic> json) =>
      _$LocationFromJson(json);

  Map<String, dynamic> toJson() => _$LocationToJson(this);
}
