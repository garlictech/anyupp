import 'dart:math';
import 'package:fa_prev/shared/face.dart';

import 'package:fa_prev/shared/affiliate.dart';

class AffiliateUtils {
  static Random _random = Random();

  static Future<Advertisement> getAdvertisementByProfile(List<Advertisement> ads) async {
    String gender = await FacePreferences.getGender();
    String age = await FacePreferences.getAge();
    // print('**** getAdvertisementByProfile().gender=$gender, age=$age');
    return getAdvertisement(ads, gender, age);
  }

  static Future<Advertisement> getAdvertisement(List<Advertisement> ads, String gender, String age) async {
    if (ads == null) {
      return null;
    }

    List<Advertisement> matchedAds = [];
    for (int i = 0; i < ads.length; i++) {
      Advertisement ad = ads[i];
      if (_matchTag(ad.tags, 'gender', gender) && _matchTag(ad.tags, 'age', age)) {
        matchedAds.add(ad);
      }
    }

    if (matchedAds.length == 0) {
      // TODO mi legyen akkor, ha nincs reklám? Most random visszaadunkvalamit
      int index = _random.nextInt(ads.length);
      return ads[index];
    }

    int index = _random.nextInt(matchedAds.length);
    Advertisement ad = matchedAds[index];
    // print('Advertisement[gender=$gender, age=$age]=$ad');
    return ad;
  }

  static bool _matchTag(List<AdTag> tags, String attribute, String value) {
    // print('_matchTag=$value with $attribute=$value');
    if (tags == null || tags.length == 0 || value == null || attribute == null) {
      return true;
    }

    for (int i = 0; i < tags.length; i++) {
      AdTag tag = tags[i];
      if (tag.match != null) {
        List<String> matches = tag.match.split(',');
        if (tag.attribute == attribute && matches.contains(value)) {
          return true;
        }
      }
    }

    return false;
  }
}
