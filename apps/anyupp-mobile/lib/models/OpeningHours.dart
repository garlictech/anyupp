import 'package:fa_prev/models.dart';
import 'package:flutter/foundation.dart';

@immutable
class OpeningHours {
  final double? to;
  final double? from;
  final String date;
  final bool closed;

  OpeningHours({
    this.to,
    this.from,
    required this.date,
    required this.closed,
  });

  OpeningHours copyWith({
    double? to,
    double? from,
    String? date,
    bool? closed,
  }) {
    return OpeningHours(
      to: to ?? this.to,
      from: from ?? this.from,
      date: date ?? this.date,
      closed: closed ?? this.closed,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'to': to,
      'from': from,
      'date': date,
      'closed': closed,
    };
  }

  factory OpeningHours.fromJson(Map<String, dynamic> map) {
    return OpeningHours(
      to: map['to'],
      from: map['from'],
      date: map['date'],
      closed: map['closed'],
    );
  }

  @override
  String toString() {
    return 'OpeningHours(date: $date, from: ${_getDateString(from)}, to: ${_getDateString(to)}, closed: $closed)';
  }

  String _getDateString(double? ms) {
    return ms != null
        ? ohHourFormat.format(DateTime.fromMillisecondsSinceEpoch(to!.toInt()))
        : ms?.toString() ?? '-';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is OpeningHours &&
        other.to == to &&
        other.from == from &&
        other.date == date &&
        other.closed == closed;
  }

  @override
  int get hashCode {
    return to.hashCode ^ from.hashCode ^ date.hashCode ^ closed.hashCode;
  }
}
