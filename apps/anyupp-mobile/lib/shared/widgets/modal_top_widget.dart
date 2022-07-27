import '/core/core.dart';
import '/shared/widgets.dart';
import '/shared/widgets/back_button_widget.dart';
import 'package:flutter/material.dart';

class ModalTopWidget extends StatelessWidget {
  const ModalTopWidget({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
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
            padding: const EdgeInsets.only(top: 12),
            child: Container(
              height: 4.0,
              width: 40.0,
              margin: const EdgeInsets.only(bottom: 32.0),
              decoration: BoxDecoration(
                color: theme.secondary16,
                borderRadius: const BorderRadius.all(
                  Radius.circular(8.0),
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }
}
