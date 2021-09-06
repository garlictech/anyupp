import 'package:equatable/equatable.dart';

abstract class ExceptionState extends Equatable {
  const ExceptionState();

  @override
  List<Object?> get props => [];
}

class NoException extends ExceptionState {}
