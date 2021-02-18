import 'package:fa_prev/core/dependency_indjection/dependency_injection.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/modules/screens.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/models.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/svg.dart';
import 'package:google_fonts/google_fonts.dart';

import 'package:fa_prev/modules/menu/menu.dart';
import 'product_menu_tab_screen.dart';
import 'package:fa_prev/shared/nav.dart';

class Menu extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (BuildContext context) => getIt<ProductCategoriesBloc>(),
      child: BlocBuilder<ProductCategoriesBloc, ProductCategoriesState>(builder: (context, state) {
        print('Menu.ProductCategoriesBloc.state=$state');
        if (state is ProductCategoriesLoaded) {
          if (state.productCategories != null && state.productCategories.isNotEmpty) {
            return _buildTabBar(context, state.productCategories);
          } else {
            return _noCategoriesWidget(context);
          }
        }
        return CenterLoadingWidget();
      }),
    );
  }

  Widget _buildTabBar(BuildContext context, List<ProductCategory> productCategories) {
    return DefaultTabController(
      length: productCategories.length,
      child: SafeArea(
        child: Scaffold(
          appBar: _createAppBar(context, productCategories),
          backgroundColor: theme.background2,
          body: TabBarView(
            physics: BouncingScrollPhysics(),
            children: productCategories
                .map((category) => ProductMenuTabScreen(
                      categoryId: category.id,
                    ))
                .toList(),
          ),
        ),
      ),
    );
  }

  Widget _createAppBar(BuildContext context, List<ProductCategory> productCategories) {
    return AppBar(
      elevation: 0.0,
      backgroundColor: theme.background,
      actions: [
        IconButton(
          // icon: Icon(
          //   Icons.code,
          //   color: theme(context).indicator,
          // ),
          icon: SvgPicture.asset(
            'assets/icons/qr_code_scanner.svg',
            color: theme.indicator,
          ),
          onPressed: () => Nav.to(SelectUnitQRCodeScannerScreen()),
        ),
        IconButton(
          icon: Icon(
            Icons.location_on,
            color: theme.indicator,
          ),
          onPressed: () {
            showLocationSelectionBottomSheet(context);
          },
        ),
      ],
      title: Column(
        children: <Widget>[
          Padding(
            padding: const EdgeInsets.only(
              top: 8.0,
              bottom: 8.0,
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                if (theme?.images?.header != null)
                  ImageWidget(
                    //width: 200,
                    height: 40,
                    url: theme?.images?.header,
                    errorWidget: Icon(Icons.error),
                    fit: BoxFit.fitHeight,
                  ),
              ],
            ),
          ),
        ],
      ),

      // centerTitle: true,
      bottom: productCategories.isNotEmpty
          ? ColoredTabBar(
              color: theme.background2,
              tabBar: TabBar(
                isScrollable: productCategories.length > 2,
                indicatorColor: Colors.transparent,
                indicatorSize: TabBarIndicatorSize.tab,
                indicator: CircleTabIndicator(color: theme.indicator, radius: 3),
                labelColor: theme.indicator,
                labelStyle: GoogleFonts.poppins(
                  fontSize: 16.0,
                  fontWeight: FontWeight.w600,
                ),
                unselectedLabelColor: theme.disabled.withOpacity(0.4),
                tabs: productCategories.map((category) => Tab(text: getLocalizedText(context, category.name))).toList(),
              ),
            )
          : null,
    );
  }

  Widget _noCategoriesWidget(BuildContext context) {
    return SafeArea(
      child: Scaffold(
        appBar: _createAppBar(context, []),
        backgroundColor: theme.background,
        body: Container(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: <Widget>[
              // Display cart icon
              Image.asset(
                'assets/images/no-items-in-cart-icon.png',
                width: 128.0,
                fit: BoxFit.fitWidth,
              ),
              SizedBox(
                height: 60.0,
              ),
              Center(

                  // Display message to the user
                  child: Text(
                trans(context, 'main.noCategories'),
                style: TextStyle(
                  fontSize: 15.0,
                ),
              ))
            ],
          ),
        ),
      ),
    );
  }
}
