import 'package:fa_prev/core/core.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/favorites/favorites.dart';

class FavoriteIconWidget extends StatefulWidget {
  const FavoriteIconWidget({
    Key? key,
    required this.theme,
    required this.product,
    required this.unit,
    this.iconSize = 24.0,
  }) : super(key: key);

  final ThemeChainData theme;
  final GeneratedProduct product;
  final GeoUnit unit;
  final double iconSize;

  @override
  _FavoriteIconWidgetState createState() => _FavoriteIconWidgetState();
}

class _FavoriteIconWidgetState extends State<FavoriteIconWidget> {
  bool? _isFavorite;

  @override
  void initState() {
    super.initState();

    getIt.get<FavoritesBloc>().add(CheckProductIsFavorite(
          widget.unit.id,
          widget.product.id,
        ));
  }

  @override
  Widget build(BuildContext context) {
    return BlocListener<FavoritesBloc, FavoritesState>(
      listener: (BuildContext context, FavoritesState state) {
        if (state is ProductIsFavorite) {
          setState(() {
            _isFavorite = state.isFavorite;
          });
        }
      },
      child: AnimatedSwitcher(
        duration: const Duration(milliseconds: 300),
        transitionBuilder: (Widget child, Animation<double> animation) {
          return FadeTransition(
            child: child,
            opacity: animation,
            // scale: animation,
          );
        },
        child: IconButton(
          key: ValueKey<String>('$_isFavorite'),
          iconSize: widget.iconSize,
          icon: Icon(
            _isFavorite == true ? Icons.favorite : Icons.favorite_border,
            color: widget.theme.secondary,
          ),
          onPressed: () => _addRemoveFavorite(context, widget.product),
        ),
      ),
    );
  }

  void _addRemoveFavorite(BuildContext context, GeneratedProduct product) {
    BlocProvider.of<FavoritesBloc>(context).add(AddOrRemoveFavoriteProduct(
      widget.unit.id,
      product.productCategoryId,
      product.id,
    ));
  }
}
