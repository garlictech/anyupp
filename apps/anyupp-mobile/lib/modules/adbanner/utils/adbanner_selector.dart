import 'dart:math';

import 'package:fa_prev/models.dart';

final Random RND = Random();

ImageAsset? getRandomBanner({
  List<ImageAsset>? banners,
  int position = -1, // Random
}) {
  if (banners?.isNotEmpty == true) {
    if (position >= banners!.length) {
      return null;
    }
    if (position < 0) {
      return banners[RND.nextInt(banners.length)];
    }
    return banners[position];
  }

  return null;
}
