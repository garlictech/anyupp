import '/models.dart';
import '/graphql/generated/crud-api.dart';

class Mock {
  static final bool _enabled = false;

  // Hidden/Private constructor
  Mock._();

  static List<RatingPolicyItem> mockRatingPolicyItems() {
    return [
      RatingPolicyItem(
          value: 1,
          text: LocalizedItem(
            hu: 'Rossz',
            en: 'Rossz',
          ),
          icon: 'rating-1.png'),
      RatingPolicyItem(
          value: 2,
          text: LocalizedItem(
            hu: 'Elmegy',
            en: 'Elmegy',
          ),
          icon: 'rating-2.png'),
      RatingPolicyItem(
          value: 3,
          text: LocalizedItem(
            hu: 'Megfelelő',
            en: 'Megfelelő',
          ),
          icon: 'rating-3.png'),
      RatingPolicyItem(
          value: 4,
          text: LocalizedItem(
            hu: 'Jó',
            en: 'Jó',
          ),
          icon: 'rating-4.png'),
      RatingPolicyItem(
          value: 5,
          text: LocalizedItem(
            hu: 'Csodás',
            en: 'Csodás',
          ),
          icon: 'rating-5.png'),
    ];
  }

  static RatingPolicy? mockRatingPolicy() {
    return _enabled
        ? RatingPolicy(
            key: '',
            title: LocalizedItem(
              hu: 'Hogy sikerült a rendelésed?',
              en: 'Hogy sikerült a rendelésed?',
              de: 'Hogy sikerült a rendelésed?',
            ),
            ratings: mockRatingPolicyItems(),
          )
        : null;
  }

  static TipPolicy? mockTipPolicy() {
    return _enabled
        ? TipPolicy(
            title: LocalizedItem(
              hu: 'Szeretnél borravalót adni?',
              en: 'Szeretnél borravalót adni?',
            ),
            description: LocalizedItem(
              hu: 'A borravaló 100%-t munkatársaink kapják.',
              en: 'A borravaló 100%-t munkatársaink kapják.',
            ),
            percents: [5.0, 10.0, 15.0],
            minOtherAmount: 0,
          )
        : null;
  }

  static ServiceFeePolicy? mockServiceFeePolicy() {
    return _enabled
        ? ServiceFeePolicy(type: ServiceFeeType.included, percentage: 5.0)
        : null;
  }

  static OrderPolicy mockOrderPolicy() {
    return OrderPolicy.full;
  }
}
