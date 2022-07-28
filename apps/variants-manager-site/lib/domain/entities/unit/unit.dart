import 'package:functional_data/functional_data.dart';
import 'package:json_annotation/json_annotation.dart';

part 'unit.g.dart';

@FunctionalData()
@JsonSerializable()
class Unit extends $Unit {
  @override
  final String id;
  @override
  final String name;

  Unit({
    required this.id,
    required this.name,
  });

  factory Unit.fromJson(Map<String, dynamic> json) => _$UnitFromJson(json);

  Map<String, dynamic> toJson() => _$UnitToJson(this);
}
