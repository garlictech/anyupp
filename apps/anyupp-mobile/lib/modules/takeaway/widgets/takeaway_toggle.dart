import 'package:animated_toggle_switch/animated_toggle_switch.dart';
import 'package:fa_prev/core/logger/logger.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/shared/locale/locale.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';

class TakeAwayToggle extends StatefulWidget {
  final bool Function(bool isLeft) onToggle;
  final bool inPlace;
  final bool showText;
  final double height;
  final Color selectedColor;
  final Color unselectedColor;
  final Color backgroundColor;
  TakeAwayToggle({
    Key? key,
    required this.onToggle,
    this.inPlace = true,
    this.showText = false,
    this.height = 50.0,
    this.selectedColor = const Color(0xFF373737),
    this.unselectedColor = const Color(0xFFFFFFFF),
    this.backgroundColor = const Color(0xFFF0F0F0),
  }) : super(key: key);

  @override
  State<TakeAwayToggle> createState() => _TakeAwayToggleState();
}

class _TakeAwayToggleState extends State<TakeAwayToggle> {
  late bool _inPlace;

  @override
  void initState() {
    super.initState();
    _inPlace = widget.inPlace;
  }

  @override
  Widget build(BuildContext context) {
    bool showText = widget.showText;
    final _textInPlace = trans('cart.inPlace');
    final _textTakeAway = trans('cart.takeAway');
    return AnimatedToggleSwitch<bool>.dual(
      height: widget.height,
      current: _inPlace,
      // onTap: () => log.e('onTap()=${selectedIndex}'),
      first: false,
      second: true,
      dif: 0.0,
      borderColor: Colors.transparent,
      borderWidth: 0.0,
      innerColor: widget.backgroundColor,
      indicatorSize: showText
          ? const Size.fromWidth(110)
          : const Size(46.0, double.infinity),
      onChanged: (b) async {
        log.e('onChanged()=${b}');
        bool canSwitch = await widget.onToggle(b);
        if (canSwitch) {
          setState(() => _inPlace = b);
        }
      },
      colorBuilder: (b) => widget.selectedColor,
      iconBuilder: (value) => value
          ? showText
              ? _IconWithTextWidget(
                  url: 'assets/icons/bag.svg',
                  text: _textTakeAway,
                  color: widget.unselectedColor,
                )
              : _IconWidget(
                  url: 'assets/icons/bag.svg',
                  color: value == true
                      ? widget.unselectedColor
                      : widget.selectedColor,
                )
          : showText
              ? _IconWithTextWidget(
                  url: 'assets/icons/restaurant_menu_black.svg',
                  text: _textInPlace,
                  color: widget.unselectedColor,
                )
              : _IconWidget(
                  url: 'assets/icons/restaurant_menu_black.svg',
                  color: value == false
                      ? widget.unselectedColor
                      : widget.selectedColor,
                ),
      textBuilder: (value) => value
          ? showText
              ? _IconWithTextWidget(
                  url: 'assets/icons/restaurant_menu_black.svg',
                  text: _textInPlace,
                  color: widget.selectedColor,
                )
              : _IconWidget(
                  url: 'assets/icons/restaurant_menu_black.svg',
                  color: value == false
                      ? widget.unselectedColor
                      : widget.selectedColor,
                )
          : showText
              ? _IconWithTextWidget(
                  url: 'assets/icons/bag.svg',
                  text: _textTakeAway,
                  color: widget.selectedColor,
                )
              : _IconWidget(
                  url: 'assets/icons/bag.svg',
                  color: value == true
                      ? widget.unselectedColor
                      : widget.selectedColor,
                ),
    );
  }
}

class _IconWidget extends StatelessWidget {
  final String url;
  final Color color;
  const _IconWidget({
    Key? key,
    required this.url,
    required this.color,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Center(
      child: SvgPicture.asset(
        url,
        color: color,
      ),
    );
  }
}

class _IconWithTextWidget extends StatelessWidget {
  final String url;
  final String text;
  final Color color;
  const _IconWithTextWidget({
    Key? key,
    required this.url,
    required this.text,
    required this.color,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        SvgPicture.asset(
          url,
          color: color,
          width: 20.0,
          height: 20.0,
        ),
        SizedBox(
          width: 2.6,
        ),
        Flexible(
          child: Text(
            text.capitalize(),
            style: Fonts.hH5(
              color: color,
            ),
          ),
        )
      ],
    );
  }
}
