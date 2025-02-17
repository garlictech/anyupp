import '/core/core.dart';
import '/graphql/generated/crud-api.dart';
import '/models.dart';
import '/modules/cart/cart.dart';
import '/modules/selectunit/selectunit.dart';
import '/modules/takeaway/takeaway.dart';
import '/shared/locale.dart';
import '/shared/utils/unit_utils.dart';
import '/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_staggered_animations/flutter_staggered_animations.dart';
import 'package:pull_to_refresh/pull_to_refresh.dart';
import 'package:shimmer/shimmer.dart';

class SelectUnitScreen extends StatefulWidget {
  final Uri? initialUri;
  SelectUnitScreen({this.initialUri, Key? key}) : super(key: key);

  @override
  State<SelectUnitScreen> createState() => _SelectUnitScreenState();
}

class _SelectUnitScreenState extends State<SelectUnitScreen> {
  final ThemeChainData theme = defaultTheme();
  RefreshController _refreshController = RefreshController(
    initialRefresh: false,
  );

  @override
  void initState() {
    super.initState();
    getIt<CartBloc>().add(ResetCartInMemory());
    getIt<UnitsBloc>().add(DetectLocationAndLoadUnits(
      filter: UnitFilter(
        servingMode: ServingMode.inPlace,
      ),
    ));
    setToolbarThemeV1(theme);
  }

  @override
  void dispose() {
    _refreshController.dispose();
    super.dispose();
  }

