import 'dart:convert';

import 'package:flutter/foundation.dart';

import 'package:fa_prev/shared/notifications/model/payload_data.dart';

@immutable
class ShowDialogPayload extends PayloadData {
  final String title;
  final String message;
  final String? bigTitle;
  final bool showButton;

  ShowDialogPayload({
    required this.title,
    required this.message,
    this.bigTitle,
    this.showButton = true,
  });

  ShowDialogPayload copyWith({
    String? title,
    String? message,
    String? bigTitle,
    bool? showButton,
  }) {
    return ShowDialogPayload(
      title: title ?? this.title,
      message: message ?? this.message,
      bigTitle: bigTitle ?? this.bigTitle,
      showButton: showButton ?? this.showButton,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'title': title,
      'message': message,
      'bigTitle': bigTitle,
      'showButton': showButton,
    };
  }

  factory ShowDialogPayload.fromMap(Map<String, dynamic> map) {
    return ShowDialogPayload(
      title: map['title'] ?? '',
      message: map['message'] ?? '',
      bigTitle: map['bigTitle'],
      showButton: map['showButton'] ?? false,
    );
  }

  String toJson() => json.encode(toMap());

  factory ShowDialogPayload.fromJson(String source) =>
      ShowDialogPayload.fromMap(json.decode(source));

  @override
  String toString() {
    return 'ShowDialogPayload(title: $title, message: $message, bigTitle: $bigTitle, showButton: $showButton)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is ShowDialogPayload &&
        other.title == title &&
        other.message == message &&
        other.bigTitle == bigTitle &&
        other.showButton == showButton;
  }

  @override
  int get hashCode {
    return title.hashCode ^
        message.hashCode ^
        bigTitle.hashCode ^
        showButton.hashCode;
  }
}
