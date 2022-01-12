import 'package:fa_prev/models.dart';
import 'package:flutter/foundation.dart';

@immutable
class TipPolicy {
  final LocalizedItem? title;
  final LocalizedItem? description;
  final List<double> percents;
  final double? maxOtherAmount;
  TipPolicy({
    this.title,
    this.description,
    required this.percents,
    this.maxOtherAmount,
  });

  TipPolicy copyWith({
    LocalizedItem? title,
    LocalizedItem? description,
    List<double>? percents,
    double? maxOtherAmount,
  }) {
    return TipPolicy(
      title: title ?? this.title,
      description: description ?? this.description,
      percents: percents ?? this.percents,
      maxOtherAmount: maxOtherAmount ?? this.maxOtherAmount,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'title': title?.toJson(),
      'description': description?.toJson(),
      'percents': percents,
      'maxOtherAmount': maxOtherAmount,
    };
  }

  factory TipPolicy.fromJson(Map<String, dynamic> map) {
    return TipPolicy(
      title: map['title'] != null ? LocalizedItem.fromJson(map['title']) : null,
      description: map['description'] != null
          ? LocalizedItem.fromJson(map['description'])
          : null,
      percents: List<double>.from(map['percents']),
      maxOtherAmount: map['maxOtherAmount']?.toDouble() ?? 0.0,
    );
  }

  @override
  String toString() {
    return 'TipPolicy(title: $title, description: $description, percents: $percents, maxOtherAmount: $maxOtherAmount)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is TipPolicy &&
        other.title == title &&
        other.description == description &&
        listEquals(other.percents, percents) &&
        other.maxOtherAmount == maxOtherAmount;
  }

  @override
  int get hashCode {
    return title.hashCode ^
        description.hashCode ^
        percents.hashCode ^
        maxOtherAmount.hashCode;
  }
}
