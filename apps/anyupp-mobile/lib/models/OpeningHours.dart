import 'dart:convert';

import 'package:intl/intl.dart';

class OpeningHours {
  final double to;
  final double from;
  final String date;
  final bool closed;
  DateFormat dateFormat = DateFormat('yyyy-MM-dd');
  DateFormat hourFormat = DateFormat('HH:mm');

  OpeningHours({
    this.to,
    this.from,
    this.date,
    this.closed,
  });

  OpeningHours copyWith({
    double to,
    double from,
    String date,
    bool closed,
  }) {
    return OpeningHours(
      to: to ?? this.to,
      from: from ?? this.from,
      date: date ?? this.date,
      closed: closed ?? this.closed,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'to': to,
      'from': from,
      'date': date,
      'closed': closed,
    };
  }

  factory OpeningHours.fromMap(Map<String, dynamic> map) {
    return OpeningHours(
      to: map['to'],
      from: map['from'],
      date: map['date'],
      closed: map['closed'],
    );
  }

  String getHourFormattedString(int timeStamp) {
    return hourFormat
        .format(DateTime.fromMillisecondsSinceEpoch(timeStamp))
        .toString();
  }

  String getRangeString() {
    return getHourFormattedString(from.toInt()) +
        " - " +
        getHourFormattedString(to.toInt());
  }

  DateTime getDate() {
    return dateFormat.parse(date);
  }

  String toJson() => json.encode(toMap());

  factory OpeningHours.fromJson(String source) =>
      OpeningHours.fromMap(json.decode(source));

  @override
  String toString() {
    return 'OpeningHoursNext7(to: $to, from: $from, date: $date, closed: $closed)';
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
