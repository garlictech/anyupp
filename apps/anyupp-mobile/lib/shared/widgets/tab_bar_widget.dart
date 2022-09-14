// import '/core/core.dart';
// import '/core/theme/theme.dart';
// import '/shared/nav.dart';
// import '/shared/widgets.dart';
// import 'package:flutter/material.dart';

// class TabBarWidget extends StatefulWidget {
//   final Widget firstPage;
//   final Widget secondPage;
//   final String firstPageText;
//   final String secondPageText;
//   final int tabIndex;
//   final Function? onTabChanged;
//   final bool showBackButton;

//   const TabBarWidget(this.firstPage, this.secondPage, this.firstPageText, this.secondPageText,
//       {this.tabIndex = 0, this.showBackButton = true, this.onTabChanged});

//   @override
//   _TabBarWidgetState createState() => _TabBarWidgetState();
// }

// class _TabBarWidgetState extends State<TabBarWidget> with SingleTickerProviderStateMixin {
//   late TabController _tabController;
//   @override
//   void initState() {
//     _tabController = TabController(
//       initialIndex: widget.tabIndex,
//       length: 2,
//       vsync: this,
//     );
//     _tabController.addListener(() {
//       if (widget.onTabChanged != null) {
//         widget.onTabChanged!();
//       }
//     });
//     super.initState();
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       // The appBar head text
//       appBar: AppBar(
//         elevation: 2.0,
//         backgroundColor: theme.secondary12,
//         leading: widget.showBackButton
//             ? Container(
//                 padding: EdgeInsets.only(
//                   left: 8.0,
//                   top: 4.0,
//                   bottom: 4.0,
//                 ),
//                 child: Container(
//                   decoration: BoxDecoration(
//                     borderRadius: BorderRadius.circular(10),
//                     border: Border.all(
//                       width: 1,
//                       color: theme.secondary40.withOpacity(0.4),
//                     ),
//                   ),
//                   child: BackButton(
//                     onPressed: () => Nav.pop(),
//                     color: theme.secondary,
//                   ),
//                 ),
//               )
//             : null,
//         flexibleSpace: Padding(
//           padding: const EdgeInsets.only(bottom: 6.0),
//           child: Column(
//             mainAxisAlignment: MainAxisAlignment.end,
//             children: [
//               TabBar(
//                   controller: _tabController,
//                   isScrollable: false,
//                   indicatorColor: Colors.transparent,
//                   indicatorSize: TabBarIndicatorSize.tab,
//                   indicator: CircleTabIndicator(color: theme.primary, radius: 3),
//                   labelColor: theme.primary,
//                   labelStyle: Fonts.satoshi(
//                     fontSize: 16.0,
//                     fontWeight: FontWeight.w600,
//                   ),
//                   unselectedLabelColor: theme.secondary64.withOpacity(0.4),
//                   tabs: [
//                     Tab(text: widget.firstPageText),
//                     Tab(text: widget.secondPageText),
//                   ]),
//             ],
//           ),
//         ),
//       ),
//       body: TabBarView(controller: _tabController, physics: BouncingScrollPhysics(), children: [
//         widget.firstPage,
//         widget.secondPage,
//       ]),
//     );
//   }
// }
