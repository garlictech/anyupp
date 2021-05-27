import 'package:fa_prev/models.dart';
import 'package:flutter/foundation.dart';

import 'core/model_base.dart';


@immutable
class PaymentMode extends Model {
  final String id;
  final String type;
  final String caption;
  final String method;
  final String geoUnitPaymentModesId;

  @override
  String getId() {
    return id;
  }

  const PaymentMode._internal(
      {@required this.id,
      @required this.type,
      this.caption,
      @required this.method,
      this.geoUnitPaymentModesId});

  factory PaymentMode(
      {String id,
      @required String type,
      String caption,
      @required String method,
      String geoUnitPaymentModesId}) {
    return PaymentMode._internal(
        id: id == null ? UUID.getUUID() : id,
        type: type,
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
        type == other.type &&
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
    buffer.write("type=" + "$type" + ", ");
    buffer.write("caption=" + "$caption" + ", ");
    buffer.write("method=" + "$method" + ", ");
    buffer.write("geoUnitPaymentModesId=" + "$geoUnitPaymentModesId");
    buffer.write("}");

    return buffer.toString();
  }

  PaymentMode copyWith(
      {String id,
      String type,
      String caption,
      String method,
      String geoUnitPaymentModesId}) {
    return PaymentMode(
        id: id ?? this.id,
        type: type ?? this.type,
        caption: caption ?? this.caption,
        method: method ?? this.method,
        geoUnitPaymentModesId:
            geoUnitPaymentModesId ?? this.geoUnitPaymentModesId);
  }

  PaymentMode.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        type = json['type'],
        caption = json['caption'],
        method = json['method'],
        geoUnitPaymentModesId = json['geoUnitPaymentModesId'];

  Map<String, dynamic> toJson() => {
        'id': id,
        'type': type,
        'caption': caption,
        'method': method,
        'geoUnitPaymentModesId': geoUnitPaymentModesId
      };
}
