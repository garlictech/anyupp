import 'package:equatable/equatable.dart';

import 'package:fa_prev/shared/affiliate.dart';

abstract class AffiliateEvent extends Equatable {

  const AffiliateEvent();

  @override
  List<Object> get props => [];
}

class StartAdvertisement extends AffiliateEvent {

}

class StopAdvertisement extends AffiliateEvent {

}

class ShowNewAdvertisement extends AffiliateEvent {
   final Advertisement ad;

  const ShowNewAdvertisement(this.ad);

  @override
  List<Object> get props => [ad];
}
