import 'package:flutter/foundation.dart';

import '/core/core.dart';
import '/graphql/generated/crud-api.dart' as api;
import '/graphql/graphql.dart';
import 'package:anyupp/domain/repositories/user-repository.dart';

class UserRepositoryAmplify extends UserRepository {
  @override
  Future<void> updateFcmToken(String userId, String newToken) async {
    executeUpdate() async {
      try {
        final result = await GQL.amplify.execute(api.UpdateUserMutation(
          variables: api.UpdateUserArguments(
              input: api.UpdateUserInput(id: userId, fcmTokens: [
            api.FCMTokenInput(
                token: newToken, lastSeen: DateTime.now().toIso8601String())
          ])),
        ));
        if (result.hasErrors) {
          debugPrint("Error in fcm token upgrade: ${result.errors}");
          final errorStr = result.errors.toString();
          return errorStr.contains("The conditional request failed")
              ? "MUST_CREATE"
              : "ERROR";
        }
      } on Exception catch (e) {
        debugPrint("Error in fcm token upgrade: $e");
        return "ERROR";
      }
    }

    executeCreate() async {
      try {
        final result = await GQL.amplify.execute(api.CreateUserMutation(
          variables: api.CreateUserArguments(
              input: api.CreateUserInput(id: userId, fcmTokens: [
            api.FCMTokenInput(
                token: newToken, lastSeen: DateTime.now().toIso8601String())
          ])),
        ));
        if (result.hasErrors) {
          debugPrint("Error in fcm token upgrade: ${result.errors}");
          throw "Error in FCM token update";
        }
      } on Exception catch (e) {
        debugPrint("Error in fcm token upgrade: $e");
        rethrow;
      }
    }

    if ((await executeUpdate()) == "MUST_CREATE") {
      await executeCreate();
    } else {
      throw "Error in FCM token update";
    }
  }
}
