import 'package:flutter/material.dart';

// Its the burger icon that appears in the order tracking system
class AnimatedOrderIcon extends AnimatedWidget {
  AnimatedOrderIcon({Key key, Animation<double> animation})
      : super(key: key, listenable: animation);

  @override
  Widget build(BuildContext context) {
    Animation<double> animation = super.listenable;
    return Icon(
      Icons.local_cafe,
      color: Colors.red,
      size: animation.value,
    );
  }
}
