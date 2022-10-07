import 'package:anyupp/domain/services/services.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:rxdart/rxdart.dart';
import '/providers/providers.dart';

Future<String?> getFcmToken() async {
  await FirebaseMessaging.instance.requestPermission(
      announcement: true,
      carPlay: true,
      criticalAlert: true,
      alert: true,
      badge: true,
      provisional: false);

  await FirebaseMessaging.instance.setForegroundNotificationPresentationOptions(
    alert: true,
    badge: true,
    sound: true,
  );

  String? apnsToken = await FirebaseMessaging.instance.getAPNSToken();
  debugPrint("FCM: APNSTOKEN received, $apnsToken");
  final fcmToken = await FirebaseMessaging.instance.getToken().then((token) {
    if (token == null) {
      throw "EMPTY_TOKEN";
    }

    return token;
  });

  debugPrint("FCM: FCMTOKEN received, $fcmToken");
  return fcmToken;
}

/*
  Provide an FCM token for push notiofication. 

  - Watch current user state, do nothing until there is no current user
  - When user logs in, ask for posh noti permissions, and get teh APNS and FCM tokens
  - in case of error (any error or empty token), retry after 5 seconds
*/
final fcmTokenRepositoryProvider = StreamProvider<String>((ref) {
  final currentUser = ref.watch(currentUserProvider.stream);
  final userRepository = ref.watch(userRepositoryProvider);

  return currentUser.where((user) {
debugPrint("Current user: $user");
    return user != null;}
    ).switchMap((user) =>
      RetryWhenStream(() => Stream.fromFuture(getFcmToken()), (error, stack) {
        debugPrint("FCM token error (retrying...): $error");
        return TimerStream("let's retry", Duration(seconds: 1));
      }).where((token) => token != null).switchMap((token) =>
          Stream.fromFuture(userRepository.updateFcmToken(user!.id, token!))
              .mapTo(token!)));
});
