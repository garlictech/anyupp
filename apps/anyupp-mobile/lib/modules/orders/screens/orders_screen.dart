import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import 'order_history_screen.dart';
import 'order_status_screen.dart';

class OrdersScreen extends StatefulWidget {
  final int tabIndex;

  const OrdersScreen({Key key, this.tabIndex = 0}) : super(key: key);

  @override
  _OrdersScreenState createState() => _OrdersScreenState();
}

class _OrdersScreenState extends State<OrdersScreen> {
  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      initialIndex: widget.tabIndex,
      child: Scaffold(
        // The appBar head text
        appBar: AppBar(
          elevation: 2.0,
          backgroundColor: theme.background2,
          flexibleSpace: Padding(
            padding: const EdgeInsets.only(bottom: 6.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                TabBar(
                    isScrollable: false,
                    indicatorColor: Colors.transparent,
                    indicatorSize: TabBarIndicatorSize.tab,
                    indicator: CircleTabIndicator(color: theme.highlight, radius: 3),
                    labelColor: theme.highlight,
                    labelStyle: GoogleFonts.poppins(
                      fontSize: 16.0,
                      fontWeight: FontWeight.w600,
                    ),
                    unselectedLabelColor: theme.disabled.withOpacity(0.4),
                    tabs: [
                      Tab(text: trans('orders.tabCurrentOrder')),
                      Tab(text: trans('orders.tabOrderHistory')),
                    ]),
              ],
            ),
          ),
        ),
        body: TabBarView(physics: BouncingScrollPhysics(), children: [
          OrderStatusScreen(),
          OrderHistoryScreen(),
        ]),
      ),
    );
  }
}
