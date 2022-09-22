import '/core/core.dart';
import '/graphql/generated/crud-api.graphql.dart';
import '/models.dart';
import '/modules/rating_tipping/rating_tipping.dart';
import '/shared/locale.dart';
import '/shared/nav.dart';
import '/shared/widgets.dart';
import '/shared/widgets/modal_top_widget.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class RatingAndTippingModal extends StatefulWidget {
  final Transaction transaction;
  final TipPolicy? tipPolicy;
  final RatingPolicy? ratingPolicy;
  final double minTip = 175;
  const RatingAndTippingModal({
    Key? key,
    required this.transaction,
    this.tipPolicy,
    this.ratingPolicy,
  }) : super(key: key);

  @override
  _RatingAndTippingModalState createState() => _RatingAndTippingModalState();
}

class _RatingAndTippingModalState extends State<RatingAndTippingModal> {
  int? _rating;
  double? _tip;
  TipType? _tipType;
  bool? _noTip;
  late double _minTip;

  @override
  void initState() {
    super.initState();
    double? minTipAmount = widget.tipPolicy?.minOtherAmount;
    if (minTipAmount != null && minTipAmount > widget.minTip) {
      _minTip = minTipAmount;
    } else {
      _minTip = widget.minTip;
    }
    getIt.get<RatingBloc>().add(ResetRating());
    log.d(
        'RatingAndTippingScreen().init().orderId=${widget.transaction.orderId}');
    log.d('RatingAndTippingScreen().init().tipPolicy=${widget.tipPolicy}');
    log.d(
        'RatingAndTippingScreen().init().ratingPolicy=${widget.ratingPolicy}');
  }

  double? _getCalculatedTip() {
    double? total = widget.transaction.total;
    if (_tipType != null && total != null) {
      if (_tipType == TipType.percent) {
        return total * (_tip! / 100);
      }
      if (_tipType == TipType.amount) {
        return _tip;
      }
    }
    return null;
  }

  bool validateTip() {
    if (_noTip == true) {
      return true;
    }

    double? calculatedTip = _getCalculatedTip();
    if (calculatedTip != null) {
      if (calculatedTip >= _minTip) {
        return true;
      }
    }
    return false;
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(16.0),
          topRight: Radius.circular(16.0),
        ),
        color: theme.secondary0,
      ),
      child: Column(
        // mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          ModalTopWidget(),
          Expanded(
            child: BlocBuilder<RatingBloc, RatingState>(
              builder: (context, state) {
                if (state is RatingSuccess) {
                  return SuccessTipWidget(
                    tipPolicy: widget.tipPolicy != null && _tip != null,
                    ratingPolcicy: widget.ratingPolicy != null,
                  );
                }

                if (state is RatingLoading) {
                  return Container(height: 300, child: CenterLoadingWidget());
                }

                if (state is RatingFailed) {
                  return CommonErrorWidget(
                    error: state.code,
                    description: state.message,
                    showButton: true,
                  );
                }
                if (state is TipFailed) {
                  return Container(
                    child: CommonErrorWidget(
                      error: state.code,
                      description: state.message,
                      showButton: true,
                    ),
                  );
                }

                return Column(
                  children: [
                    Expanded(
                      child: Container(
                        margin: EdgeInsets.symmetric(horizontal: 16),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          // mainAxisSize: MainAxisSize.min,
                          children: [
                            // SizedBox(
                            //   height: kToolbarHeight + 24.0,
                            // ),
                            widget.ratingPolicy != null
                                ? RatingWidget(
                                    ratingPolicy: widget.ratingPolicy!,
                                    onSelected: (rating) {
                                      _rating = rating;
                                    },
                                  )
                                : Container(),
                            SizedBox(
                              height: 70,
                            ),
                            Padding(
                              padding:
                                  const EdgeInsets.symmetric(horizontal: 8.0),
                              child: widget.tipPolicy != null &&
                                      widget.tipPolicy!.isNotEmpty
                                  ? TippingWidget(
                                      tipPolicy: widget.tipPolicy!,
                                      onSelected: (tipType, tip, noTip) {
                                        _tipType = tipType;
                                        _tip = tip;
                                        _noTip = noTip;
                                      },
                                    )
                                  : Container(),
                            ),
                            // Spacer(),
                          ],
                        ),
                      ),
                    ),
                    //  Spacer(),
                    SafeArea(
                      child: Align(
                        alignment: Alignment.bottomCenter,
                        child: BlocBuilder<RatingBloc, RatingState>(
                          builder: (context, state) {
                            bool loading = state is RatingLoading;

                            return Container(
                              height: 56.0,
                              width: double.infinity,
                              margin: EdgeInsets.all(16.0),
                              child: ElevatedButton(
                                onPressed: () => _sendRating(),
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: theme.button,
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(40),
                                  ),
                                ),
                                child: loading
                                    ? CenterLoadingWidget()
                                    : Text(
                                        trans('rating.send'),
                                        style: Fonts.satoshi(
                                          fontSize: 16.0,
                                          fontWeight: FontWeight.w700,
                                          color: theme.buttonText,
                                        ),
                                      ),
                              ),
                            );
                          },
                        ),
                      ),
                    )
                  ],
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  _addInvalidTipEvent() {
    getIt<RatingBloc>().add(InvalidTipAmount(
        trans(
          "tipping.errors.tipFailed",
        ),
        trans("tipping.errors.minAmount", [_minTip])));
  }

  _sendRating() {
    log.d(
        '_sendRating(), rating=$_rating, tipType=$_tipType, tip=$_tip, noTip=$_noTip');
    if (_rating == null && _tipType == null && _tip == null && _noTip != true) {
      // Close screen if nothing to send...
      Nav.pop();
      return;
    }

    // Send both rating and tip
    if (widget.tipPolicy != null &&
        widget.ratingPolicy != null &&
        (_tip != null || _noTip == true)) {
      bool validated = validateTip();
      if (validated) {
        getIt.get<RatingBloc>().add(
              RateAndTipOrder(
                orderId: widget.transaction.orderId,
                rating: OrderRating(
                  key: widget.ratingPolicy!.key,
                  value: _rating ?? -1,
                ),
                tipType: _noTip == true ? TipType.none : TipType.amount,
                tipValue: _noTip == true ? null : _getCalculatedTip(),
              ),
            );
      } else {
        _addInvalidTipEvent();
      }
    } else
    // Send only rating
    if (widget.ratingPolicy != null) {
      getIt.get<RatingBloc>().add(
            RateOrder(
              orderId: widget.transaction.orderId,
              rating: OrderRating(
                key: widget.ratingPolicy!.key,
                value: _rating ?? -1,
              ),
            ),
          );
    } else
    // Send only tip
    if (widget.tipPolicy != null) {
      log.d('RatingAndTippingModal._tip=$_tip');
      if (_tip == null && _noTip != true) {
        Nav.pop();
      } else {
        bool validated = validateTip();
        if (validated) {
          getIt.get<RatingBloc>().add(
                TipOrder(
                  orderId: widget.transaction.orderId,
                  tipType: _noTip == true ? TipType.none : TipType.amount,
                  tipValue: _noTip == true ? null : _getCalculatedTip(),
                ),
              );
        } else {
          _addInvalidTipEvent();
        }
      }
    }
  }
}
