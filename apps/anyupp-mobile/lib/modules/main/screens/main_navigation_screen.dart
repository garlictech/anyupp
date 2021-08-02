import 'package:double_back_to_close_app/double_back_to_close_app.dart';
import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/modules/cart/cart.dart';
import 'package:fa_prev/modules/main/main.dart';
import 'package:fa_prev/modules/orders/orders.dart';
import 'package:fa_prev/modules/screens.dart';
import 'package:fa_prev/shared/connectivity.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';

class MainNavigation extends StatefulWidget {
  final int pageIndex;
  final bool animateCartIcon;

  const MainNavigation({Key key, this.pageIndex = 0, this.animateCartIcon = true}) : super(key: key);

  _MainNavigationState createState() => _MainNavigationState();
}

class _MainNavigationState extends State<MainNavigation> with SingleTickerProviderStateMixin {
  List<MainPageOptions> _pageOptions;

  // --- For bottom animation bar
  int _selectedIndex = 0;
  AnimationController _animationController;
  Animation<double> animation;
  CurvedAnimation curve;

  // Caching pages
  List<Widget> _pages = [
    Menu(),
    FavoritesScreen(),
    OrdersScreen(),
    Profile(),
    CartScreen(),
  ];

  @override
  void initState() {
    super.initState();

    // Start advertisement
    // getIt<AffiliateBloc>().add(StartAdvertisement());

    _animationController = AnimationController(
      duration: Duration(seconds: 1),
      vsync: this,
    );
    curve = CurvedAnimation(
      parent: _animationController,
      curve: Interval(
        0.5,
        1.0,
        curve: Curves.fastOutSlowIn,
      ),
    );
    animation = Tween<double>(
      begin: 0,
      end: 1,
    ).animate(curve);

    if (widget.animateCartIcon == false) {
      _animationController.forward();
    } else {
      Future.delayed(
        Duration(seconds: 2),
        () => _animationController.forward(),
      );
    }
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_pageOptions == null) {
      _pageOptions = [
        MainPageOptions(showAppBar: false, appBarText: trans('main.menu.menu'), systemBarColor: theme.background),
        MainPageOptions(showAppBar: false, appBarText: trans('main.menu.favorites'), systemBarColor: theme.background2),
        MainPageOptions(
            showAppBar: false, appBarText: trans('main.menu.orderStatus'), systemBarColor: theme.background2),
        MainPageOptions(showAppBar: false, appBarText: trans('main.menu.profile'), systemBarColor: theme.background2),
        MainPageOptions(showAppBar: false, appBarText: trans('main.menu.cart'), systemBarColor: theme.background),
      ];
      _navigateToPage(widget.pageIndex);
    } else {
      MainNavigationState navState = getIt<MainNavigationBloc>().state;
      if (navState is MainNavaigationNeed) {
        // print('***** MainNaevigationScreen.didChangeDependencies().toPage=${navState.pageIndex}');

        _navigateToPage(navState.pageIndex);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    // --- This build method called again AFTER the product screen build run. So it set the statusbar color back.
    // --- This little trick need to prevent the statusbar color change back to main screen statusbar color
    if (ModalRoute.of(context).isCurrent) {
      SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle(
        statusBarColor: _pageOptions[_selectedIndex].systemBarColor,
        statusBarIconBrightness: Brightness.dark,
      ));
    }

    // The main scaffold for the whole application
    return BlocBuilder<ThemeBloc, ThemeState>(builder: (context, ThemeState themeState) {
      var theme = themeState.theme;
      return SafeArea(
        child: NetworkConnectionWrapperWidget(
          child: Scaffold(
            // Depending on the boolean showAppBar, you can control the appearance of the appBar
            appBar: _pageOptions[_selectedIndex].showAppBar
                ? AppBar(
                    title: Text(_pageOptions[_selectedIndex].appBarText,
                        style: TextStyle(color: Theme.of(context).accentColor)),
                    centerTitle: false,
                    leading: Container(),
                  )
                : null,

            // Opening the selected page
            // body: pages[_selectedIndex],
            body: BlocListener<MainNavigationBloc, MainNavigationState>(
              listener: (BuildContext context, MainNavigationState state) {
                if (state is MainNavaigationNeed) {
                  print('******** MainNavigationScreen.MainNavigationBloc.state=${state.pageIndex}');
                  _navigateToPage(state.pageIndex);
                }
              },
              child: DoubleBackToCloseApp(
                snackBar: SnackBar(
                  elevation: 8,
                  duration: Duration(seconds: 1),
                  content: Text(
                    trans('common.exit'),
                    style: TextStyle(
                      color: Theme.of(context).accentColor,
                    ),
                  ),
                  behavior: SnackBarBehavior.floating,
                  backgroundColor: Color(0xAA880000),
                ),
                child: IndexedStack(
                  index: _selectedIndex,
                  children: _pages,
                ),
                // child: _pages[_selectedIndex],
              ),
            ),
            floatingActionButton: ScaleTransition(
              scale: animation,
              child: FloatingActionButton(
                heroTag: null,
                elevation: 8,
                backgroundColor: theme.indicator,
                child: CartIconWidget(
                  color: theme.text2,
                  badgeColor: theme.indicator,
                  badgeStyle: GoogleFonts.poppins(
                    fontSize: 12.0,
                    color: theme.text2,
                  ),
                  onTapped: () {
                    _navigateToPage(4);
                  },
                ),
                onPressed: () {
                  // _onItemTapped(2);
                },
              ),
            ),
            floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
            bottomNavigationBar: BottomAppBar(
              child: Row(
                mainAxisSize: MainAxisSize.max,
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: <Widget>[
                  _createBottomBarIconWithText(0, Icons.restaurant, 'main.bottomTitles.menu'),
                  _createBottomBarIconWithText(1, Icons.favorite, 'main.bottomTitles.favorites'),
                  SizedBox(
                    width: (MediaQuery.of(context).size.width / 100.0) * 8.0,
                  ),
                  _createOrdersBottomBarIconWithTextAndBadge(),
                  _createBottomBarIconWithText(3, Icons.person, 'main.bottomTitles.profile'),
                ],
              ),
              shape: CircularNotchedRectangle(),
              color: theme.background,
              notchMargin: 4.0,
              elevation: 18.0,
            ),
          ),
        ),
      );
    });
  }

