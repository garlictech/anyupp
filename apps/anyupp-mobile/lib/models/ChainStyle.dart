import '/models.dart';

import 'package:flutter/foundation.dart';

@immutable
class ChainStyle {
  final String? id;
  final ChainStyleColors colors;
  final ChainStyleImages? images;
  ChainStyle({
    this.id,
    required this.colors,
    this.images,
  });

  ChainStyle copyWith({
    String? id,
    ChainStyleColors? colors,
    ChainStyleImages? images,
  }) {
    return ChainStyle(
      id: id ?? this.id,
      colors: colors ?? this.colors,
      images: images ?? this.images,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'colors': colors.toJson(),
      'images': images?.toJson(),
    };
  }

  factory ChainStyle.fromJson(Map<String, dynamic> map) {
    return ChainStyle(
      id: map['id'],
      colors: ChainStyleColors.fromJson(map['colors']),
      images: map['images'] != null ? ChainStyleImages.fromJson(map['images']) : null,
    );
  }

  @override
  String toString() => 'ChainStyle(id: $id, colors: $colors, images: $images)';

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is ChainStyle && other.id == id && other.colors == colors && other.images == images;
  }

  @override
  int get hashCode => id.hashCode ^ colors.hashCode ^ images.hashCode;
}
