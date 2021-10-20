import 'package:flutter/foundation.dart';

@immutable
class Place {
  final String? id;
  final String? seat;
  final String? table;

  Place({
    this.id,
    this.seat,
    this.table,
  });

  Place copyWith({
    String? id,
    String? seat,
    String? table,
  }) {
    return Place(
      id: id ?? this.id,
      seat: seat ?? this.seat,
      table: table ?? this.table,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'seat': seat,
      'table': table,
    };
  }

  factory Place.fromJson(Map<String, dynamic> map) {
    return Place(
      id: map['id'],
      seat: map['seat'],
      table: map['table'],
    );
  }

  @override
  String toString() => 'Place(id: $id, seat: $seat, table: $table)';

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is Place && other.id == id && other.seat == seat && other.table == table;
  }

  @override
  int get hashCode => id.hashCode ^ seat.hashCode ^ table.hashCode;
}
