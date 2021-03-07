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
    // getIt<AmplifyUnitBloc>().add(AmplifyListLocalizations());
    // getIt<AmplifyUnitBloc>().add(AmplifyListGroups());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // The appBar head text
      backgroundColor: theme.background2,
      body: BlocBuilder<AmplifyUnitBloc, AmplifyUnitState>(
        builder: (context, state) {
          print('DataStoreDemoScreen.state=$state');
          if (state is AmplifyUnitListLoaded) {
            return _buildList(context, state.units);
          }

          if (state is AmplifyLocalizationListLoaded) {
            return _buildList(context, state.items);
          }

          if (state is AmplifyUnitError) {
            return _buildError(context, state.error);
          }

          return CenterLoadingWidget();
        },
      ),
    );
  }

  Widget _buildError(BuildContext context, String error) {
    return Container(
      child: Center(
        child: Text(error),
      ),
    );
  }

  Widget _buildList<T>(BuildContext context, List<T> list) {
    print('DataStoreDemoScreen._buildList().list=$list, type=$T');
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
                child: _buildCard<T>(list[position]),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildCard<T>(T data) {
    if (data is GeoUnit) {
      return _buildUnitCard(data);
    }
    if (data is LocalizedItem) {
      return _buildLocalizationCard(data);
    }

    return Container();
  }


  Widget _buildUnitCard(GeoUnit unit) {
    return Container(
      height: 60.0,
      child: Card(
        child: Text(unit?.name),
      ),
    );
  }

  Widget _buildLocalizationCard(LocalizedItem item) {
    return Container(
      height: 60.0,
      child: Card(
        child: Text(item?.en),
      ),
    );
  }
}
