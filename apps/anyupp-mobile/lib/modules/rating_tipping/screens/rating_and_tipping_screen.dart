import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/graphql/generated/crud-api.graphql.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/rating_tipping/rating_tipping.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/nav.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class RatingAndTippingScreen extends StatefulWidget {
  final Transaction transaction;
  final TipPolicy? tipPolicy;
  final RatingPolicy? ratingPolicy;
  final double minTip = 175;
  const RatingAndTippingScreen({
    Key? key,
    required this.transaction,
    this.tipPolicy,
    this.ratingPolicy,
  }) : super(key: key);

  @override
  _RatingAndTippingScreenState createState() => _RatingAndTippingScreenState();
}

class _RatingAndTippingScreenState extends State<RatingAndTippingScreen> {
  int? _rating;
  double? _tip;
  TipType? _tipType;
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
    print(
        'RatingAndTippingScreen().init().orderId=${widget.transaction.orderId}');
    print('RatingAndTippingScreen().init().tipPolicy=${widget.tipPolicy}');
    print(
        'RatingAndTippingScreen().init().ratingPolicy=${widget.ratingPolicy}');
  }

  double _getCalculatedTip() {
    return widget.transaction.total! * (_tip! / 100);
  }

  bool validateTip() {
    if (_tip != null && widget.transaction.total != null) {
      if (_tipType != null) {
        if (_tipType == TipType.percent) {
          if (_getCalculatedTip() > _minTip) {
            return true;
          }
        }
        if (_tipType == TipType.amount) {
          if (_tip! >= _minTip) {
            return true;
          }
        }
      }
    }
    return false;
  }

  @override
  Widget build(BuildContext context) {
    bool center = (widget.tipPolicy == null || widget.tipPolicy!.isEmpty) ||
        widget.ratingPolicy == null;
    return Scaffold(
      backgroundColor: theme.secondary0,
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        elevation: 0.0,
        backgroundColor: theme.secondary0,
        leading: BackButtonWidget(
          showBorder: false,
          color: theme.secondary,
        ),
      ),
      body: BlocBuilder<RatingBloc, RatingState>(
        builder: (context, state) {
          if (state is RatingSuccess) {
            return SuccessTipWidget(
              tipPolicy: widget.tipPolicy != null,
              ratingPolcicy: widget.ratingPolicy != null,
            );
          }

          if (state is RatingLoading) {
            return CenterLoadingWidget();
          }

          if (state is RatingFailed) {
            return CommonErrorWidget(
              error: state.code,
              description: state.message,
              showButton: true,
            );
          }
          if (state is TipFailed) {
            return CommonErrorWidget(
              error: state.code,
              description: state.message,
              showButton: true,
            );
          }

          return Stack(
            children: [
              Align(
                alignment: center ? Alignment.center : Alignment.topCenter,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    SizedBox(
                      height: kToolbarHeight + 24.0,
                    ),
                    Padding(
                      padding: const EdgeInsets.only(
                        left: 16,
                        right: 16,
                        bottom: 80,
                      ),
                      child: widget.ratingPolicy != null
                          ? RatingWidget(
                              ratingPolicy: widget.ratingPolicy!,
                              onSelected: (rating) {
                                _rating = rating;
                              },
                            )
                          : Container(),
                    ),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 8.0),
                      child: widget.tipPolicy != null &&
                              widget.tipPolicy!.isNotEmpty
                          ? TippingWidget(
                              tipPolicy: widget.tipPolicy!,
                              onSelected: (tipType, tip) {
                                _tipType = tipType;
                                _tip = tip;
                              },
                            )
                          : Container(),
                    ),
                    // Spacer(),
                  ],
                ),
              ),
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
                            primary: theme.button,
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
    print('_sendRating(), rating=$_rating, tipType=$_tipType, tip=$_tip');
    if (_rating == null && _tipType == null && _tip == null) {
      // Close screen if nothing to send...
      Nav.pop();
      return;
    }

    // Send both rating and tip
    if (widget.tipPolicy != null && widget.ratingPolicy != null) {
      bool validated = validateTip();
      if (validated) {
        getIt.get<RatingBloc>().add(
              RateAndTipOrder(
                orderId: widget.transaction.orderId,
                rating: OrderRating(
                  key: widget.ratingPolicy!.key,
                  value: _rating ?? -1,
                ),
                tipType: _tipType,
                tipValue: _tip,
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
      bool validated = validateTip();
      if (validated) {
        getIt.get<RatingBloc>().add(
              TipOrder(
                orderId: widget.transaction.orderId,
                tipType: _tipType,
                tipValue: _tip,
              ),
            );
      } else {
        _addInvalidTipEvent();
      }
    }
  }
}
