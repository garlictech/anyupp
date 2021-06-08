import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/core/units/units.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_staggered_animations/flutter_staggered_animations.dart';
import 'package:google_fonts/google_fonts.dart';

import 'package:fa_prev/modules/menu/menu.dart';

class ProductMenuTabScreen extends StatefulWidget {
  final String categoryId;

  const ProductMenuTabScreen({Key key, this.categoryId}) : super(key: key);

  @override
  _ProductMenuTabScreenState createState() => _ProductMenuTabScreenState();
}

class _ProductMenuTabScreenState extends State<ProductMenuTabScreen>
    with AutomaticKeepAliveClientMixin<ProductMenuTabScreen> {
  ProductRepository _productRepository = getIt<ProductRepository>();

  @override
  bool get wantKeepAlive => true;

  @override
  Widget build(BuildContext context) {
    super.build(context);
    return Container(
      key: PageStorageKey(widget.categoryId),
      padding: EdgeInsets.symmetric(horizontal: MediaQuery.of(context).size.width * 0.015),
      child: BlocBuilder<UnitSelectBloc, UnitSelectState>(
        builder: (context, state) {
          if (state is UnitSelected) {
            final GeoUnit unit = state.unit;
            return StreamBuilder<List<GeneratedProduct>>(
              stream: _productRepository.getProductList(unit.id, widget.categoryId),
              builder: (context, AsyncSnapshot<List<GeneratedProduct>> snapshot) {
                if (snapshot.hasData) {
                  if (snapshot.data.isEmpty) {
                    return _buildEmptyList(context);
                  }

                  // Display all the available sandwiches
                  return _buildList(unit, snapshot.data);

                  // In case of error, display error message to the user
                } else if (snapshot.hasError) {
                  return Text("Error get product list: ${snapshot.error}");
                }

                return CenterLoadingWidget();
              },
            );
          }

          return CenterLoadingWidget();
        },
      ),
    );
  }

  Widget _buildList(GeoUnit unit, List<GeneratedProduct> list) {
    return AnimationLimiter(
      child: ListView.builder(
        // itemCount: list.length + 1, // TODO remove affiliate
        itemCount: list.length,
        scrollDirection: Axis.vertical,
        physics: BouncingScrollPhysics(),
        itemBuilder: (context, position) {
          // if (position == list.length) {
          //   return Container(
          //     padding: EdgeInsets.all(8.0),
          //     child: AffiliateCardWidget(),
          //   );
          // }

          return AnimationConfiguration.staggeredList(
            position: position,
            duration: const Duration(milliseconds: 375),
            child: SlideAnimation(
              verticalOffset: 50.0,
              child: FadeInAnimation(
                child: ProductMenuItem(
                  unit: unit,
                  item: list[position],
                  heroPrefix: 'menu',
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildEmptyList(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: <Widget>[
        SizedBox(height: 20.0),
        Center(

            // Display message to the user
            child: Text(
          trans('main.categoryEmpty'),
          style: GoogleFonts.poppins(
            color: theme.text,
            fontWeight: FontWeight.normal,
            fontSize: 14,
          ),
        ))
      ],
    );
  }
}
