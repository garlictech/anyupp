import 'package:functional_data/functional_data.dart';
import 'package:json_annotation/json_annotation.dart';
import '/graphql/generated/crud-api.dart';

part 'PaymentMode.g.dart';

@FunctionalData()
@JsonSerializable(explicitToJson: true)
class PaymentMode extends $PaymentMode {
  final String? id;
  final PaymentType type;
  final String? caption;
  final PaymentMethod method;
  final String? geoPaymentModePaymentModesId;

  PaymentMode({
    this.id,
    required this.type,
    this.caption,
    required this.method,
    this.geoPaymentModePaymentModesId,
  });

  factory PaymentMode.fromJson(Map<String, dynamic> json) =>
      _$PaymentModeFromJson(json);

  Map<String, dynamic> toJson() => _$PaymentModeToJson(this);
}
