import 'package:fa_prev/core/units/units.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/modules/favorites/favorites.dart';
import 'package:fa_prev/models.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class FavoriteIconWidget extends StatefulWidget {
  const FavoriteIconWidget({
    Key key,
    @required this.theme,
    @required this.unit,
    @required this.product,
  }) : super(key: key);

  final ThemeChainData theme;
  final Product product;
  final GeoUnit unit;

  @override
  _FavoriteIconWidgetState createState() => _FavoriteIconWidgetState();
}

class _FavoriteIconWidgetState extends State<FavoriteIconWidget> {
  @override
  void initState() {
    super.initState();

    BlocProvider.of<FavoritesBloc>(context).add(CheckProductIsFavorite(
      widget.unit.chainId,
      widget.unit.unitId,
      widget.product.id,
    ));
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<FavoritesBloc, FavoritesState>(
      builder: (context, state) {
        if (state is ProductIsFavorite) {
          return AnimatedSwitcher(
            duration: const Duration(milliseconds: 300),
            transitionBuilder: (Widget child, Animation<double> animation) {
              return FadeTransition(
                child: child,
                opacity: animation,
                // scale: animation,
              );
            },
            child: IconButton(
              key: ValueKey<String>('${state.isFavorite}'),
              icon: Icon(
                state.isFavorite ? Icons.favorite : Icons.favorite_border,
                color: widget.theme.text,
              ),
              onPressed: () => _addRemoveFavorite(context, widget.product),
            ),
          );
        }
        // return Container();
        return IconButton(
          onPressed: () => {},
          icon: Icon(
            Icons.favorite_border,
            color: widget.theme.background,
          ),
        );
      },
    );
  }

  void _addRemoveFavorite(BuildContext context, Product product) {
    BlocProvider.of<FavoritesBloc>(context).add(AddOrRemoveFavoriteProduct(
      widget.unit.chainId,
      widget.unit.unitId,
      product.productCategoryId,
      product.id,
    ));
  }
}
