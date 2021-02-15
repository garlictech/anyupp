import 'dart:async';

import 'package:fa_prev/shared/affiliate.dart';
import 'package:flutter_bloc/flutter_bloc.dart';


class AffiliateBloc extends Bloc<AffiliateEvent, AffiliateState> {
  final AffiliateRepository _repository;

  StreamSubscription _affiniateSubscription;

  Affiliate _affiliate;
  Timer _timer;

  AffiliateBloc(this._repository) : super(NoAffiliateAd());

  @override
  Stream<AffiliateState> mapEventToState(AffiliateEvent event) async* {
    // print('AffiliateBloc.mapEventToState=$event');
    if (event is StartAdvertisement) {
      _startAdvertisement();
    }

    if (event is StopAdvertisement) {
      _stopAdvertisement();
    }

    if (event is ShowNewAdvertisement) {
      yield ShowAdvertisementState(event.ad.product, event.ad.display);
    }
  }

  void _startAdvertisement() {
    _stopAdvertisement();
    print('AffiliateBloc.startAdvertisement()');
    _affiniateSubscription = _repository.getCurrentAffiliateStream().listen((data) {
      _affiliate = data;
      if (_timer != null && _timer.isActive) {
        _timer.cancel();
      }

      // Ad change intervall in seconds. If it's null or <10 then defaults to 10 sec.
      int intervall = data.intervall == null || data.intervall < 10 ? 10 : data.intervall;

      _timer = Timer.periodic(Duration(seconds: intervall), (timer) {
        _generateNewAdvertisement();
      });

      // First time we need to trigger generation manually
      _generateNewAdvertisement();
    });
  }

  void _stopAdvertisement() {
    print('AffiliateBloc.stopAdvertisement()');
    if (_timer != null && _timer.isActive) {
      _timer.cancel();
    }
    if (_affiniateSubscription != null) {
      _affiniateSubscription.cancel();
    }
  }

  Future<void> _generateNewAdvertisement() async {
    if (_affiliate != null) {
      // print('AffiliateBloc._generateNewAdvertisement()=${_affiliate.advertisements.length}');
      Advertisement ad = await AffiliateUtils.getAdvertisementByProfile(_affiliate.advertisements);
      // print('AffiliateBloc._generateNewAdvertisement().ad=${ad.product.name}');
      add(ShowNewAdvertisement(ad));
    }
  }

  @override
  Future<void> close() async {
    _stopAdvertisement();
    return super.close();
  }
}