  int _orderCount = 0;

  Widget _createOrdersBottomBarIconWithTextAndBadge() {
    return BlocListener<OrderCounterBloc, BaseOrderCounterState>(
      listener: (BuildContext context, BaseOrderCounterState state) {
        if (state is ActiveOrderCount) {
          setState(() {
            _orderCount = state.count;
          });
        }
      },
      child: _createBottomBarIconWithText(2, Icons.receipt, 'main.bottomTitles.orders',
          _orderCount != null && _orderCount > 0 ? _orderCount.toString() : null),
    );

    // return BlocListener<OrderBloc, BaseOrderState>(
    //   listener: (BuildContext context, BaseOrderState state) {
    //     if (state is OrdersLoadedState) {
    //       setState(() {
    //         _orderCount = state.totalCount;
    //       });
    //     }

    //     if (state is NoOrdersLoaded) {
    //       setState(() {
    //         _orderCount = 0;
    //       });
    //     }
    //   },
    //   child: _createBottomBarIconWithText(2, Icons.receipt, 'main.bottomTitles.orders',
    //       _orderCount != null && _orderCount > 0 ? _orderCount.toString() : null),
    // );

    // return BlocBuilder<OrderBloc, BaseOrderState>(builder: (context, state) {
    //   if (state is OrdersLoadedState) {
    //     int orderCount = state.totalCount;
    //     return _createBottomBarIconWithText(2, Icons.receipt, 'main.bottomTitles.orders',
    //         orderCount != null && orderCount > 0 ? orderCount.toString() : null);
    //   }
    //   return _createBottomBarIconWithText(2, Icons.receipt, 'main.bottomTitles.orders');
    // });
    // return BlocBuilder<UnitSelectBloc, UnitSelectState>(builder: (context, state) {
    //   if (state is UnitSelected) {
    //     final GeoUnit unit = state.unit;
    //     return _createBottomBarIconWithText(2, Icons.receipt, 'main.bottomTitles.orders');
    //     // return StreamBuilder<List<Order>>(
    //     //     stream: getIt<OrderRepository>().getCurrentOrders(unit.id),
    //     //     builder: (context, AsyncSnapshot<List<Order>> orderState) {
    //     //       print('_createOrdersBottomBarIconWithTextAndBadge.state=${orderState.data}');
    //     //       int orderCount = orderState?.data?.length ?? 0;
    //     //       // int orderCount =  getIt<OrderRepository>().orderListTotalCount;
    //     //       return _createBottomBarIconWithText(2, Icons.receipt, 'main.bottomTitles.orders',
    //     //           orderCount != null && orderCount > 0 ? orderCount.toString() : null);
    //     //     });
    //   } else {
    //     return _createBottomBarIconWithText(2, Icons.receipt, 'main.bottomTitles.orders');
    //   }
    // });
  }

  Widget _createBottomBarIconWithText(int index, IconData icon, String textKey, [String badge]) {
    return BottomBarItem(
      icon: icon,
      text: trans(textKey),
      badge: badge,
      selected: index == _selectedIndex,
      onTapped: () => _navigateToPage(index),
    );
  }

  void _navigateToPage(int index) {
    if (index == 2) {
      _pages[2] = OrdersScreen(
        key: UniqueKey(),
      );
    }
    setState(() {
      _selectedIndex = index;
    });
  }
}
