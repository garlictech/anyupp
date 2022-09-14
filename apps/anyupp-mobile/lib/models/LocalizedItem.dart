import 'package:json_annotation/json_annotation.dart';
import 'package:functional_data/functional_data.dart';

part 'LocalizedItem.g.dart';

@FunctionalData()
@JsonSerializable()
class LocalizedItem extends $LocalizedItem {
  final String? id;
  final String? en;
  final String? de;
  final String? hu;

  LocalizedItem({
    this.id,
    this.en,
    this.de,
    this.hu,
  });

  factory LocalizedItem.fromJson(Map<String, dynamic> json) =>
      _$LocalizedItemFromJson(json);

  Map<String, dynamic> toJson() => _$LocalizedItemToJson(this);
}
