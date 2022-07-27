// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'OpeningHours.dart';

// **************************************************************************
// FunctionalDataGenerator
// **************************************************************************

abstract class $OpeningHours {
  const $OpeningHours();

  double? get to;
  double? get from;
  String get date;
  bool get closed;

  OpeningHours copyWith({
    double? to,
    double? from,
    String? date,
    bool? closed,
  }) =>
      OpeningHours(
        to: to ?? this.to,
        from: from ?? this.from,
        date: date ?? this.date,
        closed: closed ?? this.closed,
      );

  OpeningHours copyUsing(void Function(OpeningHours$Change change) mutator) {
    final change = OpeningHours$Change._(
      this.to,
      this.from,
      this.date,
      this.closed,
    );
    mutator(change);
    return OpeningHours(
      to: change.to,
      from: change.from,
      date: change.date,
      closed: change.closed,
    );
  }

  @override
  String toString() =>
      "OpeningHours(to: $to, from: $from, date: $date, closed: $closed)";

  @override
  // ignore: avoid_equals_and_hash_code_on_mutable_classes
  bool operator ==(Object other) =>
      other is OpeningHours &&
      other.runtimeType == runtimeType &&
      to == other.to &&
      from == other.from &&
      date == other.date &&
      closed == other.closed;

  @override
  // ignore: avoid_equals_and_hash_code_on_mutable_classes
  int get hashCode {
    var result = 17;
    result = 37 * result + to.hashCode;
    result = 37 * result + from.hashCode;
    result = 37 * result + date.hashCode;
    result = 37 * result + closed.hashCode;
    return result;
  }
}

class OpeningHours$Change {
  OpeningHours$Change._(
    this.to,
    this.from,
    this.date,
    this.closed,
  );

  double? to;
  double? from;
  String date;
  bool closed;
}

// ignore: avoid_classes_with_only_static_members
class OpeningHours$ {
  static final to = Lens<OpeningHours, double?>(
    (toContainer) => toContainer.to,
    (toContainer, to) => toContainer.copyWith(to: to),
  );

  static final from = Lens<OpeningHours, double?>(
    (fromContainer) => fromContainer.from,
    (fromContainer, from) => fromContainer.copyWith(from: from),
  );

  static final date = Lens<OpeningHours, String>(
    (dateContainer) => dateContainer.date,
    (dateContainer, date) => dateContainer.copyWith(date: date),
  );

  static final closed = Lens<OpeningHours, bool>(
    (closedContainer) => closedContainer.closed,
    (closedContainer, closed) => closedContainer.copyWith(closed: closed),
  );
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

OpeningHours _$OpeningHoursFromJson(Map<String, dynamic> json) => OpeningHours(
      to: (json['to'] as num?)?.toDouble(),
      from: (json['from'] as num?)?.toDouble(),
      date: json['date'] as String,
      closed: json['closed'] as bool,
    );

Map<String, dynamic> _$OpeningHoursToJson(OpeningHours instance) {
  final val = <String, dynamic>{};

  void writeNotNull(String key, dynamic value) {
    if (value != null) {
      val[key] = value;
    }
  }

  writeNotNull('to', instance.to);
  writeNotNull('from', instance.from);
  val['date'] = instance.date;
  val['closed'] = instance.closed;
  return val;
}
