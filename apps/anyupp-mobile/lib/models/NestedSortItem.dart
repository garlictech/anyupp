import 'package:functional_data/functional_data.dart';
import 'package:json_annotation/json_annotation.dart';

part 'NestedSortItem.g.dart';

@FunctionalData()
@JsonSerializable(explicitToJson: true)
class NestedSortItem extends $NestedSortItem {
  final String id;
  final String? parentId;

  NestedSortItem({
    required this.id,
    this.parentId,
  });

  factory NestedSortItem.fromJson(Map<String, dynamic> json) =>
      _$NestedSortItemFromJson(json);

  Map<String, dynamic> toJson() => _$NestedSortItemToJson(this);
}
