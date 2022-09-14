import '/shared/nav.dart';
import 'package:flutter/material.dart';

import '/core/core.dart';
import '/shared/locale/locale.dart';
import '/shared/widgets.dart';
import 'package:flutter_svg/svg.dart';

class SelectServingModeWidget extends StatefulWidget {
  final int? initialPosition;
  final void Function(int)? onSelected;
  final bool useTheme;
  final bool dismissable;

  const SelectServingModeWidget({
    Key? key,
    this.onSelected,
    this.initialPosition = 0,
    this.useTheme = true,
    this.dismissable = true,
  }) : super(key: key);

  @override
  _SelectServingModeWidgetState createState() =>
      _SelectServingModeWidgetState();
}

class _SelectServingModeWidgetState extends State<SelectServingModeWidget> {
  int? _selectedPosition;

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
            // margin: EdgeInsets.only(top: 8.0, bottom: 4.0),
            child: Stack(
              // mainAxisAlignment: MainAxisAlignment.spaceBetween,
              // crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                if (widget.dismissable)
                  Align(
                    alignment: Alignment.topLeft,
                    child: Padding(
                      padding: const EdgeInsets.only(left: 8.0, top: 4.0),
                      child: BackButtonWidget(
                        // iconSize: 2,
                        showBorder: false,
                      ),
                    ),
                  ),
                Align(
                  alignment: Alignment.center,
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Text(
                      trans('servingModeSheet.title'),
                      style: Fonts.satoshi(
                        fontSize: 16.0,
                        fontWeight: FontWeight.normal,
                        color: widget.useTheme
                            ? theme.secondary
                            : Color(0xFF373737),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          Divider(
            height: 1,
            color: widget.useTheme ? theme.secondary16 : Color(0xFFF0F0F0),
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
                  color: widget.useTheme ? theme.secondary : Color(0xFF373737),
                  height: 22.0,
                ),
              ),
              title: trans('servingModeSheet.inPlace.title'),
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
              icon: SvgPicture.asset(
                "assets/icons/bag.svg",
                color: widget.useTheme ? theme.secondary : Color(0xFF373737),
              ),
              title: trans('servingModeSheet.takeAway.title'),
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
    required String title,
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
          BorderedWidget(
            width: 40.0,
            height: 40.0,
            color: widget.useTheme ? null : Colors.white,
            borderColor: widget.useTheme ? null : Color(0xFFF0F0F0),
            child: icon,
          ),
          SizedBox(
            width: 12.0,
          ),
          Column(
            mainAxisAlignment: MainAxisAlignment.start,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: Fonts.satoshi(
                  fontSize: 16.0,
                  fontWeight: FontWeight.w700,
                  color: widget.useTheme ? theme.secondary : Color(0xFF373737),
                ),
              ),
              Text(
                descriptionKey,
                style: Fonts.satoshi(
                  fontSize: 14.0,
                  fontWeight: FontWeight.w400,
                  color:
                      widget.useTheme ? theme.secondary40 : Color(0xFFAFAFAF),
                ),
              ),
            ],
          ),
          Spacer(),
          Checkbox(
            shape: CircleBorder(),
            activeColor: widget.useTheme ? theme.highlight : Color(0xFF30BF60),
            fillColor: MaterialStateColor.resolveWith((states) {
              if (states.isEmpty) {
                return widget.useTheme ? theme.secondary0 : Colors.white;
              }
              var state = states.first;
              switch (state) {
                case MaterialState.selected:
                  return widget.useTheme ? theme.highlight : Color(0xFF30BF60);
                default:
                  return widget.useTheme ? theme.secondary0 : Colors.white;
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
