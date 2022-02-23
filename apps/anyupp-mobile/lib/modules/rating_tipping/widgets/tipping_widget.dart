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
          color: selected ? theme.button : theme.secondary12,
        ),
        padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
        child: Center(
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
          return Dialog(
            child: TipDialogWidget(
              amountController: _otherAmountController,
              minOtherAmount: widget.tipPolicy.minOtherAmount ?? 0,
              onSelected: (type, amount) {
                setState(() {
                  _selectedTipAmount = amount;
                  _selectedTipPercent = null;
                  widget.onSelected(TipType.amount, amount);
                });
              },
            ),
          );
        });
  }
}

class TipDialogWidget extends StatefulWidget {
  final TextEditingController amountController;
  final double minOtherAmount;
  final OnTipSelected onSelected;
  const TipDialogWidget({
    Key? key,
    required this.amountController,
    required this.minOtherAmount,
    required this.onSelected,
  }) : super(key: key);

  @override
  _TipDialogWidgetState createState() => _TipDialogWidgetState();
}

class _TipDialogWidgetState extends State<TipDialogWidget> {
  String? _errorKey;
  FocusNode _focusNode = FocusNode();
  UniqueKey _key = UniqueKey();

  @override
  void initState() {
    WidgetsBinding.instance?.addPostFrameCallback((timeStamp) {
      _focusNode.requestFocus();
    });
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            transEx(context, 'tipping.dialog.title'),
            style: Fonts.satoshi(
              fontSize: 24.0,
              color: theme.secondary,
              fontWeight: FontWeight.w400,
            ),
          ),
          Padding(
            padding: const EdgeInsets.only(top: 16.0),
            child: Text(
              transEx(context, 'tipping.dialog.description'),
            ),
          ),
          SizedBox(
            height: 16.0,
          ),
          FormTextFieldWidget(
            key: _key,
            focusNode: _focusNode,
            labelKey: 'tipping.dialog.hint',
            controller: widget.amountController,
            keyboardType: TextInputType.number,
            mask: MaskTextInputFormatter(
              mask: '#####',
              filter: {"#": RegExp(r'[0-9]')},
            ),
            validator: (value) {
              return 'Error';
            },

            onChanged: (value) {},
          ),
          if (_errorKey != null)
            Container(
              padding: EdgeInsets.only(
                top: 8.0,
                bottom: 8.0,
              ),
              child: Text(
                trans(_errorKey!, [widget.minOtherAmount]),
                style: Fonts.satoshi(
                  color: errorColor,
                ),
              ),
            ),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
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
                  print('VALUE=${widget.amountController.text}');
                  try {
                    _errorKey = null;
                    double? amount =
                        double.tryParse(widget.amountController.text);
                    print('amount=${widget.amountController.text}');
                    if (amount == null) {
                      setState(() {
                        _errorKey = 'tipping.errors.validNumber';
                      });
                      return;
                    }
                    if (amount < 175.0 ||
                        (widget.minOtherAmount >= 175.0 &&
                            amount < widget.minOtherAmount)) {
                      setState(() {
                        _errorKey = 'tipping.errors.minAmount';
                      });
                      return;
                    }
                    widget.onSelected(TipType.amount, amount);
                  } on Exception {
                    // nothing to do
                  }
                  Nav.pop();
                },
              ),
            ],
          )
        ],
      ),
    );
  }
}
