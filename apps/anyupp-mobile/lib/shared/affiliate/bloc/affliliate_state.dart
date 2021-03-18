import 'package:equatable/equatable.dart';

import 'package:fa_prev/shared/affiliate.dart';

abstract class AffiliateState extends Equatable {

  const AffiliateState();

  @override
  List<Object> get props => [];
}

class NoAffiliateAd extends AffiliateState {}

class ShowAdvertisementState extends AffiliateState {

  final AdProduct product;
  final AdDisplay display;

  const ShowAdvertisementState(this.product, this.display);

  @override
  List<Object> get props => [product, display];
}
