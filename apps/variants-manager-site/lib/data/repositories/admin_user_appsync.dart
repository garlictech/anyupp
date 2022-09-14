import '/domain/repositories/admin_users/admin_users.dart';
import '/services/graphql/graphql.dart';
import 'package:flutter/foundation.dart';

import '../../domain/entities/entities.dart';

class AdminUserRepositoryAppsync implements AdminUserRepository {
  final AmplifyApi _amplifyApi;

  AdminUserRepositoryAppsync(this._amplifyApi);

  @override
  Future<List<AdminUser>> getAdminUserList() async {
    String gqlDocument = ''' 
      query ListAdminUsers {
        listAdminUsers {
          items {
            id
            name
            email
            phone
          }
          nextToken
        }
      }
    ''';

    final result = await _amplifyApi.execute(gqlDocument);
    var items = result['listAdminUsers']['items']
        .map<AdminUser>((item) => AdminUser.fromJson(item))
        .toList();

    return items;
  }

  @override
  getAdminUser(String id) async {
    String gqlDocument = ''' 
      query GetAdminUser(\$id: ID!) {
        getAdminUser(id: \$id) {
          id
          name
          email
          phone
        }
      }
    ''';

    final result =
        await _amplifyApi.execute(gqlDocument, variables: {"id": id});
    final item = result['getAdminUser'];
    return item != null ? AdminUser.fromJson(item) : null;
  }

  @override
  deleteAdminUser(String id) async {
    String gqlDocument = ''' 
      mutation DeleteAdminUser(\$input: DeleteAdminUserInput!) {
        deleteAdminUser(input: \$input)  {
          id
        }
      }
    ''';

    try {
      final result = await _amplifyApi.execute(gqlDocument, variables: {
        "input": {"id": id}
      });
      final item = result['deleteAdminUser'];
      return item != null;
    } catch (e) {
      debugPrint("Admin user deletion error: $e");
      rethrow;
    }
  }

  @override
  updateAdminUser(AdminUserUpdate input) async {
    String gqlDocument = ''' 
      mutation UpdateAdminUser(\$input: UpdateAdminUserInput!) {
        updateAdminUser(input: \$input) {
          id
        }
      }
    ''';

    try {
      final result = await _amplifyApi
          .execute(gqlDocument, variables: {"input": input.toJson()});
      final item = result['updateAdminUser'];
      return item != null;
    } catch (e) {
      debugPrint("Admin user update error: $e");
      rethrow;
    }
  }

  @override
  createAdminUser(AdminUserCreate input) async {
    String gqlDocument = ''' 
      mutation CreateAdminUser(\$input: CreateAdminUserInput!) {
        createAdminUser(input: \$input) {
          id
          name
          email
          phone
        }
      }
    ''';

    try {
      final result = await _amplifyApi
          .execute(gqlDocument, variables: {"input": input.toJson()});
      final item = result['createAdminUser'];
      return item != null ? AdminUser.fromJson(item) : null;
    } catch (e) {
      debugPrint("Admin user update error: $e");
      rethrow;
    }
  }
}
