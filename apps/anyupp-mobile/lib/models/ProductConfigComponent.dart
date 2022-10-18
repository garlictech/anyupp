import 'package:functional_data/functional_data.dart';
import 'package:json_annotation/json_annotation.dart';

part 'ProductConfigComponent.g.dart';

@FunctionalData()
@JsonSerializable(explicitToJson: true)
class ProductConfigComponent extends $ProductConfigComponent {
  final String productComponentId;
  final double price;
  final int position;
  final double? netPackagingFee;
  final bool? soldOut;

  ProductConfigComponent({
    required this.productComponentId,
    required this.price,
    required this.position,
    this.netPackagingFee,
    this.soldOut = false,
  });

  factory ProductConfigComponent.fromJson(Map<String, dynamic> json) => 
      _$ProductConfigComponentFromJson(json);

  Map<String, dynamic> toJson() => _$ProductConfigComponentToJson(this);
}
