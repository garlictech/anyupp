import 'package:fa_prev/shared/nav.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';

/// Locally class created
class Locally {
  /// A key identifier property is needed
  Key key;

  /// A String title for Notification
  String title;

  /// A String message
  String message;

  /// Payload for Navigation
  String payload;

  /// App Icon which is required on initialization
  String appIcon;

  /// Page Route which is also required on Initialization
  Widget navigatePage;

  /// A context is also required
  BuildContext context;

  /// IOS Parameters, this is currently not in use but will be implemented in future releases
  bool iosRequestSoundPermission;
  bool iosRequestBadgePermission;
  bool iosRequestAlertPermission;

  /// local notification initialization
  /// initializationSettingAndroid
  /// initializationSettingIos;
  /// initializationSetting;
  FlutterLocalNotificationsPlugin localNotificationsPlugin = FlutterLocalNotificationsPlugin();
  var initializationSettingAndroid;
  var initializationSettingIos;
  var initializationSetting;

  /// Then we create a construct of Locally
  /// which required a context, pageRoute, appIcon and a payload
  /// It also received ios Parameters which are still in dev
  /// Within the construct,
  /// localNotification settings is initialized with Flutter Local Notification
  /// Setting declared above
  Locally({
    @required this.context,
    this.navigatePage,
    @required this.appIcon,
    @required this.payload,
    this.iosRequestSoundPermission = false,
    this.iosRequestBadgePermission = false,
    this.iosRequestAlertPermission = false,
  }) {
    /// initializationSettingAndroid declared above is assigned
    /// to AndroidInitializationSettings.
    initializationSettingAndroid = AndroidInitializationSettings(this.appIcon);

    /// initializationSettingIos declared above is assigned
    /// to IOSInitializationSettings.
    initializationSettingIos = IOSInitializationSettings(
        requestSoundPermission: iosRequestSoundPermission,
        requestBadgePermission: iosRequestBadgePermission,
        requestAlertPermission: iosRequestAlertPermission,
        onDidReceiveLocalNotification: onDidReceiveNotification);

    /// initializationSetting declared above is here assigned
    /// to InitializationSetting, which comes from flutter_local_notification
    /// package.
    initializationSetting = InitializationSettings(initializationSettingAndroid, initializationSettingIos);

    /// localNotificationPlugin is initialized here finally
    localNotificationsPlugin.initialize(initializationSetting, onSelectNotification: onSelectNotification);
  }

  /// requestPermission()
  /// for IOS developers only
  Future requestPermission() async {
    return await localNotificationsPlugin
        .resolvePlatformSpecificImplementation<IOSFlutterLocalNotificationsPlugin>()
        ?.requestPermissions(
          alert: true,
          badge: true,
          sound: true,
        );
  }

  /// onSelectNotification
  /// Obtains a string payload
  /// And perform navigation function
  Future<void> onSelectNotification(String payload) async {
    // print('***** onSelectNotification().payload=$payload, page=$navigatePage, context=$context');
    // if (payload != null) {
    //   debugPrint('notification payload: ' + payload);
    // }
    // await Navigator.push(context, pageRoute);
    if (navigatePage != null) {
      print('***** onSelectNotification().navigateTo=$navigatePage');
      Nav.reset(navigatePage);
    }
  }

  /// onDidReceiveNotification
  /// it required for IOS initialization
  /// it takes in id, title, body and payload
  Future<void> onDidReceiveNotification(id, title, body, payload) async {
    print('***** onDidReceiveNotification().id=$id, title=$title, payload=$payload');
    await showDialog(
        context: context,
        child: CupertinoAlertDialog(
          title: title,
          content: Text(body),
          actions: <Widget>[
            CupertinoDialogAction(
              isDefaultAction: true,
              child: Text('Ok'),
              onPressed: () async {
                if (navigatePage != null) {
                  Nav.reset(navigatePage);
                }
              },
            )
          ],
        ));
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
      {@required title,
      @required message,
      channelName = 'channel Name',
      channelID = 'channelID',
      channelDescription = 'channel Description',
      importance = Importance.High,
      priority = Priority.High,
      ticker = 'test ticker'}) async {
    if (title == null && message == null) {
      throw "Missing parameters, title: message";
    } else {
      this.title = title;
      this.message = message;

      var androidPlatformChannelSpecifics = AndroidNotificationDetails(channelID, channelName, channelDescription,
          importance: importance, priority: priority, ticker: ticker);

      var iosPlatformChannelSpecifics = IOSNotificationDetails();

      var platformChannelSpecifics = NotificationDetails(androidPlatformChannelSpecifics, iosPlatformChannelSpecifics);

      await localNotificationsPlugin.show(0, title, message, platformChannelSpecifics, payload: payload);
    }
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
  Future cancel(int index) async {
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

Locally _locally;

void showNotification(BuildContext context, String title, String message, Widget navigateToPage) {
  if (_locally == null) {
    _locally = Locally(
      context: context,
      payload: '3fa',
      appIcon: 'mipmap/ic_launcher',
      iosRequestAlertPermission: true,
      iosRequestSoundPermission: true,
    );
  }

  _locally.context = context;
  _locally.navigatePage = navigateToPage;
  _locally.show(title: title, message: message);
}
