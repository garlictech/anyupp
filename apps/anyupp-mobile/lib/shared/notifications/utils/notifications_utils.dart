import 'dart:convert';

import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/models/core/parsers.dart';
import 'package:fa_prev/modules/rating_tipping/rating_tipping.dart';
import 'package:fa_prev/modules/transactions/screens/transaction_order_details_screen.dart';
import 'package:fa_prev/shared/nav.dart';
import 'package:fa_prev/shared/notifications/notifications.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:timezone/data/latest_all.dart' as tz;
import 'package:timezone/timezone.dart' as tz;

/// Locally class created
class Locally {
  static final Locally _singleton = Locally._internal();

  factory Locally() {
    return _singleton;
  }

  Locally._internal() {
    _init();
  }

  /// A String title for Notification
  String? title;

  /// A String message
  String? message;

  /// App Icon which is required on initialization
  // String appIcon;

  /// Page Route which is also required on Initialization
  Widget? navigatePage;

  final FlutterLocalNotificationsPlugin localNotificationsPlugin =
      FlutterLocalNotificationsPlugin();
  var initializationSettingAndroid;
  var initializationSettingIos;
  var initializationSetting;

  Future<void> _init() async {
    // await requestPermission();

    // Init timezones for scheduled notifcations
    tz.initializeTimeZones();

    /// initializationSettingAndroid declared above is assigned
    /// to AndroidInitializationSettings.
    initializationSettingAndroid =
        AndroidInitializationSettings('@mipmap/ic_launcher');

    /// initializationSettingIos declared above is assigned
    /// to IOSInitializationSettings.
    initializationSettingIos = IOSInitializationSettings(
        requestSoundPermission: true,
        requestBadgePermission: true,
        requestAlertPermission: true,
        onDidReceiveLocalNotification: onDidReceiveNotification);

    /// initializationSetting declared above is here assigned
    /// to InitializationSetting, which comes from flutter_local_notification
    /// package.
    initializationSetting = InitializationSettings(
        android: initializationSettingAndroid, iOS: initializationSettingIos);

    /// localNotificationPlugin is initialized here finally
    await localNotificationsPlugin.initialize(initializationSetting,
        onSelectNotification: onSelectNotification);
  }

  /// requestPermission()
  /// for IOS developers only
  Future requestPermission() async {
    await localNotificationsPlugin
        .resolvePlatformSpecificImplementation<
            IOSFlutterLocalNotificationsPlugin>()
        ?.requestPermissions(
          alert: true,
          badge: true,
          sound: true,
        );
    await localNotificationsPlugin
        .resolvePlatformSpecificImplementation<
            MacOSFlutterLocalNotificationsPlugin>()
        ?.requestPermissions(
          alert: true,
          badge: true,
          sound: true,
        );
  }

  /// onSelectNotification
  /// Obtains a string payload
  /// And perform navigation function
  Future<void> onSelectNotification(String? payloadStr) async {
    print(
        'Notification.onSelectNotification().payload=$payloadStr, page=$navigatePage');
    // if (payload != null) {
    //   debugPrint('notification payload: ' + payload);
    // }
    // await Navigator.push(context, pageRoute);
    if (payloadStr != null && payloadStr != "") {
      Map<String, dynamic> json = jsonDecode(payloadStr);
      NotificationPayloadType? type =
          enumFromStringNull(json['type'], NotificationPayloadType.values);
      print('Notification.onSelectNotification().type=$type');
      if (type == NotificationPayloadType.RATE_ORDER) {
        RateOrderPayload payload = RateOrderPayload.fromJson(json['data']);
        print('Notification.showRating=$payload');
        getIt<RatingOrderNotificationBloc>()
            .add(ShowRatingFromNotification(payload));
      }
      if (type == NotificationPayloadType.SHOW_ORDER) {
        ShowOrderPayload payload = ShowOrderPayload.fromJson(json['data']);
        print('Notification.showOrder=$payload');

        var state = getIt.get<UnitSelectBloc>().state;
        if (state is UnitSelected) {
          Nav.to(TransactionOrderDetailsScreen(
            orderId: payload.orderId,
            unit: state.unit,
            key: UniqueKey(),
          ));
        } else {
          // No unit selected.
        }
      }
      // SHOW INSIDE APP INSTEAD OF HERE
      // if (type == NotificationPayloadType.SHOW_DIALOG) {
      //   ShowDialogPayload payload = ShowDialogPayload.fromJson(json['data']);
      //   print('Notification.showDialog=$payload');
      //   var context = AppContext.context;
      //   if (context != null) {
      //     showSuccessDialog(
      //         context: context,
      //         title: payload.title,
      //         message: payload.message,
      //         bigTitle: payload.bigTitle,
      //         onClose: () {
      //           Nav.reset(
      //             MainNavigation(
      //               pageIndex: 2,
      //             ),
      //           );
      //         });
      //   }
      // }
      return;
    }

    if (navigatePage != null) {
      print('***** onSelectNotification().navigateTo=$navigatePage');
      Nav.reset(navigatePage!);
    }
  }

