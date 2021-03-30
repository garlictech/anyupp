import 'package:collection/collection.dart';
import 'package:fa_prev/models.dart';
import 'package:flutter/foundation.dart';

import 'core/model_base.dart';


@immutable
class ChainStyleImages extends Model {
  final String id;
  final String header;
  final String logo;

  @override
  String getId() {
    return id;
  }

  const ChainStyleImages._internal({@required this.id, this.header, this.logo});

  factory ChainStyleImages({String id, String header, String logo}) {
    return ChainStyleImages._internal(
        id: id == null ? UUID.getUUID() : id, header: header, logo: logo);
  }

  bool equals(Object other) {
    return this == other;
  }

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is ChainStyleImages &&
        id == other.id &&
        header == other.header &&
        logo == other.logo;
  }

  @override
  int get hashCode => toString().hashCode;

  @override
  String toString() {
    var buffer = StringBuffer();

    buffer.write("ChainStyleImages {");
    buffer.write("id=" + "$id" + ", ");
    buffer.write("header=" + "$header" + ", ");
    buffer.write("logo=" + "$logo");
    buffer.write("}");

    return buffer.toString();
  }

  ChainStyleImages copyWith({String id, String header, String logo}) {
    return ChainStyleImages(
        id: id ?? this.id,
        header: header ?? this.header,
        logo: logo ?? this.logo);
  }

  ChainStyleImages.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        header = json['header'],
        logo = json['logo'];

  Map<String, dynamic> toJson() => {'id': id, 'header': header, 'logo': logo};
}
