import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/favorites/favorites.dart';
import 'package:fa_prev/modules/menu/menu.dart';
import 'package:fa_prev/modules/takeaway/bloc/takeaway_bloc.dart';
import 'package:fa_prev/modules/takeaway/takeaway.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_staggered_animations/flutter_staggered_animations.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';

class FavoritesListWidget extends StatefulWidget {
  final GeoUnit unit;
  final ServingMode mode;

  FavoritesListWidget({Key? key, required this.unit, required this.mode}) : super(key: key);

  @override
  _FavoritesListWidgetState createState() => _FavoritesListWidgetState();
}

class _FavoritesListWidgetState extends State<FavoritesListWidget> {
  @override
  void initState() {
    super.initState();
    getIt<FavoritesBloc>().add(ListFavoriteProducts(
      unitId: widget.unit.id,
      servingMode: widget.mode,
    ));
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      child: _buildFavorites(context, widget.unit),
    );
  }

  Widget _buildFavorites(BuildContext context, GeoUnit unit) {
    return BlocListener<TakeAwayBloc, TakeAwayState>(
      listener: (context, state) {
        print('FavoritesListWidget.BlocListener.state=$state');
        if (state is ServingModeSelectedState) {
          getIt<FavoritesBloc>().add(ListFavoriteProducts(
            unitId: widget.unit.id,
            servingMode: state.servingMode,
          ));
        }
      },
      child: BlocBuilder<FavoritesBloc, FavoritesState>(builder: (context, state) {
        if (state is FavoriteListLoaded) {
          if (state.favorites != null && state.favorites!.isNotEmpty) {
            return _buildList(unit, state.favorites!);
          } else {
            return EmptyWidget(
              messageKey: 'favorites.noFavorites',
              descriptionKey: 'favorites.noFavoritesDesc',
              buttonTextKey: 'favorites.noFavoritesButton',
              // onTap: () => getIt<MainNavigationBloc>().add(
              //   DoMainNavigation(
              //     pageIndex: 0,
              //   ),
              // ),
            );
          }
        }
        return CenterLoadingWidget();
      }),
    );
  }

  Widget _buildList(GeoUnit unit, List<FavoriteProduct> list) {
    return AnimationLimiter(
      child: ListView.builder(
        itemCount: list.length,
        scrollDirection: Axis.vertical,
        physics: BouncingScrollPhysics(),
        itemBuilder: (context, position) {
          return AnimationConfiguration.staggeredList(
            position: position,
            duration: const Duration(milliseconds: 200),
            child: SlideAnimation(
              horizontalOffset: 100.0,
              child: FadeInAnimation(
                child: ProductMenuItem(
                  unit: unit,
                  item: list[position].product,
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
