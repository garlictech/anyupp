import 'package:flutter/material.dart';

class AnyuppProgressIndicator extends StatelessWidget {
  final String? text;
  final Color color;
  final Color? backgroundColor;

  const AnyuppProgressIndicator(
      {this.text,
      this.color = Colors.black,
      this.backgroundColor = Colors.transparent,
      Key? key})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(mainAxisSize: MainAxisSize.min, children: [
      if (text != null)
        Padding(
            padding: const EdgeInsets.only(bottom: 6),
            child: Text(text!.toUpperCase(),
                style: TextStyle(color: color, fontSize: 12))),
      CircularProgressIndicator(
        color: color,
        backgroundColor: backgroundColor,
      )
    ]);
  }
}
