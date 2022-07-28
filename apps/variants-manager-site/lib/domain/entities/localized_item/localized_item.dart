import 'package:functional_data/functional_data.dart';
import 'package:json_annotation/json_annotation.dart';

part 'localized_item.g.dart';

@FunctionalData()
@JsonSerializable()
class LocalizedItem extends $LocalizedItem {
  @override
  final String? en;
  @override
  final String? hu;
  @override
  final String? de;

  LocalizedItem({this.en, this.hu, this.de});

  factory LocalizedItem.fromJson(Map<String, dynamic> json) =>
      _$LocalizedItemFromJson(json);

  Map<String, dynamic> toJson() => _$LocalizedItemToJson(this);
}
