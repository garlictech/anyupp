import 'package:flutter/material.dart';

// Its the burger icon that appears in the order tracking system
class AnimatedOrderIcon extends AnimatedWidget {
  AnimatedOrderIcon({
    required Animation<double> animation,
  }) : super(listenable: animation);

  @override
  Widget build(BuildContext context) {
    Animation<double> animation = super.listenable as Animation<double>;
    return Icon(
      Icons.local_cafe,
      color: Colors.red,
      size: animation.value,
    );
  }
}
