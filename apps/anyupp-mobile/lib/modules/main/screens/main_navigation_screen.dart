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
import 'package:flutter_bloc/flutter_bloc.dart';

class MainNavigation extends StatefulWidget {
  final int pageIndex;
  final bool animateCartIcon;

  const MainNavigation({this.pageIndex = 0, this.animateCartIcon = true});

  _MainNavigationState createState() => _MainNavigationState();
}

class _MainNavigationState extends State<MainNavigation> with SingleTickerProviderStateMixin {
  List<MainPageOptions>? _pageOptions;

  // --- For bottom animation bar
  int _selectedIndex = 0;
  late AnimationController _animationController;

  // Caching pages
  List<Widget> _pages = [
    Menu(),
    FavoritesScreen(),
    OrdersScreen(key: UniqueKey()),
    Profile(),
    CartScreen(),
  ];

  @override
  void initState() {
    super.initState();

    // Start advertisement
    // getIt<AffiliateBloc>().add(StartAdvertisement());

    _animationController = AnimationController(
      duration: Duration(milliseconds: 200),
      vsync: this,
    );
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_pageOptions == null) {
      _pageOptions = [
        MainPageOptions(
          showAppBar: false,
          appBarText: trans('main.menu.menu'),
          systemBarColor: theme.secondary0,
        ),
        MainPageOptions(
          showAppBar: false,
          appBarText: trans('main.menu.favorites'),
          systemBarColor: theme.secondary12,
        ),
        MainPageOptions(
          showAppBar: false,
          appBarText: trans('main.menu.orderStatus'),
          systemBarColor: theme.secondary12,
        ),
        MainPageOptions(
          showAppBar: false,
          appBarText: trans('main.menu.profile'),
          systemBarColor: theme.secondary12,
        ),
        MainPageOptions(
          showAppBar: false,
          appBarText: trans('main.menu.cart'),
          systemBarColor: theme.secondary0,
        ),
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
    var route = ModalRoute.of(context);
    if (route != null && route.isCurrent) {
      setToolbarTheme(theme);
      // SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle(
      //   statusBarColor: _pageOptions![_selectedIndex].systemBarColor,
      //   statusBarIconBrightness: Brightness.dark,
      // ));
    }

    // The main scaffold for the whole application
    return SafeArea(
      child: NetworkConnectionWrapperWidget(
        child: Scaffold(
          // Depending on the boolean showAppBar, you can control the appearance of the appBar
          appBar: _pageOptions![_selectedIndex].showAppBar
              ? AppBar(
                  title: Text(_pageOptions![_selectedIndex].appBarText,
                      style: TextStyle(color: Theme.of(context).colorScheme.secondary)),
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
                    color: Theme.of(context).colorScheme.secondary,
                  ),
                ),
                behavior: SnackBarBehavior.floating,
                backgroundColor: Color(0xAA880000),
              ),
              child: Stack(children: [
                IndexedStack(
                  index: _selectedIndex,
                  children: _pages,
                ),
                Positioned(
                  bottom: 12,
                  left: 0,
                  right: 0,
                  child: CartButtonWidget(
                    controller: _animationController,
                  ),
                ),
              ]),
              // child: _pages[_selectedIndex],
            ),
          ),
          bottomNavigationBar: BottomAppBar(
            // shape: AutomaticNotchedShape(
            //   StadiumBorder(),
            //   // RoundedRectangleBorder(
            //   //   borderRadius: BorderRadius.all(Radius.circular(25)),
            //   // ),
            // ),
            child: Row(
              mainAxisSize: MainAxisSize.max,
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: <Widget>[
                _createBottomBarIconWithText(0, Icons.fastfood, 'main.bottomTitles.menu'),
                // _createBottomBarIconWithText(1, Icons.favorite, 'main.bottomTitles.favorites'),
                // SizedBox(
                //   width: (MediaQuery.of(context).size.width / 100.0) * 8.0,
                // ),
                _createOrdersBottomBarIconWithTextAndBadge(),
                _createBottomBarIconWithText(3, Icons.account_circle, 'main.bottomTitles.profile'),
              ],
            ),
            // shape: CircularNotchedRectangle(),
            color: theme.secondary0,
            // elevation: 18.0,
          ),
        ),
      ),
    );
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
      child: _createBottomBarIconWithText(
          2, Icons.receipt, 'main.bottomTitles.orders', _orderCount > 0 ? _orderCount.toString() : null),
    );
  }

  Widget _createBottomBarIconWithText(int index, IconData icon, String textKey, [String? badge]) {
    return BottomBarItem(
      icon: icon,
      text: trans(textKey),
      badge: badge,
      selected: index == _selectedIndex,
      onTapped: () => _navigateToPage(index),
    );
  }

  void _navigateToPage(int index) {
    if (index == 0) {
      _animationController.forward();
    } else {
      _animationController.reverse();
    }

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
