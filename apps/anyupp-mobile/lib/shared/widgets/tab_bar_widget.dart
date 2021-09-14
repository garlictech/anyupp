import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class TabBarWidget extends StatefulWidget {
  final Widget firstPage;
  final Widget secondPage;
  final String firstPageText;
  final String secondPageText;
  final int tabIndex;
  final Function? onTabChanged;

  const TabBarWidget(this.firstPage, this.secondPage, this.firstPageText, this.secondPageText,
      {this.tabIndex = 0, this.onTabChanged});

  @override
  _TabBarWidgetState createState() => _TabBarWidgetState();
}

class _TabBarWidgetState extends State<TabBarWidget> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  @override
  void initState() {
    _tabController = TabController(
      initialIndex: widget.tabIndex,
      length: 2,
      vsync: this,
    );
    _tabController.addListener(() {
      if (widget.onTabChanged != null) {
        widget.onTabChanged!();
      }
    });
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
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
                  controller: _tabController,
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
                    Tab(text: widget.firstPageText),
                    Tab(text: widget.secondPageText),
                  ]),
            ],
          ),
        ),
      ),
      body: TabBarView(controller: _tabController, physics: BouncingScrollPhysics(), children: [
        widget.firstPage,
        widget.secondPage,
      ]),
    );
  }
}
