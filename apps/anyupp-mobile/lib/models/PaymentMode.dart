import 'package:fa_prev/models.dart';
import 'package:flutter/foundation.dart';

import 'core/model_base.dart';


@immutable
class PaymentMode extends Model {
  final String id;
  final String name;
  final String caption;
  final String method;
  final String geoUnitPaymentModesId;

  @override
  String getId() {
    return id;
  }

  const PaymentMode._internal(
      {@required this.id,
      @required this.name,
      this.caption,
      @required this.method,
      this.geoUnitPaymentModesId});

  factory PaymentMode(
      {String id,
      @required String name,
      String caption,
      @required String method,
      String geoUnitPaymentModesId}) {
    return PaymentMode._internal(
        id: id == null ? UUID.getUUID() : id,
        name: name,
        caption: caption,
        method: method,
        geoUnitPaymentModesId: geoUnitPaymentModesId);
  }

  bool equals(Object other) {
    return this == other;
  }

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is PaymentMode &&
        id == other.id &&
        name == other.name &&
        caption == other.caption &&
        method == other.method &&
        geoUnitPaymentModesId == other.geoUnitPaymentModesId;
  }

  @override
  int get hashCode => toString().hashCode;

  @override
  String toString() {
    var buffer = StringBuffer();

    buffer.write("PaymentMode {");
    buffer.write("id=" + "$id" + ", ");
    buffer.write("name=" + "$name" + ", ");
    buffer.write("caption=" + "$caption" + ", ");
    buffer.write("method=" + "$method" + ", ");
    buffer.write("geoUnitPaymentModesId=" + "$geoUnitPaymentModesId");
    buffer.write("}");

    return buffer.toString();
  }

  PaymentMode copyWith(
      {String id,
      String name,
      String caption,
      String method,
      String geoUnitPaymentModesId}) {
    return PaymentMode(
        id: id ?? this.id,
        name: name ?? this.name,
        caption: caption ?? this.caption,
        method: method ?? this.method,
        geoUnitPaymentModesId:
            geoUnitPaymentModesId ?? this.geoUnitPaymentModesId);
  }

  PaymentMode.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        name = json['name'],
        caption = json['caption'],
        method = json['method'],
        geoUnitPaymentModesId = json['geoUnitPaymentModesId'];

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'caption': caption,
        'method': method,
        'geoUnitPaymentModesId': geoUnitPaymentModesId
      };
}
