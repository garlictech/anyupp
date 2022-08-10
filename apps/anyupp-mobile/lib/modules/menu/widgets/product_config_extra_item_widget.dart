import '/core/core.dart';
import '/models.dart';
import '/modules/menu/menu.dart';
import '/shared/locale.dart';
import '/shared/utils/format_utils.dart';
import '/shared/utils/unit_utils.dart';
import 'package:flutter/material.dart';

class ProductConfigExtrasItemWidget extends StatefulWidget {
  final ProductConfigSet extraSet;
  final Unit unit;
  final OnExtraSetItemSelected onExtraSelected;

  const ProductConfigExtrasItemWidget(
      {required this.extraSet,
      required this.unit,
      required this.onExtraSelected});

  @override
  _ProductConfigExtrasItemWidgetState createState() =>
      _ProductConfigExtrasItemWidgetState();
}

class _ProductConfigExtrasItemWidgetState
    extends State<ProductConfigExtrasItemWidget> {
  Map<String, String?> _selectedExtras = {};
  int _selectedExtraCount = 0;
  bool _canSelectExtra = true;

  @override
  Widget build(BuildContext context) {
    return Container(
      // margin: EdgeInsets.only(bottom: 16.0),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.all(
          Radius.circular(
            16.0,
          ),
        ),
        color: theme.secondary0,
      ),
      child: Container(
        width: double.infinity,
        padding: EdgeInsets.only(
          top: 12.0,
          // left: 16.0,
          bottom: 12.0,
          // right: 16.0,
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.start,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.only(
                left: 16,
                right: 16,
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    getLocalizedText(context, widget.extraSet.name),
                    style: Fonts.satoshi(
                      color: theme.highlight,
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  Text(
                    '$_selectedExtraCount/${widget.extraSet.maxSelection ?? 1}', // + _getSelectedExtraNames(context),
                    //'$_selectedExtraCount/${widget.extraSet.maxSelection ?? 1}',
                    // getDetailsTextFromModifierSet(context, extraSet),
                    style: Fonts.satoshi(
                      color: theme.secondary40,
                      fontSize: 14.0,
                    ),
                  ),
                ],
              ),
            ),
            Divider(
              color: theme.secondary16,
            ),
            ..._buildSingleExtraList(
                context, widget.extraSet.items, widget.extraSet),
          ],
        ),
      ),
    );
  }

  List<Widget> _buildSingleExtraList(
      BuildContext context,
      List<ProductConfigComponent> components,
      ProductConfigSet productSet) {
    List<Widget> widgets = [];
    components.forEach((extra) {
      bool isSelected = _selectedExtras['${extra.productComponentId}'] != null;
      bool last = false;

      widgets.add(
        InkWell(
          onTap: !isSelected && !_canSelectExtra
              ? null
              : () {
                  setState(() {
                    _selectedExtras['${extra.productComponentId}'] =
                        isSelected ? null : extra.productComponentId;
                  });
                  _updateSelectedCount(productSet);
                  widget.onExtraSelected(productSet.productSetId,
                      extra.productComponentId, !isSelected);
                },
          child: Column(
            mainAxisAlignment: MainAxisAlignment.start,
            children: [
              Padding(
                padding: const EdgeInsets.only(left: 16),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      getLocalizedText(context, extra.name),
                      style: Fonts.satoshi(
                        color: theme.secondary,
                        fontSize: 16.0,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    Row(
                      children: [
                        Text(
                          (extra.price > 0 ? '+' : '') +
                              formatCurrency(extra.price * serviceFeeMul,
                                  widget.unit.currency),
                          style: Fonts.satoshi(
                            color: theme.highlight,
                            fontSize: 16.0,
                            fontWeight: FontWeight.w400,
                          ),
                        ),
                        AbsorbPointer(
                          absorbing: true,
                          child: Radio<String?>(
                            groupValue: extra.productComponentId,
                            value:
                                _selectedExtras['${extra.productComponentId}'],
                            activeColor: theme.highlight,
                            fillColor: MaterialStateColor.resolveWith((states) {
                              if (states.isEmpty) {
                                return theme.secondary16;
                              }
                              var state = states.first;
                              switch (state) {
                                case MaterialState.selected:
                                  return theme.highlight;
                                default:
                                  return _canSelectExtra
                                      ? theme.secondary16
                                      : theme.secondary12;
                              }
                            }),
                            onChanged: !isSelected && !_canSelectExtra
                                ? null
                                : (value) {
                                    setState(() {
                                      _selectedExtras[
                                              '${extra.productComponentId}'] =
                                          value == null
                                              ? extra.productComponentId
                                              : null;
                                    });
                                    _updateSelectedCount(productSet);
                                    widget.onExtraSelected(
                                        productSet.productSetId,
                                        extra.productComponentId,
                                        _selectedExtras[
                                                '${extra.productComponentId}'] !=
                                            null);
                                  },
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              if (!last)
                Divider(
                  height: 1,
                  color: theme.secondary12,
                )
            ],
          ),
        ),
      );
    });

    return widgets;
  }

  Future<void> _updateSelectedCount(
      ProductConfigSet productSet) async {
    int selectedCount = 0;
    _selectedExtras.forEach(
        (key, value) => value != null ? ++selectedCount : selectedCount);
    setState(() {
      _canSelectExtra = selectedCount < (widget.extraSet.maxSelection ?? 0);
      _selectedExtraCount = selectedCount;
    });
    log.d(
        '_updateSelectedCount()._canSelectExtra=$_canSelectExtra, count=$_selectedExtraCount, maxCount=${widget.extraSet.maxSelection}');
  }
}
