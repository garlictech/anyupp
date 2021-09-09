import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/menu/menu.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_staggered_animations/flutter_staggered_animations.dart';
import 'package:google_fonts/google_fonts.dart';

class ProductMenuTabScreen extends StatefulWidget {
  final GeoUnit unit;
  final String categoryId;

  const ProductMenuTabScreen({required this.unit, required this.categoryId});

  @override
  _ProductMenuTabScreenState createState() => _ProductMenuTabScreenState();
}

class _ProductMenuTabScreenState extends State<ProductMenuTabScreen>
    with AutomaticKeepAliveClientMixin<ProductMenuTabScreen> {
  String? _nextToken;
  late int _pageSize;

  @override
  bool get wantKeepAlive => true;

  @override
  void initState() {
    super.initState();
    _pageSize = getIt<AppConstants>().paginationSize;
    getIt<ProductListBloc>()
        .add(LoadProductList(unitId: widget.unit.id!, categoryId: widget.categoryId, nextToken: _nextToken));
  }

  @override
  Widget build(BuildContext context) {
    super.build(context);
    return Container(
      key: PageStorageKey(widget.categoryId),
      padding: EdgeInsets.symmetric(horizontal: MediaQuery.of(context).size.width * 0.015),
      child: BlocBuilder<ProductListBloc, ProductListState>(builder: (context, state) {
        if (state is ProductListLoading) {
          return CenterLoadingWidget();
        }

        if (state is ProductListLoaded) {
          var items = state.products.data;
          _nextToken = state.products.nextToken;
          if (items == null || items.isEmpty) {
            return _buildEmptyList(context);
          }
          return _buildList(widget.unit, items);
        }

        return CenterLoadingWidget();
      }),
    );
  }

  Widget _buildList(GeoUnit unit, List<GeneratedProduct> list) {
    return AnimationLimiter(
      child: ListView.builder(
        itemCount: list.length,
        scrollDirection: Axis.vertical,
        physics: BouncingScrollPhysics(),
        itemBuilder: (context, position) {
          if (position == list.length - 1 && list.length % _pageSize == 0 && _nextToken != null) {
            getIt<ProductListBloc>().add(LoadProductList(
              unitId: widget.unit.id!,
              categoryId: widget.categoryId,
              nextToken: _nextToken,
            ));
          }

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
