import '/core/core.dart';
import '/graphql/generated/crud-api.dart';
import '/models.dart';
import '/modules/cart/cart.dart';
import '/modules/menu/menu.dart';
import '/modules/takeaway/takeaway.dart';
import '/shared/locale/locale.dart';
import '/shared/nav.dart';
import '/shared/utils/unit_utils.dart';
import '/shared/widgets.dart';
import '/shared/widgets/tooltip/simple_tooltip.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ProductMenuAppBar extends StatefulWidget implements PreferredSizeWidget {
  final int supportedServiceModeCount;

  const ProductMenuAppBar({
    Key? key,
    this.supportedServiceModeCount = 1,
  })  : preferredSize = const Size.fromHeight(kToolbarHeight),
        super(key: key);

  @override
  final Size preferredSize; // default is 56.0

  @override
  State<ProductMenuAppBar> createState() => _ProductMenuAppBarState();
}

class _ProductMenuAppBarState extends State<ProductMenuAppBar> {
  bool _showTooltip = false;

  @override
  void initState() {
    super.initState();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _checkNeedToShowTooltip();
  }

  Future<void> _checkNeedToShowTooltip() async {
    SharedPreferences preferences = await SharedPreferences.getInstance();
    GeoUnit? unit = currentUnit;
    if (unit != null) {
      bool? showed = preferences.getBool('TOOLTIP_${unit.id}');
      // log.d('_checkNeedToShowTooltip.showed=$showed');
      if (showed == null || showed == false) {
        setState(() {
          _showTooltip = true;
        });
        // ignore: unawaited_futures
        Future.delayed(Duration(seconds: 3)).then((_) {
          if (mounted) {
            setState(() {
              _showTooltip = false;
            });
          }
        });

        await preferences.setBool('TOOLTIP_${unit.id}', true);
      } else {
        _showTooltip = false;
      }
    } else {
      setState(() {
        _showTooltip = false;
        // log.d('_checkNeedToShowTooltip._showTooltip=$_showTooltip');
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return AppBar(
      elevation: 0.0,
      backgroundColor: theme.secondary0,
      centerTitle: true,
      leading: BackButtonWidget(
        color: theme.secondary,
        showBorder: false,
        icon: Icons.arrow_back,
        onPressed: () => _resetPlaceAndGoToUnitSelection(currentUnit),
      ),
      title: widget.supportedServiceModeCount > 1
          ? BlocBuilder<TakeAwayBloc, TakeAwayState>(builder: (
              context,
              state,
            ) {
              if (state is ServingModeSelectedState) {
                return TooltipWidget(
                  show: _showTooltip && widget.supportedServiceModeCount > 1,
                  text: trans('main.tooltip'),
                  tooltipDirection: TooltipDirection.down,
                  child: TakeAwayToggle(
                    initialMode: state.servingMode,
                    showText: true,
                    height: 40.0,
                    onToggle: (ServingMode servingMode) async {
                      return _selectServingMode(context, servingMode);
                    },
                  ),
                );
              }
              return SizedBox();
            })
          : Container(),
    );
  }

  void _resetPlaceAndGoToUnitSelection(GeoUnit? unit) {
    if (unit != null) {
      getIt<CartBloc>().add(ClearPlaceInCart(unit));
    }
    getIt<UnitSelectBloc>().add(DeSelectUnit());
    Nav.pop();
  }

  Future<bool> _selectServingMode(
      BuildContext context, ServingMode current) async {
    log.d('_selectServingMode.current=$current');
    Cart? cart = getIt.get<CartRepository>().cart;
    log.d(
        '_selectServingMode.cart=${cart?.id} servingMode=${cart?.servingMode}');

    var result = await showSelectServingModeSheetWithDeleteConfirm(
      context,
      cart,
      current,
      // initialPosition: current == ServingMode.inPlace ? 0 : 1,
      showSelectServingMode: false,
    );
    log.d('_selectServingMode.result=$result');
    if (result != null) {
      getIt<TakeAwayBloc>().add(
        SetServingMode(current),
      );
      // getIt<UnitsBloc>().add(
      //   FilterUnits(servingMode: current),
      // );
      BlocProvider.of<ProductListBloc>(context).add(LoadAllProductList(
        unitId: currentUnit!.id,
        chainId: currentUnit!.chainId,
      ));
      return true;
    }
    return false;
  }
}
