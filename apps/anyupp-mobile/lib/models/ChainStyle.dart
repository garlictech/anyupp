import 'package:fa_prev/models.dart';
import 'package:flutter/foundation.dart';

import 'core/model_base.dart';


@immutable
class ChainStyle extends Model {
  final String id;
  final ChainStyleColors colors;
  final ChainStyleImages images;

  @override
  String getId() {
    return id;
  }

  const ChainStyle._internal({@required this.id, this.colors, this.images});

  factory ChainStyle(
      {String id, ChainStyleColors colors, ChainStyleImages images}) {
    return ChainStyle._internal(
        id: id == null ? UUID.getUUID() : id, colors: colors, images: images);
  }

  bool equals(Object other) {
    return this == other;
  }

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is ChainStyle &&
        id == other.id &&
        colors == other.colors &&
        images == other.images;
  }

  @override
  int get hashCode => toString().hashCode;

  @override
  String toString() {
    var buffer = StringBuffer();

    buffer.write("ChainStyle {");
    buffer.write("id=" + "$id" + ", ");
    buffer.write(
        "colors=" + (colors != null ? colors.toString() : "null") + ", ");
    buffer.write("images=" + (images != null ? images.toString() : "null"));
    buffer.write("}");

    return buffer.toString();
  }

  ChainStyle copyWith(
      {String id, ChainStyleColors colors, ChainStyleImages images}) {
    return ChainStyle(
        id: id ?? this.id,
        colors: colors ?? this.colors,
        images: images ?? this.images);
  }

  ChainStyle.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        colors = json['colors'] != null
            ? ChainStyleColors.fromJson(
                Map<String, dynamic>.from(json['colors']))
            : null,
        images = json['images'] != null
            ? ChainStyleImages.fromJson(
                Map<String, dynamic>.from(json['images']))
            : null;

  Map<String, dynamic> toJson() =>
      {'id': id, 'colors': colors?.toJson(), 'images': images?.toJson()};
}
