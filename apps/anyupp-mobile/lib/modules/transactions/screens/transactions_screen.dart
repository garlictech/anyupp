import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/transactions/bloc/transactions_bloc.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_staggered_animations/flutter_staggered_animations.dart';
import 'package:google_fonts/google_fonts.dart';

class TransactionsScreen extends StatelessWidget {
  Widget build(BuildContext context) {
    return Scaffold(
      // The appBar head text
      backgroundColor: theme.background2,
      body: BlocBuilder<UnitSelectBloc, UnitSelectState>(
        builder: (context, state) {
          if (state is UnitSelected) {
            return _buildTransactions(context, state.unit);
          }

          return CenterLoadingWidget();
        },
      ),
    );
  }

  Widget _buildTransactions(BuildContext context, GeoUnit unit) {
    return BlocBuilder<TransactionsBloc, TransactionsState>(
      builder: (context, state) {
        if (state is TransactionsInitial) {
          getIt<TransactionsBloc>().add(LoadTransactions(unit.id));
        }
        if (state is TransactionsLoadedState) {
          return AnimationLimiter(
            child: ListView.builder(
              itemCount: state.items.length,
              scrollDirection: Axis.vertical,
              physics: BouncingScrollPhysics(),
              itemBuilder: (context, position) {
                return Container();
              },
            ),
          );
        }
        return CenterLoadingWidget();
      },
    );
  }

  Widget _buildEmptyList(BuildContext context) {
    return Container(
      child: Center(
        child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: <Widget>[
              Image.asset(
                'assets/images/no-favorites-icon.png',
                width: 128.0,
                fit: BoxFit.fitWidth,
              ),
              SizedBox(
                height: 60.0,
              ),
              Text(
                trans(context, 'favorites.noFavorites'),
                style: GoogleFonts.poppins(
                  fontSize: 18.0,
                  fontWeight: FontWeight.bold,
                  color: theme.text,
                ),
              )
            ]),
      ),
    );
  }
}
