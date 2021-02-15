import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:intl/intl.dart';
import 'package:fa_prev/shared/locale.dart';

import 'package:fa_prev/modules/orders/orders.dart';
class OrderStateCard extends StatefulWidget {
  // Contains all your order states
  final Item orderState;

  // Flag for determining whether this card will be placed left or right
  final bool isLeft;

  // Height and width fields which are describing actual card’s dimensions.
  static const double height = 80.0;
  static const double width = 155.0;

  // The constructor
  const OrderStateCard(
      {Key key, @required this.orderState, @required this.isLeft})
      : super(key: key);

  @override
  OrderStateCardState createState() => OrderStateCardState();
}

class OrderStateCardState extends State<OrderStateCard>
    with TickerProviderStateMixin {
  // We created an animation for each text we want to display
  AnimationController _animationController;
  Animation<double> _cardSizeAnimation;
  Animation<double> _datePositionAnimation;
  Animation<double> _statePositionAnimation;
  Animation<double> _fromToPositionAnimation;
  Animation<double> _lineAnimation;

  DateFormat _dateFormat = DateFormat('yyyy-MM-dd hh:mm');

  @override
  void initState() {
    super.initState();

    // Every animation has slightly different interval values so that they create a feeling of being independent of each other
    // Also, we pass the parameter to ElasticOutCurve which is the actual curve of texts’ animations
    // We do it to decrease the bouncing effect
    _animationController = new AnimationController(
        vsync: this, duration: Duration(milliseconds: 600));
    _cardSizeAnimation = new CurvedAnimation(
        parent: _animationController,
        curve: new Interval(0.0, 0.9, curve: new ElasticOutCurve(0.8)));
    _datePositionAnimation = new CurvedAnimation(
        parent: _animationController,
        curve: new Interval(0.05, 0.95, curve: new ElasticOutCurve(0.95)));
    _statePositionAnimation = new CurvedAnimation(
        parent: _animationController,
        curve: new Interval(0.0, 0.9, curve: new ElasticOutCurve(0.95)));
    _fromToPositionAnimation = new CurvedAnimation(
        parent: _animationController,
        curve: new Interval(0.1, 0.95, curve: new ElasticOutCurve(0.95)));
    _lineAnimation = new CurvedAnimation(
        parent: _animationController,
        curve: new Interval(0.0, 0.2, curve: Curves.linear));
    runAnimation();
  }

  // So that parent can decide when the card should be animated
  void runAnimation() {
    _animationController.forward();
  }

  // The main build method which is responsible for rendering the view
  @override
  Widget build(BuildContext context) {
    return Container(
      height: OrderStateCard.height,
      child: AnimatedBuilder(
        animation: _animationController,
        builder: (context, child) => new Stack(
          alignment: Alignment.centerLeft,
          children: <Widget>[
            buildLine(),
            buildCard(),
            buildQuantityText(),
            buildStateText(),
            buildFromToTimeText(),
          ],
        ),
      ),
    );
  }

  double get maxWidth {
    RenderBox renderBox = context.findRenderObject();
    BoxConstraints constraints = renderBox?.constraints;
    double maxWidth = constraints?.maxWidth ?? 0.0;
    return maxWidth;
  }

  // Responsible for adding the quantity to the card
  Positioned buildQuantityText() {
    double animationValue = _datePositionAnimation.value;
    return Positioned(
      top: getMarginTop(animationValue), //<--- Animate vertical position
      right: getMarginRight(animationValue), //<--- Animate horizontal pozition
      child: Text(
        // '!!!orderState.date',
        '${widget.orderState.quantity} ${trans('common.piece')} ${widget.orderState.productName}',
        style: new TextStyle(
          fontSize: 10.0 * animationValue, //<--- Animate fontsize
          color: Colors.grey,
        ),
      ),
    );
  }

  // Responsible for adding the state to the card
  Positioned buildStateText() {
    double animationValue = _statePositionAnimation.value;
    return Positioned(
      right: getMarginRight(animationValue),
      child: AnimatedSwitcher(
        duration: const Duration(seconds: 1),
        child: Text(
          "${widget.orderState.statusLog[widget.orderState.statusLog.keys.last]}",
          key: ValueKey<String>(widget.orderState.statusLog[widget.orderState.statusLog.keys.last].status),
          style: new TextStyle(
            fontSize: 16.0 * animationValue,
            color: Colors.black,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    );
  }

  // Responsible for adding the FromTo time to the card
  Positioned buildFromToTimeText() {
    double animationValue = _fromToPositionAnimation.value;
    return Positioned(
      left: getMarginLeft(animationValue),
      bottom: getMarginBottom(animationValue),
      child: Text(
        _dateFormat.format(DateTime.fromMillisecondsSinceEpoch(
            int.parse(widget.orderState.statusLog.keys.first))),
        style: new TextStyle(
          fontSize: 12.0 * animationValue,
          color: Colors.grey,
          fontWeight: FontWeight.w500,
        ),
      ),
    );
  }

  // Responsible for building lines extended from each card
  Widget buildLine() {
    double animationValue = _lineAnimation.value;
    double maxLength = maxWidth - OrderStateCard.width;
    return Align(
        alignment: widget.isLeft ? Alignment.centerRight : Alignment.centerLeft,
        child: Container(
          height: 2.0,
          width: maxLength * animationValue,
          color: Color.fromARGB(255, 200, 200, 200),
        ));
  }

  // Responsible for building the card
  Positioned buildCard() {
    double animationValue = _cardSizeAnimation.value;
    double minOuterMargin = 8.0;
    double outerMargin = minOuterMargin + (1 - animationValue) * maxWidth;
    return Positioned(
      right: widget.isLeft ? null : outerMargin,
      left: widget.isLeft ? outerMargin : null,
      child: Transform.scale(
        scale: animationValue,
        child: Container(
          width: OrderStateCard.width,
          height: OrderStateCard.height,
          child: new Card(
            color: Colors.grey.shade100,
          ),
        ),
      ),
    );
  }

  double getMarginBottom(double animationValue) {
    double minBottomMargin = 8.0;
    double bottomMargin =
        minBottomMargin + (1 - animationValue) * minBottomMargin;
    return bottomMargin;
  }

  double getMarginTop(double animationValue) {
    double minMarginTop = 8.0;
    double marginTop =
        minMarginTop + (1 - animationValue) * OrderStateCard.height * 0.5;
    return marginTop;
  }

  // All the texts in the card are either aligned top, right, bottom, left or center of the card
  // depending on the text and if the widget isLeft
  double getMarginLeft(double animationValue) {
    return getMarginHorizontal(animationValue, true);
  }

  double getMarginRight(double animationValue) {
    return getMarginHorizontal(animationValue, false);
  }

  double getMarginHorizontal(double animationValue, bool isTextLeft) {
    if (isTextLeft == widget.isLeft) {
      double minHorizontalMargin = 16.0;
      double maxHorizontalMargin = maxWidth - minHorizontalMargin;
      double horizontalMargin =
          minHorizontalMargin + (1 - animationValue) * maxHorizontalMargin;
      return horizontalMargin;
    } else {
      double maxHorizontalMargin = maxWidth - OrderStateCard.width;
      double horizontalMargin = animationValue * maxHorizontalMargin;
      return horizontalMargin;
    }
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }
}
