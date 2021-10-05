import 'package:fa_prev/shared/nav.dart';
import 'package:flutter/material.dart';

import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/shared/locale/locale.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter_svg/svg.dart';

class SelectServingModeWidget extends StatefulWidget {
  final int initialPosition;
  final void Function(int)? onSelected;

  const SelectServingModeWidget({
    Key? key,
    this.onSelected,
    this.initialPosition = 0,
  }) : super(key: key);

  @override
  _SelectServingModeWidgetState createState() =>
      _SelectServingModeWidgetState();
}

class _SelectServingModeWidgetState extends State<SelectServingModeWidget> {
  int _selectedPosition = 0;

  @override
  void initState() {
    super.initState();
    _selectedPosition = widget.initialPosition;
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 240.0,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.start,
        children: [
          Container(
            margin: EdgeInsets.only(top: 16.0, bottom: 16.0),
            child: Text(
              trans('servingModeSheet.title'),
              style: Fonts.satoshi(
                fontSize: 16.0,
                fontWeight: FontWeight.normal,
                color: theme.secondary,
              ),
            ),
          ),
          Divider(
            height: 1,
            color: theme.secondary16,
          ),
          Container(
            margin: EdgeInsets.only(
              top: 24.0,
              left: 16.0,
              right: 16.0,
            ),
            child: _buildServingOptionWidget(
              context,
              pos: 0,
              icon: Padding(
                padding: const EdgeInsets.all(6.0),
                child: SvgPicture.asset(
                  'assets/icons/restaurant_menu_black.svg',
                  color: theme.secondary,
                  height: 22.0,
                ),
              ),
              titleKey: trans('servingModeSheet.inPlace.title'),
              descriptionKey: trans('servingModeSheet.inPlace.description'),
              selected: true,
            ),
          ),
          Container(
            margin: EdgeInsets.only(
              top: 32.0,
              left: 16.0,
              right: 16.0,
              // bottom: 40.0,
            ),
            child: _buildServingOptionWidget(
              context,
              pos: 1,
              icon: Icon(
                Icons.directions_walk,
                color: theme.secondary,
                size: 22.0,
              ),
              titleKey: trans('servingModeSheet.takeAway.title'),
              descriptionKey: trans('servingModeSheet.takeAway.description'),
              selected: false,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildServingOptionWidget(
    BuildContext context, {
    required int pos,
    required Widget icon,
    required String titleKey,
    required String descriptionKey,
    required bool selected,
  }) {
    return InkWell(
      onTap: () {
        setState(() {
          _selectedPosition = pos;
        });
        if (widget.onSelected != null) {
          widget.onSelected!(pos);
        }
        Nav.pop(_selectedPosition);
      },
      child: Row(
        mainAxisAlignment: MainAxisAlignment.start,
        children: [
          BorderedWidget(width: 40.0, height: 40.0, child: icon),
          SizedBox(
            width: 12.0,
          ),
          Column(
            mainAxisAlignment: MainAxisAlignment.start,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                trans(titleKey),
                style: Fonts.satoshi(
                  fontSize: 16.0,
                  fontWeight: FontWeight.w700,
                  color: theme.secondary,
                ),
              ),
              Text(
                'Fogyaszd el helyben a kedvenceidet.',
                style: Fonts.satoshi(
                  fontSize: 14.0,
                  fontWeight: FontWeight.w400,
                  color: theme.secondary40,
                ),
              ),
            ],
          ),
          Spacer(),
          Checkbox(
            shape: CircleBorder(),
            activeColor: theme.primary,
            fillColor: MaterialStateColor.resolveWith((states) {
              if (states.isEmpty) {
                return theme.secondary0;
              }
              var state = states.first;
              switch (state) {
                case MaterialState.selected:
                  return theme.primary;
                default:
                  return theme.secondary0;
              }
            }),
            value: _selectedPosition == pos,
            onChanged: (selected) {
              setState(() {
                _selectedPosition = pos;
              });
              if (widget.onSelected != null) {
                widget.onSelected!(pos);
              }
              Nav.pop(_selectedPosition);
            },
          ),
        ],
      ),
    );
  }
}
