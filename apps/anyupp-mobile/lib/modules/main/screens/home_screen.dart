import 'package:double_back_to_close_app/double_back_to_close_app.dart';
import '/core/core.dart';
import '/modules/main/main.dart';
import '/modules/screens.dart';
import '/shared/connectivity/connectivity.dart';
import '/shared/locale/locale.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class HomeScreen extends StatefulWidget {
  final int pageIndex;
  const HomeScreen({
    Key? key,
    this.pageIndex = 0,
  }) : super(key: key);

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _selectedIndex = 0;
  final ThemeChainData theme = defaultTheme();

  // Caching pages
  List<Widget> _pages = [
    SelectUnitScreen(),
    SelectUnitMapScreen(),
    OrdersScreen(),
    Profile(),
  ];

  @override
  void initState() {
    setState(() {
      _selectedIndex = widget.pageIndex;
    });
    super.initState();
  }

  // @override
  // void didChangeDependencies() {
  //   super.didChangeDependencies();
  //   log.e('HomeScreen.didChangeDependencies()');
  //   getIt<ThemeBloc>().add(ResetTheme());
  // }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      top: false,
      bottom: false,
      child: NetworkConnectionWrapperWidget(
        child: Scaffold(
          body: DoubleBackToCloseApp(
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
              ),
              behavior: SnackBarBehavior.floating,
              backgroundColor: Color(0xAA880000),
            ),
            child: BlocListener<MainNavigationBloc, MainNavigationState>(
              listener: (context, state) {
                if (state is MainNavaigationNeed) {
                  log.d(
                      '******** HomeScreenScreen.MainNavigationBloc.state=${state.pageIndex}');
                  _navigateToPage(state.pageIndex);
                }
              },
              child: IndexedStack(
                index: _selectedIndex,
                children: _pages,
              ),
            ),
          ),
          bottomNavigationBar: BottomAppBar(
            child: Row(
              mainAxisSize: MainAxisSize.max,
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: <Widget>[
                _createBottomBarIconWithText(
                  0,
                  Icons.explore,
                  'home.menu.discover',
                ),
                _createBottomBarIconWithText(
                  1,
                  Icons.map,
                  'home.menu.map',
                ),
                _createBottomBarIconWithText(
                  2,
                  Icons.receipt_outlined,
                  'home.menu.orders',
                ),
                _createBottomBarIconWithText(
                  3,
                  Icons.account_circle,
                  'home.menu.profile',
                ),
              ],
            ),
            color: theme.secondary0,
          ),
        ),
      ),
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
      badgeColor: theme.primary,
      selectedColor: theme.primary,
      unselectedColor: theme.secondary64,
    );
  }

  void _navigateToPage(int index) {
    // log.d('MainNavigationScreen._navigateToPage.index=$index, _selectedIndex=$_selectedIndex');
    if (_selectedIndex == index) return;

    // if (index == 2) {
    //   _pages[2] = OrdersScreen(
    //     key: UniqueKey(),
    //   );
    // }

    // if (index == 0 || index == 4) {
    //   // Menu + Cart
    //   setToolbarThemeV1(theme);
    // } else {
    //   // Profile + Orders
    //   setToolbarThemeV2(theme);
    // }

    setState(() {
      _selectedIndex = index;
    });
  }
}
