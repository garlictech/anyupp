import 'package:auto_size_text/auto_size_text.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/menu/menu.dart';
import 'package:flutter/material.dart';
import 'package:expandable/expandable.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:fa_prev/core/theme/theme.dart';

class ProductConfigExtrasItemWidget extends StatefulWidget {
  final GeneratedProductConfigSet extraSet;
  final GeoUnit unit;
  final OnExtraSetItemSelected onExtraSelected;

  const ProductConfigExtrasItemWidget({Key key, this.extraSet, this.unit, this.onExtraSelected}) : super(key: key);

  @override
  _ProductConfigExtrasItemWidgetState createState() => _ProductConfigExtrasItemWidgetState();
}

class _ProductConfigExtrasItemWidgetState extends State<ProductConfigExtrasItemWidget> {
  Map<String, bool> _selectedExtras = {};
  int _selectedExtraCount = 0;
  bool _canSelectExtra = true;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.only(
        bottom: 16,
      ),
      child: ExpandablePanel(
        header: Text(
          getLocalizedText(context, widget.extraSet.name),
          style: GoogleFonts.poppins(
            color: theme.text,
            fontSize: 24.0,
          ),
        ),
        collapsed: Text(
          '[$_selectedExtraCount/${widget.extraSet.maxSelection ?? 1}] ' + _getSelectedExtraNames(context),
          //'$_selectedExtraCount/${widget.extraSet.maxSelection ?? 1}',
          // getDetailsTextFromModifierSet(context, extraSet),
          style: GoogleFonts.poppins(
            color: theme.text,
            fontSize: 16.0,
          ),
        ),
        expanded: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              '$_selectedExtraCount/${widget.extraSet.maxSelection ?? 1}',
              // getDetailsTextFromModifierSet(context, extraSet),
              style: GoogleFonts.poppins(
                color: theme.text,
                fontSize: 16.0,
              ),
            ),
            ..._buildSingleExtraList(context, widget.extraSet.items, widget.extraSet),
          ],
        ),
      ),
    );
  }

  List<Widget> _buildSingleExtraList(
      BuildContext context, List<GeneratedProductConfigComponent> components, GeneratedProductConfigSet productSet) {
    List<Widget> widgets = [];
    components.sort((a, b) => a.position - b.position);
    components.forEach((extra) {
      bool isSelected = _selectedExtras['${extra.productComponentId}'] ?? false;

      widgets.add(InkWell(
        onTap: !isSelected && !_canSelectExtra
            ? null
            : () {
                setState(() {
                  _selectedExtras['${extra.productComponentId}'] = !isSelected;
                });
                _updateSelectedCount(productSet);
                widget.onExtraSelected(productSet.productSetId, extra.productComponentId, !isSelected);
              },
        child: Container(
          child: Row(
            mainAxisAlignment: MainAxisAlignment.start,
            children: [
              Switch(
                activeColor: theme.indicator,
                activeTrackColor: theme.indicator,
                // inactiveThumbColor: theme.highlight.withOpacity(0.2),

                // inactiveTrackColor: theme.highlight.withOpacity(0.76),
                value: isSelected,
                onChanged: !isSelected && !_canSelectExtra
                    ? null
                    : (value) {
                        setState(() {
                          _selectedExtras['${extra.productComponentId}'] = value;
                        });
                        _updateSelectedCount(productSet);
                        widget.onExtraSelected(productSet.productSetId, extra.productComponentId, value);
                      },
              ),
              Expanded(
                flex: 10,
                child: AnimatedDefaultTextStyle(
                  duration: const Duration(milliseconds: 500),
                  style: _getExtrasFontStyleByIsSelected(isSelected),
                  child: AutoSizeText(
                    getLocalizedText(context, extra.name),
                    maxLines: 1,
                  ),
                ),
              ),
              //Spacer(),
              Expanded(
                flex: 2,
                child: AnimatedDefaultTextStyle(
                  duration: const Duration(milliseconds: 300),
                  style: _getExtrasFontStyleByIsSelected(isSelected),
                  child: AutoSizeText(
                    formatCurrencyWithSignal(extra.price, widget.unit.currency),
                    maxLines: 1,
                  ),
                ),
              ),
            ],
          ),
        ),
      ));
    });

    return widgets;
  }

  String _getSelectedExtraNames(BuildContext context) {
    StringBuffer sb = StringBuffer();
    _selectedExtras.forEach((key, value) {
      if (value == true) {
        GeneratedProductConfigComponent component = getComponentByIdFromSet(key, widget.extraSet);
        if (component != null) {
          sb.write(getLocalizedText(context, component.name));
          sb.write(',');
        }
      }
    });
    String text = sb.toString();
    if (text.isNotEmpty) {
      text = text.substring(0, text.length - 1);
    }
    return text;
  }

  TextStyle _getExtrasFontStyleByIsSelected(bool isSelected) {
    return isSelected
        ? GoogleFonts.poppins(
            color: theme.highlight,
            fontSize: 18.0,
          )
        : GoogleFonts.poppins(
            color: theme.text.withOpacity(_canSelectExtra ? 0.76 : 0.3),
            fontSize: 17,
          );
  }

  Future<void> _updateSelectedCount(GeneratedProductConfigSet productSet) async {
    int selectedCount = 0;
    _selectedExtras.forEach((key, value) => value ? ++selectedCount : selectedCount);
    setState(() {
      _canSelectExtra = selectedCount < widget.extraSet.maxSelection;
      _selectedExtraCount = selectedCount;
    });
    print(
        '_updateSelectedCount()._canSelectExtra=$_canSelectExtra, count=$_selectedExtraCount, maxCount=${widget.extraSet.maxSelection}');
  }
}
