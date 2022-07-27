import 'package:equatable/equatable.dart';
import '/core/core.dart';

abstract class ExceptionEvent extends Equatable {
  const ExceptionEvent();

  @override
  List<Object?> get props => [];
}

class ShowException extends ExceptionEvent {
  final AppException exception;
  final bool show;

  const ShowException(this.exception, {this.show = true});

  @override
  List<Object?> get props => [exception, show];
}

class AddExceptionToBeShown extends ExceptionEvent {
  final String code;
  final String message;
  final String provider;

  AddExceptionToBeShown(this.code, this.message, this.provider);

  @override
  List<Object?> get props => [code, message, provider];
}
