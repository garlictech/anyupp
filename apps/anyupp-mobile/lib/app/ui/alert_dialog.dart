import 'package:anyupp/utils/utils.dart';
import 'package:flutter/material.dart';

class AnyuppAlertDialog with Translater {
  show(
      {required BuildContext context,
      required String title,
      required String content,
      Function? onPressed}) {
    showDialog(
        context: context,
        builder: (context) => AlertDialog(
              title: Text(t(context, title)),
              content: Text(t(context, content)),
              actions: [
                TextButton(
                    onPressed: () {
                      if (onPressed != null) {
                        onPressed();
                      }
                      Navigator.of(context).pop();
                    },
                    child: Text(t(context, 'common.ok')))
              ],
            ));
  }
}
