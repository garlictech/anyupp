import 'package:fa_prev/models.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/shared/locale.dart';

class OrderStatusItem {
  final String text;
  final IconData icon;
  final Color iconColor;
  final Color lineColor;

  OrderStatusItem(this.text, this.icon, this.iconColor, this.lineColor);
}

class OrderStatusFooter extends StatefulWidget {
  final Order order;

  const OrderStatusFooter({Key key, this.order}) : super(key: key);
  @override
  _OrderStatusFooterState createState() => _OrderStatusFooterState();
}

class _OrderStatusFooterState extends State<OrderStatusFooter> with SingleTickerProviderStateMixin {
  Animation animation;
  AnimationController controller;

  final List<String> statusList = [
    'NONE',
    'PLACED',
    'PROCESSING',
    'READY',
    'PAID',
  ];

  @override
  void initState() {
    super.initState();

    controller = AnimationController(
      duration: const Duration(seconds: 10),
      vsync: this,
    );
    controller.repeat();
  }

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    String status = widget.order.statusLog[widget.order.statusLog.length - 1].status;
    int progressPosition = statusList.indexOf(statusList.firstWhere((element) => element.toUpperCase() == status));
    // print('***** status=$status, progressPosition=$progressPosition');

    return _buildStepper(context, progressPosition);
  }

  Widget _buildStepper(BuildContext context, int progressPosition) {
    List<Widget> steppers = [];
    Color iconColor = theme.indicator;
    Color lineColor = theme.disabled.withOpacity(0.3);

    switch (progressPosition) {
      case 0:
        steppers = addStatusProgressLine(context, [
          OrderStatusItem(statusList[0], Icons.check_circle, iconColor, iconColor),
          OrderStatusItem(statusList[1], Icons.album, lineColor, lineColor),
          OrderStatusItem(statusList[2], Icons.album, lineColor, lineColor),
          OrderStatusItem(statusList[3], Icons.album, lineColor, lineColor),
        ]);
        break;
      case 1:
        steppers = addStatusProgressLine(context, [
          OrderStatusItem(statusList[0], Icons.check_circle, iconColor, iconColor),
          OrderStatusItem(statusList[1], Icons.watch_later, iconColor, iconColor),
          OrderStatusItem(statusList[2], Icons.album, lineColor, lineColor),
          OrderStatusItem(statusList[3], Icons.album, lineColor, lineColor),
        ]);
        break;
      case 2:
        steppers = addStatusProgressLine(context, [
          OrderStatusItem(statusList[0], Icons.check_circle, iconColor, iconColor),
          OrderStatusItem(statusList[1], Icons.check_circle, iconColor, iconColor),
          OrderStatusItem(statusList[2], Icons.check_circle, iconColor, iconColor),
          OrderStatusItem(statusList[3], Icons.album, lineColor, lineColor),
        ]);
        break;
      case 3:
        steppers = addStatusProgressLine(context, [
          OrderStatusItem(statusList[0], Icons.check_circle, iconColor, iconColor),
          OrderStatusItem(statusList[1], Icons.check_circle, iconColor, iconColor),
          OrderStatusItem(statusList[2], Icons.check_circle, iconColor, iconColor),
          OrderStatusItem(statusList[3], Icons.check_circle, iconColor, iconColor),
        ]);
        break;
    }

    List<Widget> labels = [];
    for (var i = 0; i < statusList.length; i++) {
      labels.add(
        Text(
          trans('orders.status.${statusList[i]}'),
          style: GoogleFonts.poppins(
            fontSize: 14.0,
            fontWeight: FontWeight.bold,
          ),
        ),
      );

      if (i < statusList.length - 1) {
        labels.add(
          Expanded(
            child: Container(
              height: 2.0,
              color: Colors.transparent,
            ),
          ),
        );
      }
    }
    return Container(
      padding: EdgeInsets.only(
        top: 12.0,
        bottom: 20.0,
        left: 20.0,
        right: 20.0,
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: steppers,
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: labels,
          )
        ],
      ),
    );
  }

  List<Widget> addStatusProgressLine(BuildContext context, List<OrderStatusItem> items) {
    List<Widget> steppers = [];
    items.forEach((item) {
      if (item.icon == Icons.watch_later) {
        steppers.add(
          AnimatedBuilder(
            animation: controller,
            child: Container(
              width: 40.0,
              height: 40.0,
              child: Icon(
                item.icon,
                color: item.iconColor
              ),
            ),
            builder: (BuildContext context, Widget _widget) {
              return Transform.rotate(
                angle: controller.value * 6.3,
                child: _widget,
              );
            },
          ),
        );
      } else {
        steppers.add(
          Container(
            width: 40.0,
            height: 40.0,
            child: Icon(
              item.icon, // Icons.lens,
              color: item.iconColor,
            ),
          ),
        );
      }

      if (items.last != item) {
        steppers.add(
          Expanded(
            child: Container(height: 2.0, color: item.lineColor),
          ),
        );
      }
    });
    return steppers;
  }
}
