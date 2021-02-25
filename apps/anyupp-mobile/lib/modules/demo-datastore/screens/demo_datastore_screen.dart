import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/demo-datastore/demo-datastore.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_staggered_animations/flutter_staggered_animations.dart';

class DataStoreDemoScreen extends StatefulWidget {
  @override
  _DataStoreDemoScreenState createState() => _DataStoreDemoScreenState();
}

class _DataStoreDemoScreenState extends State<DataStoreDemoScreen> {


  @override
  void initState() {
    super.initState();
    getIt<AmplifyUnitBloc>().add(AmplifyListUnits());
  }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // The appBar head text
      backgroundColor: theme.background2,
      body: BlocBuilder<AmplifyUnitBloc, AmplifyUnitState>(
        builder: (context, state) {
          if (state is AmplifyUnitListLoaded) {
            return _buildUnitList(context, state.units);
          }

          return CenterLoadingWidget();
        },
      ),
    );
  }

  Widget _buildUnitList(BuildContext context, List<Unit> list) {
    
    return AnimationLimiter(
      child: ListView.builder(
        itemCount: list.length,
        scrollDirection: Axis.vertical,
        physics: BouncingScrollPhysics(),
        itemBuilder: (context, position) {
          return AnimationConfiguration.staggeredList(
            position: position,
            duration: const Duration(milliseconds: 375),
            child: SlideAnimation(
              horizontalOffset: 100.0,
              child: FadeInAnimation(
                child: _buildUnitCard(list[position]),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildUnitCard(Unit unit) {
    return Container(
      height: 60.0,
      child: Card(
        child: Text(unit.name),
      ),
    );
  }
}
