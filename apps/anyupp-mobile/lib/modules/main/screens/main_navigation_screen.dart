import 'package:double_back_to_close_app/double_back_to_close_app.dart';
import 'package:fa_prev/app-config.dart';
import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/modules/cart/cart.dart';
import 'package:fa_prev/modules/main/main.dart';
import 'package:fa_prev/modules/orders/orders.dart';
import 'package:fa_prev/modules/screens.dart';
import 'package:fa_prev/shared/auth/auth.dart';
import 'package:fa_prev/shared/connectivity.dart';
import 'package:fa_prev/shared/exception.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/nav.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class MainNavigation extends StatefulWidget {
  final int pageIndex;
  final bool animateCartIcon;

  const MainNavigation({
    this.pageIndex = 0,
    this.animateCartIcon = true,
  });

  _MainNavigationState createState() => _MainNavigationState();
}

class _MainNavigationState extends State<MainNavigation>
    with SingleTickerProviderStateMixin {
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

    // Reset first deeplink incoming page
    getIt<AuthRepository>().nextPageAfterLogin = null;

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
        _navigateToPage(navState.pageIndex);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return LogConsoleOnShake(
      debugOnly: true,
      enabled: AppConfig.Stage != 'prod',
      child: SafeArea(
        top: false,
        bottom: false,
        child: NetworkConnectionWrapperWidget(
          child: Scaffold(
            // Depending on the boolean showAppBar, you can control the appearance of the appBar
            appBar: _pageOptions![_selectedIndex].showAppBar
                ? AppBar(
                    title: Text(_pageOptions![_selectedIndex].appBarText,
                        style: TextStyle(
                            color: Theme.of(context).colorScheme.secondary)),
                    centerTitle: false,
                    leading: Container(),
                  )
                : null,

            // Opening the selected page
            // body: pages[_selectedIndex],
            body: MultiBlocListener(
              listeners: [
                BlocListener<MainNavigationBloc, MainNavigationState>(
                  listener: (BuildContext context, MainNavigationState state) {
                    if (state is MainNavaigationNeed) {
                      log.d(
                          '******** MainNavigationScreen.MainNavigationBloc.state=${state.pageIndex}');
                      _navigateToPage(state.pageIndex);
                    }
                  },
                ),
                BlocListener<ExceptionBloc, ExceptionState>(
                  listener: (BuildContext context, ExceptionState state) {
                    if (state is ExceptionShowState) {
                      log.d('Main.ExceptionState=$state');
                      // Future.delayed(Duration(seconds: 1)).then((_) =>
                      //     getIt<ExceptionBloc>().add(ShowException(state.exception)));
                      showExceptionDialog(
                        context,
                        state.exception,
                        theme.primary,
                      );
                    }
                  },
                ),
              ],
              child: DoubleBackToCloseApp(
                snackBar: SnackBar(
                  elevation: 8,
                  duration: Duration(seconds: 1),
                  content: Text(
                    trans('common.exit'),
                    textAlign: TextAlign.center,
                    style: Fonts.satoshi(
                      fontSize: 16.0,
                      color: theme.secondary0,
                    ),
                    // style: TextStyle(
                    //   color: Theme.of(context).colorScheme.secondary,
                    // ),
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
            bottomNavigationBar: Material(
              elevation: 8.0,
              child: Container(
                child: BottomAppBar(
                  // elevation: 0.0,
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
                      _createBottomBarIconWithText(
                          0, Icons.fastfood, 'main.bottomTitles.menu'),
                      // _createBottomBarIconWithText(1, Icons.favorite, 'main.bottomTitles.favorites'),
                      // SizedBox(
                      //   width: (MediaQuery.of(context).size.width / 100.0) * 8.0,
                      // ),
                      _createOrdersBottomBarIconWithTextAndBadge(),
                      _createBottomBarIconWithText(
                          3, Icons.account_circle, 'main.bottomTitles.profile'),
                    ],
                  ),
                  // shape: CircularNotchedRectangle(),
                  color: theme.secondary0,
                  // elevation: 18.0,
                ),
              ),
            ),
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
          2,
          Icons.receipt,
          'main.bottomTitles.orders',
          _orderCount > 0 ? _orderCount.toString() : null),
    );
  }

  Widget _createBottomBarIconWithText(int index, IconData icon, String textKey,
      [String? badge]) {
    return BottomBarItem(
      icon: icon,
      text: trans(textKey),
      badge: badge,
      selected: index == _selectedIndex,
      onTapped: () => _navigateToPage(index),
    );
  }

  void _navigateToPage(int index) {
    // log.d('MainNavigationScreen._navigateToPage.index=$index, _selectedIndex=$_selectedIndex');
    if (index == 0) {
      _animationController.forward();
    } else {
      _animationController.reverse();
    }
    if (_selectedIndex == index) return;

    if (index == 2) {
      _pages[2] = OrdersScreen(
        key: UniqueKey(),
      );
    }

    if (index == 0 || index == 4) {
      // Menu + Cart
      setToolbarThemeV1(theme);
    } else {
      // Profile + Orders
      setToolbarThemeV2(theme);
    }

    if (index == 4) {
      index = 0;
      Future.delayed(Duration(seconds: 1))
          .then((value) => Nav.to(CartScreen()));
    }

    setState(() {
      _selectedIndex = index;
    });
  }
}
