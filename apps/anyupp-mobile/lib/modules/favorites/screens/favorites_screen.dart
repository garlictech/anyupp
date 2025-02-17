import '/core/core.dart';
import '/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '/modules/favorites/favorites.dart';
import '/modules/takeaway/takeaway.dart';
import '/graphql/generated/crud-api.dart';

class FavoritesScreen extends StatefulWidget {
  @override
  State<FavoritesScreen> createState() => _FavoritesScreenState();
}

class _FavoritesScreenState extends State<FavoritesScreen>
    with AutomaticKeepAliveClientMixin<FavoritesScreen> {
  @override
  bool get wantKeepAlive => true;

  @override
  Widget build(BuildContext context) {
    super.build(context);
    return Scaffold(
      // The appBar head text
      backgroundColor: theme.secondary12,
      body: BlocBuilder<UnitSelectBloc, UnitSelectState>(
        builder: (context, unitState) {
          if (unitState is UnitSelected) {
            return BlocBuilder<TakeAwayBloc, TakeAwayState>(
              builder: (context, takeawayState) {
                // log.d('FavoritesScreen.takeawayState=$takeawayState');
                ServingMode mode = ServingMode.inPlace;
                if (takeawayState is ServingModeSelectedState) {
                  mode = takeawayState.servingMode;
                }

                return FavoritesListWidget(
                  unit: unitState.unit,
                  mode: mode,
                );
              },
            );
          }

          return CenterLoadingWidget();
        },
      ),
    );
  }
}
