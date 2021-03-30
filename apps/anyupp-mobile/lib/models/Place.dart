import 'package:fa_prev/models.dart';
import 'package:flutter/foundation.dart';

import 'core/model_base.dart';


@immutable
class Place extends Model {
  final String id;
  final String seat;
  final String table;

  @override
  String getId() {
    return id;
  }

  const Place._internal({@required this.id, this.seat, this.table});

  factory Place({String id, String seat, String table}) {
    return Place._internal(
        id: id == null ? UUID.getUUID() : id, seat: seat, table: table);
  }

  bool equals(Object other) {
    return this == other;
  }

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is Place &&
        id == other.id &&
        seat == other.seat &&
        table == other.table;
  }

  @override
  int get hashCode => toString().hashCode;

  @override
  String toString() {
    var buffer = new StringBuffer();

    buffer.write("Place {");
    buffer.write("id=" + "$id" + ", ");
    buffer.write("seat=" + "$seat" + ", ");
    buffer.write("table=" + "$table");
    buffer.write("}");

    return buffer.toString();
  }

  Place copyWith({String id, String seat, String table}) {
    return Place(
        id: id ?? this.id, seat: seat ?? this.seat, table: table ?? this.table);
  }

  Place.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        seat = json['seat'],
        table = json['table'];

  Map<String, dynamic> toJson() => {'id': id, 'seat': seat, 'table': table};
}
