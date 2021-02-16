import 'package:equatable/equatable.dart';
import 'package:fa_prev/core/core.dart';

abstract class ExceptionEvent extends Equatable {
  const ExceptionEvent();

  @override
  List<Object> get props => [];
}

class ShowException extends ExceptionEvent {
  final AppException exception;

  const ShowException(this.exception);

  @override
  List<Object> get props => [exception];
}
