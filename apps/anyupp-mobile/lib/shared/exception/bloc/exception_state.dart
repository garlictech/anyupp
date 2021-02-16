import 'package:equatable/equatable.dart';

abstract class ExceptionState extends Equatable {
  const ExceptionState();

  @override
  List<Object> get props => [];
}

class NoException extends ExceptionState {}

// class NewExceptionArrivedState extends ExceptionState {
//   final AppException exception;

//   const NewExceptionArrivedState(this.exception);

//   @override
//   List<Object> get props => [exception];
// }
