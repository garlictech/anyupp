import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/modules/orders/orders.dart';
import 'package:fa_prev/modules/screens.dart';
import 'package:fa_prev/shared/nav.dart';
import 'package:flutter/material.dart';
import 'package:flutter_staggered_animations/flutter_staggered_animations.dart';
import 'package:google_fonts/google_fonts.dart';

class PaymentScreen extends StatefulWidget {
  final List<PlacedOrder> orders;
  final bool backButtonPop;

  const PaymentScreen({Key key, this.orders, this.backButtonPop = false}) : super(key: key);

  @override
  _PaymentScreenState createState() => _PaymentScreenState();
}

class _PaymentScreenState extends State<PaymentScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // The appBar head text
      appBar: AppBar(
        leading: Container(
          padding: EdgeInsets.only(
            left: 8.0,
            top: 4.0,
            bottom: 4.0,
          ),
          child: Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(10),
              border: Border.all(
                width: 1,
                color: theme.text,
              ),
            ),
            child: BackButton(
              onPressed: () => widget.backButtonPop
                  ? Nav.pop()
                  : Nav.reset(MainNavigation(pageIndex: 2)),
              color: theme.text,
            ),
          ),
        ),
        elevation: 0.0,
        iconTheme: IconThemeData(
          color: theme.text, //change your color here
        ),
        backgroundColor: Colors.transparent,
        title: Text(
          'CHECKOUT',
          style: GoogleFonts.poppins(
            color: Colors.black,
          ),
        ),
      ),
      body: _buildList(widget.orders),
      // body: SingleChildScrollView(
      //   physics: BouncingScrollPhysics(),
      //   child: Column(children: [
      //     OrderHistoryCard(
      //       order: widget.orders,
      //     ),
      //   ]),
      // ),
    );
  }

  Widget _buildList(List<PlacedOrder> list) {
    return AnimationLimiter(
      child: ListView.builder(
        itemCount: list.length,
        scrollDirection: Axis.vertical,
        physics: BouncingScrollPhysics(),
        itemBuilder: (context, position) {
          return AnimationConfiguration.staggeredList(
            position: position,
            duration: const Duration(milliseconds: 375),
            child: SlideAnimation(
              verticalOffset: 50.0,
              child: FadeInAnimation(
                child: OrderHistoryCard(
                  order: list[position],
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
