import 'dart:convert';

class Place {
  final String table;
  final String seat;

  Place(
    this.table,
    this.seat,
  );

  Map<String, dynamic> toMap() {
    return {
      'table': table,
      'seat': seat,
    };
  }

  factory Place.fromMap(Map<String, dynamic> map) {
    if (map == null) return null;

    return Place(
      map['table'],
      map['seat'],
    );
  }

  String toJson() => json.encode(toMap());

  factory Place.fromJson(String source) {
    if (source == null) return null;

    return Place.fromMap(json.decode(source));
  }

  @override
  String toString() => 'Place(table: $table, seat: $seat)';
}
