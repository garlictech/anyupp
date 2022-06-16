import 'package:flutter/foundation.dart';

@immutable
class ImageAsset {
  final String imageUrl;
  ImageAsset({
    required this.imageUrl,
  });

  ImageAsset copyWith({
    String? imageUrl,
  }) {
    return ImageAsset(
      imageUrl: imageUrl ?? this.imageUrl,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'imageUrl': imageUrl,
    };
  }

  factory ImageAsset.fromJson(Map<String, dynamic> map) {
    return ImageAsset(
      imageUrl: map['imageUrl'] ?? '',
    );
  }

  @override
  String toString() => 'ImageAsset(imageUrl: $imageUrl)';

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is ImageAsset && other.imageUrl == imageUrl;
  }

  @override
  int get hashCode => imageUrl.hashCode;
}
