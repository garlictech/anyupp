import 'package:fa_prev/models.dart';
import 'package:flutter/foundation.dart';

@immutable
class RatingPolicy {
  final LocalizedItem? title;
  final LocalizedItem? description;
  final List<RatingPolicyItem> ratings;
  RatingPolicy({
    this.title,
    this.description,
    required this.ratings,
  });

  RatingPolicy copyWith({
    LocalizedItem? title,
    LocalizedItem? description,
    List<RatingPolicyItem>? ratings,
  }) {
    return RatingPolicy(
      title: title ?? this.title,
      description: description ?? this.description,
      ratings: ratings ?? this.ratings,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'title': title?.toJson(),
      'description': description?.toJson(),
      'ratings': ratings.map((x) => x.toMap()).toList(),
    };
  }

  factory RatingPolicy.fromJson(Map<String, dynamic> map) {
    return RatingPolicy(
      title: map['title'] != null ? LocalizedItem.fromJson(map['title']) : null,
      description: map['description'] != null
          ? LocalizedItem.fromJson(map['description'])
          : null,
      ratings: List<RatingPolicyItem>.from(
          map['ratings']?.map((x) => RatingPolicyItem.fromJson(x))),
    );
  }

  @override
  String toString() =>
      'RatingPolicy(title: $title, description: $description, ratings: $ratings)';

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is RatingPolicy &&
        other.title == title &&
        other.description == description &&
        listEquals(other.ratings, ratings);
  }

  @override
  int get hashCode => title.hashCode ^ description.hashCode ^ ratings.hashCode;
}
