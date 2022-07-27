import 'package:equatable/equatable.dart';
import '/core/core.dart';

abstract class ExceptionState extends Equatable {
  const ExceptionState();

  @override
  List<Object?> get props => [];
}

class ExceptionShowState extends ExceptionState {
  final AppException exception;

  const ExceptionShowState(this.exception);

  @override
  List<Object?> get props => [exception];
}

class NoException extends ExceptionState {}
