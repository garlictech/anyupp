import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/graphql/generated/crud-api.graphql.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/cart/cart.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/nav.dart';
import 'package:fa_prev/shared/utils/format_utils.dart';
import 'package:fa_prev/shared/utils/unit_utils.dart';
import 'package:flutter/material.dart';
import 'package:mask_text_input_formatter/mask_text_input_formatter.dart';

typedef OnTipSelected = void Function(TipType? tipType, double? tip);

class TippingWidget extends StatefulWidget {
  final TipPolicy tipPolicy;
  final OnTipSelected onSelected;
  const TippingWidget({
    Key? key,
    required this.tipPolicy,
    required this.onSelected,
  }) : super(key: key);

  @override
  _TippingWidgetState createState() => _TippingWidgetState();
}

class _TippingWidgetState extends State<TippingWidget> {
  double? _selectedTipPercent;
  double? _selectedTipAmount;
  final TextEditingController _otherAmountController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        if (widget.tipPolicy.title != null)
          Text(
            // trans('tipping.question'),
            getLocalizedText(context, widget.tipPolicy.title!),
            style: Fonts.satoshi(
              fontSize: 18.0,
              fontWeight: FontWeight.w700,
              color: theme.secondary,
            ),
          ),
        SizedBox(
          height: 32.0,
        ),
        Wrap(
          direction: Axis.horizontal,
          spacing: 8.0,
          runSpacing: 8.0,
          // mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            //
            ...widget.tipPolicy.percents
                .map((percent) => _buildTipItem(percent))
                .toList(),
            if (widget.tipPolicy.minOtherAmount != null) _buildTipItem(0.0),
          ],
        ),
        SizedBox(
          height: 32.0,
        ),
        if (widget.tipPolicy.description != null)
          Text(
            getLocalizedText(context, widget.tipPolicy.description!),
            style: Fonts.satoshi(
              fontSize: 14.0,
              fontWeight: FontWeight.w400,
              color: theme.secondary,
            ),
          ),
      ],
    );
  }

  Widget _buildTipItem(double? percent) {
    bool isOther = percent == null || percent == 0.0;
    bool selected =
        isOther ? _selectedTipAmount != null : percent == _selectedTipPercent;
    return InkWell(
      focusColor: Colors.transparent,
      splashColor: Colors.transparent,
      highlightColor: Colors.transparent,
      hoverColor: Colors.transparent,
      onTap: () =>
          isOther ? _showEnterAmountDialog() : _updateSelectionState(percent),
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.all(Radius.circular(16.0)),
          color: selected ? theme.highlight : theme.secondary12,
        ),
        padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
        child: Text(
          isOther
              ? _selectedTipAmount != null
                  ? '${formatCurrency(_selectedTipAmount, currentUnit?.currency ?? 'huf')}'
                  : trans('tipping.otherAmount')
              : '${percent.toStringAsFixed(0)}%',
          style: Fonts.satoshi(
            color: selected ? theme.secondary0 : theme.secondary,
            fontSize: 14.0,
            fontWeight: FontWeight.w400,
          ),
        ),
      ),
    );
  }

  _updateSelectionState(double? percent) {
    if (percent != null && percent == _selectedTipPercent) {
      setState(() {
        _selectedTipPercent = null;
        _selectedTipAmount = null;
        _otherAmountController.text = '';
        widget.onSelected(null, null);
      });
    } else {
      setState(() {
        _selectedTipPercent = percent;
        _selectedTipAmount = null;
        _otherAmountController.text = '';
        widget.onSelected(TipType.percent, percent);
      });
    }
  }

  _showEnterAmountDialog() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          contentPadding: const EdgeInsets.all(16.0),
          title: Text(transEx(context, 'tipping.dialog.title')),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                transEx(context, 'tipping.dialog.description'),
              ),
              SizedBox(
                height: 16.0,
              ),
              FormTextFieldWidget(
                labelKey: 'tipping.dialog.hint',
                controller: _otherAmountController,
                keyboardType: TextInputType.number,
                mask: MaskTextInputFormatter(
                  mask: '#####',
                  filter: {"#": RegExp('[0-9]')},
                ),
              ),
            ],
          ),
          actionsAlignment: MainAxisAlignment.spaceEvenly,
          actions: [
            TextButton(
              child: Text(transEx(context, 'tipping.dialog.cancel')),
              onPressed: () {
                widget.onSelected(null, null);
                Navigator.pop(context);
              },
            ),
            TextButton(
              child: Text(transEx(context, 'tipping.dialog.ok')),
              onPressed: () async {
                print('VALUE=${_otherAmountController.text}');
                try {
                  double amount = double.parse(_otherAmountController.text);
                  setState(() {
                    _selectedTipAmount = amount;
                    _selectedTipPercent = null;
                    widget.onSelected(TipType.amount, amount);
                  });
                } on Exception {
                  // nothing to do
                }
                Nav.pop();
              },
            ),
          ],
        );
      },
    );
  }
}
