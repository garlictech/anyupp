import 'package:fa_prev/shared/widgets/tooltip/simple_tooltip.dart';
import 'package:flutter/material.dart';
import 'package:fa_prev/core/theme/theme.dart';

class TooltipWidget extends StatefulWidget {
  final String text;
  final bool show;
  final TooltipDirection tooltipDirection;
  final Widget child;
  const TooltipWidget({
    Key? key,
    this.show = true,
    this.tooltipDirection = TooltipDirection.up,
    required this.text,
    required this.child,
  }) : super(key: key);

  @override
  State<TooltipWidget> createState() => _TooltipWidgetState();
}

class _TooltipWidgetState extends State<TooltipWidget> {
  @override
  Widget build(BuildContext context) {
    return SimpleTooltip(
      arrowBaseWidth: 16.0,
      arrowLength: 8,
      borderWidth: 1.0,
      show: widget.show,
      tooltipDirection: widget.tooltipDirection,
      // animationDuration: const Duration(milliseconds: 1000),
      hideOnTooltipTap: true,
      arrowTipDistance: 4.0,
      borderRadius: 8.0,
      backgroundColor: theme.secondary,
      borderColor: theme.secondary.withOpacity(0.2),
      ballonPadding: EdgeInsets.zero,
      content: Text(
        widget.text,
        softWrap: true,
        textAlign: TextAlign.center,
        style: Fonts.satoshi(
          fontSize: 14.0,
          fontWeight: FontWeight.w400,
          color: theme.secondary0,
          decoration: TextDecoration.none,
        ),
      ),
      child: widget.child,
    );
  }
}
