import 'package:anyupp/data/repositories/user-repository-amplify.dart';
import 'package:anyupp/domain/repositories/user-repository.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final userRepositoryProvider  =
    Provider<UserRepository>((ref) => UserRepositoryAmplify());
