import 'package:functional_data/functional_data.dart';
import 'package:json_annotation/json_annotation.dart';

part "OpeningHours.g.dart";

@FunctionalData()
@JsonSerializable()
class OpeningHours extends $OpeningHours {
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

  factory OpeningHours.fromJson(Map<String, dynamic> json) =>
      _$OpeningHoursFromJson(json);

  Map<String, dynamic> toJson() => _$OpeningHoursToJson(this);
}
