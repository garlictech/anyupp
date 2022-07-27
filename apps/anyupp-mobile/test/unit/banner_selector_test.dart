import '/models.dart';
import '/modules/adbanner/adbanner.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  List<ImageAsset> _generateBanners(int count) {
    List<ImageAsset> banners = [];
    for (int i = 0; i < count; i++) {
      banners.add(ImageAsset(
        imageUrl: 'https://picsum.photos/100/100?random=$i',
      ));
    }
    return banners;
  }

  group('Banner selector test', () {
    test('Test banners where banners.length >= productCategories.length',
        () async {
      var banners = _generateBanners(3);
      expect(getRandomBanner(banners: banners, position: 0), isNotNull);
      expect(getRandomBanner(banners: banners, position: 1), isNotNull);
      expect(getRandomBanner(banners: banners, position: 2), isNotNull);
      expect(getRandomBanner(banners: banners, position: -1), isNotNull);
      expect(getRandomBanner(banners: banners, position: 3), isNull);
      expect(getRandomBanner(banners: banners, position: 4), isNull);
    });

    test('Test banners where banners.length < productCategories.length',
        () async {
      var banners = _generateBanners(2);
      expect(getRandomBanner(banners: banners, position: 0), isNotNull);
      expect(getRandomBanner(banners: banners, position: 1), isNotNull);
      expect(getRandomBanner(banners: banners, position: 2), isNull);
      expect(getRandomBanner(banners: banners, position: 3), isNull);
      expect(getRandomBanner(banners: banners, position: -1), isNotNull);
    });

    test('Test banners where banners.length = 0', () async {
      var banners = _generateBanners(0);
      expect(getRandomBanner(banners: banners, position: 0), isNull);
      expect(getRandomBanner(banners: banners, position: 1), isNull);
    });

    test('Test banners where banners is null', () async {
      expect(getRandomBanner(banners: null, position: -1), isNull);
      expect(getRandomBanner(banners: null, position: 0), isNull);
      expect(getRandomBanner(banners: null, position: 1), isNull);
    });
  });
}
