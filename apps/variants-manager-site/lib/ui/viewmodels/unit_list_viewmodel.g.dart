// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'unit_list_viewmodel.dart';

// **************************************************************************
// FunctionalDataGenerator
// **************************************************************************

abstract class $UnitListViewModel {
  const $UnitListViewModel();

  bool get working;

  UnitListViewModel copyWith({
    bool? working,
  }) =>
      UnitListViewModel(
        working: working ?? this.working,
      );

  UnitListViewModel copyUsing(
      void Function(UnitListViewModel$Change change) mutator) {
    final change = UnitListViewModel$Change._(
      this.working,
    );
    mutator(change);
    return UnitListViewModel(
      working: change.working,
    );
  }

  @override
  String toString() => "UnitListViewModel(working: $working)";

  @override
  // ignore: avoid_equals_and_hash_code_on_mutable_classes
  bool operator ==(Object other) =>
      other is UnitListViewModel &&
      other.runtimeType == runtimeType &&
      working == other.working;

  @override
  // ignore: avoid_equals_and_hash_code_on_mutable_classes
  int get hashCode {
    return working.hashCode;
  }
}

class UnitListViewModel$Change {
  UnitListViewModel$Change._(
    this.working,
  );

  bool working;
}

// ignore: avoid_classes_with_only_static_members
class UnitListViewModel$ {
  static final working = Lens<UnitListViewModel, bool>(
    (workingContainer) => workingContainer.working,
    (workingContainer, working) => workingContainer.copyWith(working: working),
  );
}