  /// onDidReceiveNotification
  /// it required for IOS initialization
  /// it takes in id, title, body and payload
  Future<void> onDidReceiveNotification(id, title, body, payload) async {
    print(
        '***** onDidReceiveNotification().id=$id, title=$title, payload=$payload');
    await showDialog(
      context: AppContext.context!,
      builder: (context) {
        return CupertinoAlertDialog(
          title: title,
          content: Text(body),
          actions: <Widget>[
            CupertinoDialogAction(
              isDefaultAction: true,
              child: Text('Ok'),
              onPressed: () async {
                if (navigatePage != null) {
                  Nav.reset(navigatePage!);
                }
              },
            )
          ],
        );
      },
    );
  }

  /// The show Method return a notification to the screen
  /// it takes in a required title, message
  /// channel Name,
  /// channel ID,
  /// channel Description,
  /// importance,
  /// priority
  /// ticker
  Future show(
      {required String title,
      required String message,
      payload,
      channelName = 'AnyUppChannelName',
      channelID = 'AnyUppChannelId',
      importance = Importance.high,
      priority = Priority.high,
      ticker = 'ticker'}) async {
    print('Notification.show()');
    this.title = title;
    this.message = message;

    var androidPlatformChannelSpecifics = AndroidNotificationDetails(
        channelID, channelName,
        importance: importance, priority: priority, ticker: ticker);

    var iosPlatformChannelSpecifics = IOSNotificationDetails();

    var platformChannelSpecifics = NotificationDetails(
        android: androidPlatformChannelSpecifics,
        iOS: iosPlatformChannelSpecifics);

    await localNotificationsPlugin
        .show(0, title, message, platformChannelSpecifics, payload: payload);
  }

  /// The retrievePendingNotifications return all pending
  /// notification to the screen
  ///
  Future retrievePendingNotifications() async {
    return await localNotificationsPlugin.pendingNotificationRequests();
  }

  /// The cancel method as the name goes
  /// cancels a with a provided index id
  ///
  Future cancel(int? index) async {
    if (index == null) {
      throw 'Error: index required';
    } else {
      await localNotificationsPlugin.cancel(index);
    }
  }

  /// The cancelAll method as the name goes
  /// cancels all pending notification
  ///
  Future cancelAll() async {
    await localNotificationsPlugin.cancelAll();
  }

  /// The getDetailsIfAppWasLaunchedViaNotification
  /// return details if the app was lauched by a notification
  /// payload
  ///
  Future getDetailsIfAppWasLaunchedViaNotification() async {
    return localNotificationsPlugin.getNotificationAppLaunchDetails();
  }
}

Future<void> scheduleNotification({
  required String title,
  required String message,
  NotificationPayload? payload,
  Duration showDelay = const Duration(minutes: 10),
}) async {
  print('scheduleNotification()=$showDelay');
  await Locally().localNotificationsPlugin.zonedSchedule(
        payload!.type.index,
        title,
        message,
        tz.TZDateTime.now(tz.local).add(showDelay),
        NotificationDetails(
          android: AndroidNotificationDetails(
            'AnyUppChannelId',
            'AnyUppChannelName',
          ),
          iOS: IOSNotificationDetails(),
        ),
        androidAllowWhileIdle: true,
        uiLocalNotificationDateInterpretation:
            UILocalNotificationDateInterpretation.absoluteTime,
        payload: payload.toJson(),
      );
}

Future<void> cancelNotification({required notificationId}) async {
  await Locally().localNotificationsPlugin.cancel(notificationId);
}

void showNotification({
  required String title,
  required String message,
  Widget? navigateToPage,
  NotificationPayload? payload,
}) {
  print('showNotification().title=$title, mmessage=$message');
  Locally().navigatePage = navigateToPage;
  Locally().show(
    title: title,
    message: message,
    payload: payload?.toJson(),
  );
}
