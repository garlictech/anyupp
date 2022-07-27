import '/models.dart';
import 'package:flutter/foundation.dart';

@immutable
class RatingPolicy {
  final String key;
  final LocalizedItem? title;
  final LocalizedItem? description;
  final List<RatingPolicyItem>? ratings;
  RatingPolicy({
    required this.key,
    this.title,
    this.description,
    this.ratings,
  });

  RatingPolicy copyWith({
    String? key,
    LocalizedItem? title,
    LocalizedItem? description,
    List<RatingPolicyItem>? ratings,
  }) {
    return RatingPolicy(
      key: key ?? this.key,
      title: title ?? this.title,
      description: description ?? this.description,
      ratings: ratings ?? this.ratings,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'key': key,
      'title': title?.toJson(),
      'description': description?.toJson(),
      'ratings': ratings?.map((x) => x.toMap()).toList(),
    };
  }

  factory RatingPolicy.fromJson(Map<String, dynamic> map) {
    return RatingPolicy(
        title:
            map['title'] != null ? LocalizedItem.fromJson(map['title']) : null,
        description: map['description'] != null
            ? LocalizedItem.fromJson(map['description'])
            : null,
        ratings: map['ratings'] != null &&
                ((map['ratings'] is List &&
                    (map['ratings'] as List).isNotEmpty))
            ? List<RatingPolicyItem>.from(
                map['ratings']?.map((x) => RatingPolicyItem.fromJson(x)))
            : Mock.mockRatingPolicyItems(),
        key: map['key']);
  }

  @override
  String toString() =>
      'RatingPolicy(key: $key, title: $title, description: $description, ratings: $ratings)';

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is RatingPolicy &&
        other.key == key &&
        other.title == title &&
        other.description == description &&
        listEquals(other.ratings, ratings);
  }

  @override
  int get hashCode =>
      title.hashCode ^ description.hashCode ^ ratings.hashCode ^ key.hashCode;
}