  void _onRefresh() async {
    getIt<CartBloc>().add(ResetCartInMemory());
    getIt<UnitsBloc>().add(DetectLocationAndLoadUnits(
      filter: UnitFilter(
        servingMode: ServingMode.inPlace,
      ),
    ));
    _refreshController.refreshCompleted();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              BlocBuilder<TakeAwayBloc, TakeAwayState>(builder: (
                context,
                state,
              ) {
                var mode = ServingMode.inPlace;
                if (state is ServingModeSelectedState) {
                  mode = state.servingMode;
                }
                return Column(
                  children: [
                    Center(
                      child: TakeAwayToggle(
                        initialMode: mode,
                        showText: true,
                        height: 40.0,
                        // colorTheme: theme,
                        onToggle: (ServingMode servingMode) async {
                          getIt<TakeAwayBloc>().add(
                            SetServingMode(servingMode),
                          );
                          getIt<UnitsBloc>().add(
                            FilterUnits(
                                filter: UnitFilter(
                              servingMode: servingMode,
                            )),
                          );
                          return true;
                        },
                      ),
                    ),
                    SizedBox(
                      height: 8.0,
                    ),
                    Padding(
                      padding: const EdgeInsets.only(top: 32.0, bottom: 16.0),
                      child: AnimatedSwitcher(
                        duration: Duration(milliseconds: 750),
                        child: mode == ServingMode.inPlace
                            ? Row(
                                key: UniqueKey(),
                                mainAxisAlignment: MainAxisAlignment.start,
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Expanded(
                                    child: Text(
                                      trans('servingModeSheet.inPlace.title'),
                                      style: Fonts.hH2(color: theme.secondary),
                                    ),
                                  ),
                                ],
                              )
                            : Row(
                                key: UniqueKey(),
                                mainAxisAlignment: MainAxisAlignment.start,
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Expanded(
                                    child: Text(
                                      trans('servingModeSheet.takeAway.title'),
                                      style: Fonts.hH2(color: theme.secondary),
                                    ),
                                  ),
                                ],
                              ),
                      ),
                    ),
                  ],
                );
              }),
              Expanded(
                child: BlocBuilder<UnitsBloc, UnitsState>(
                  builder: (context, state) {
                    if (state is UnitsNoNearUnit) {
                      return _getRefreshableMessage(
                          'selectUnitMap.noNearUnits');
                    }

                    if (state is UnitsNotLoaded) {
                      return _getRefreshableMessage('selectUnitMap.notLoaded');
                    }
                    if (state is UnitsLoaded) {
                      if (state.units.isNotEmpty) {
                        // return _UnitListWidget(units: state.units);
                        return _buildList(state.units, currentServingMode);
                      }
                      return _getRefreshableMessage(
                          'selectUnitMap.noNearUnits');
                    }

                    return const _UnitListLoadingWidget();
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildList(List<Unit> units, ServingMode mode) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(
          child: Stack(
            alignment: Alignment.bottomCenter,
            children: [
              _UnitListWidget(units: units),
              Positioned(
                bottom: 8.0,
                child: _StartQRCodeScanButton(
                  theme: theme,
                  initialUri: widget.initialUri,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _getRefreshableMessage(String titleKey) {
    return SmartRefresher(
      enablePullDown: true,
      header: MaterialClassicHeader(),
      controller: _refreshController,
      onRefresh: _onRefresh,
      child: UnitLoadInfoWidget(
        titleKey: titleKey,
      ),
    );
  }
}

class _StartQRCodeScanButton extends StatelessWidget {
  final Uri? initialUri;
  final ThemeChainData theme;
  const _StartQRCodeScanButton({Key? key, this.initialUri, required this.theme})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: () => showQRScannerModal(context, true),
      style: ElevatedButton.styleFrom(
        backgroundColor: theme.button,
        minimumSize: Size(153, 56),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(32),
        ),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            Icons.qr_code_scanner,
            color: theme.secondary0,
            size: 23,
          ),
          SizedBox(
            width: 10.3,
          ),
          Text(
            trans(context, 'selectUnit.scanQR'),
            style: Fonts.hH4(
              color: theme.secondary0,
            ),
          ),
        ],
      ),
    );
  }
}

class _UnitListWidget extends StatefulWidget {
  final List<Unit> units;
  const _UnitListWidget({Key? key, required this.units}) : super(key: key);

  @override
  State<_UnitListWidget> createState() => _UnitListWidgetState();
}

class _UnitListWidgetState extends State<_UnitListWidget> {
  RefreshController _refreshController = RefreshController(
    initialRefresh: false,
  );

  void _onRefresh() async {
    getIt<CartBloc>().add(ResetCartInMemory());
    getIt<UnitsBloc>().add(DetectLocationAndLoadUnits());
    _refreshController.refreshCompleted();
  }

  @override
  Widget build(BuildContext context) {
    return AnimationLimiter(
      child: SmartRefresher(
        enablePullDown: true,
        header: MaterialClassicHeader(),
        controller: _refreshController,
        onRefresh: _onRefresh,
        child: widget.units.isNotEmpty
            ? ListView.builder(
                itemCount: widget.units.length + 1,
                scrollDirection: Axis.vertical,
                physics: BouncingScrollPhysics(),
                itemBuilder: (context, position) {
                  if (position == widget.units.length) {
                    return Container(
                      height: 50,
                    );
                  }

                  var unit = widget.units[position];

                  return AnimationConfiguration.staggeredList(
                    position: position,
                    duration: const Duration(milliseconds: 200),
                    child: SlideAnimation(
                      verticalOffset: 50.0,
                      child: FadeInAnimation(
                        child: UnitWidget(
                          closeTime: getOpeningText(context, unit),
                          distanceInKm: unit.distanceInKm,
                          imageList: unit.coverBanners
                              ?.map((e) => e.imageUrl)
                              .toList(),
                          // isFavorite: false,
                          // unitFoodType: 'Casual',
                          unitName: widget.units[position].name,
                          // unitPriceType: '\$\$',
                          // discount: 20,
                          // rating: 4.8,
                          onTap: () => selectUnitAndGoToMenuScreen(
                            context,
                            widget.units[position],
                            deletePlace: true,
                            useTheme: false,
                            showSelectServingMode: false,
                          ),
                        ),
                      ),
                    ),
                  );
                })
            : EmptyWidget(
                messageKey: 'selectUnitMap.noNearUnits',
              ),
      ),
    );
  }
}

class _UnitListLoadingWidget extends StatelessWidget {
  const _UnitListLoadingWidget({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Shimmer.fromColors(
      baseColor: Colors.grey[300]!,
      highlightColor: Colors.grey[100]!,
      enabled: true,
      child: ListView.builder(
        physics: BouncingScrollPhysics(),
        itemBuilder: (_, __) => Column(
          mainAxisAlignment: MainAxisAlignment.start,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Container(
              width: double.infinity,
              height: 180.0,
              color: Colors.white,
            ),
            SizedBox(
              height: 8.0,
            ),
            Container(
              width: MediaQuery.of(context).size.width / 2.0,
              height: 20.0,
              color: Colors.white,
            ),
            SizedBox(
              height: 8.0,
            ),
            Container(
              width: MediaQuery.of(context).size.width / 1.5,
              height: 16.0,
              color: Colors.white,
            ),
            SizedBox(
              height: 32.0,
            ),
          ],
        ),
        itemCount: 3,
      ),
    );
  }
}
