// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'PaymentMode.dart';

// **************************************************************************
// FunctionalDataGenerator
// **************************************************************************

abstract class $PaymentMode {
  const $PaymentMode();

  String? get id;
  PaymentType get type;
  String? get caption;
  PaymentMethod get method;
  String? get geoPaymentModePaymentModesId;

  PaymentMode copyWith({
    String? id,
    PaymentType? type,
    String? caption,
    PaymentMethod? method,
    String? geoPaymentModePaymentModesId,
  }) =>
      PaymentMode(
        id: id ?? this.id,
        type: type ?? this.type,
        caption: caption ?? this.caption,
        method: method ?? this.method,
        geoPaymentModePaymentModesId:
            geoPaymentModePaymentModesId ?? this.geoPaymentModePaymentModesId,
      );

  PaymentMode copyUsing(void Function(PaymentMode$Change change) mutator) {
    final change = PaymentMode$Change._(
      this.id,
      this.type,
      this.caption,
      this.method,
      this.geoPaymentModePaymentModesId,
    );
    mutator(change);
    return PaymentMode(
      id: change.id,
      type: change.type,
      caption: change.caption,
      method: change.method,
      geoPaymentModePaymentModesId: change.geoPaymentModePaymentModesId,
    );
  }

  @override
  String toString() =>
      "PaymentMode(id: $id, type: $type, caption: $caption, method: $method, geoPaymentModePaymentModesId: $geoPaymentModePaymentModesId)";

  @override
  // ignore: avoid_equals_and_hash_code_on_mutable_classes
  bool operator ==(Object other) =>
      other is PaymentMode &&
      other.runtimeType == runtimeType &&
      id == other.id &&
      type == other.type &&
      caption == other.caption &&
      method == other.method &&
      geoPaymentModePaymentModesId == other.geoPaymentModePaymentModesId;

  @override
  // ignore: avoid_equals_and_hash_code_on_mutable_classes
  int get hashCode {
    var result = 17;
    result = 37 * result + id.hashCode;
    result = 37 * result + type.hashCode;
    result = 37 * result + caption.hashCode;
    result = 37 * result + method.hashCode;
    result = 37 * result + geoPaymentModePaymentModesId.hashCode;
    return result;
  }
}

class PaymentMode$Change {
  PaymentMode$Change._(
    this.id,
    this.type,
    this.caption,
    this.method,
    this.geoPaymentModePaymentModesId,
  );

  String? id;
  PaymentType type;
  String? caption;
  PaymentMethod method;
  String? geoPaymentModePaymentModesId;
}

// ignore: avoid_classes_with_only_static_members
class PaymentMode$ {
  static final id = Lens<PaymentMode, String?>(
    (idContainer) => idContainer.id,
    (idContainer, id) => idContainer.copyWith(id: id),
  );

  static final type = Lens<PaymentMode, PaymentType>(
    (typeContainer) => typeContainer.type,
    (typeContainer, type) => typeContainer.copyWith(type: type),
  );

  static final caption = Lens<PaymentMode, String?>(
    (captionContainer) => captionContainer.caption,
    (captionContainer, caption) => captionContainer.copyWith(caption: caption),
  );

  static final method = Lens<PaymentMode, PaymentMethod>(
    (methodContainer) => methodContainer.method,
    (methodContainer, method) => methodContainer.copyWith(method: method),
  );

  static final geoPaymentModePaymentModesId = Lens<PaymentMode, String?>(
    (geoPaymentModePaymentModesIdContainer) =>
        geoPaymentModePaymentModesIdContainer.geoPaymentModePaymentModesId,
    (geoPaymentModePaymentModesIdContainer, geoPaymentModePaymentModesId) =>
        geoPaymentModePaymentModesIdContainer.copyWith(
            geoPaymentModePaymentModesId: geoPaymentModePaymentModesId),
  );
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

PaymentMode _$PaymentModeFromJson(Map<String, dynamic> json) => PaymentMode(
      id: json['id'] as String?,
      type: json['type'],
      caption: json['caption'] as String?,
      method: json['method'],
      geoPaymentModePaymentModesId:
          json['geoPaymentModePaymentModesId'] as String?,
    );

Map<String, dynamic> _$PaymentModeToJson(PaymentMode instance) {
  final val = <String, dynamic>{};

  void writeNotNull(String key, dynamic value) {
    if (value != null) {
      val[key] = value;
    }
  }

  writeNotNull('id', instance.id);
  writeNotNull('type', instance.type);
  writeNotNull('caption', instance.caption);
  writeNotNull('method', instance.method);
  writeNotNull(
      'geoPaymentModePaymentModesId', instance.geoPaymentModePaymentModesId);
  return val;
}
