import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../presenters/unit_list_presenter.dart';
import '/domain/states/unit_list.dart';
import 'icon_button.dart';

class UnitListTableCell extends StatelessWidget {
  final Widget content;

  const UnitListTableCell(this.content);
  @override
  Widget build(BuildContext context) {
    return TableCell(
      verticalAlignment: TableCellVerticalAlignment.middle,
      child: Padding(
          padding: const EdgeInsetsDirectional.fromSTEB(10, 10, 10, 10),
          child: content),
    );
  }
}

class UnitEditHandles extends StatelessWidget {
  final VoidCallback onEdit;

  const UnitEditHandles({required this.onEdit});

  @override
  Widget build(BuildContext context) {
    return UnitListTableCell(Column(children: [
      Row(children: [
        AppIconButton(icon: const Icon(Icons.edit), onPressed: onEdit),
      ])
    ]));
  }
}

class UnitListWidget extends ConsumerWidget {
  final _header = const TableRow(children: [
    UnitListTableCell(
        Text("ID", style: TextStyle(fontWeight: FontWeight.bold))),
    UnitListTableCell(
        Text("Name", style: TextStyle(fontWeight: FontWeight.bold))),
    UnitListTableCell(Text('')),
  ]);

  const UnitListWidget({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final model = ref.watch(unitListMVPProvider(context));
    final presenter = ref.watch(unitListMVPProvider(context).notifier);
    final unitListState = ref.watch(unitListProvider);
    bool working = unitListState.working || model.working;

    return working
        ? const CircularProgressIndicator()
        : SingleChildScrollView(
            controller: ScrollController(),
            child: Table(
                defaultColumnWidth: const IntrinsicColumnWidth(),
                border: TableBorder.all(color: Colors.grey, width: 1),
                children: [_header] +
                    unitListState.users
                        .map((unit) => TableRow(
                              children: [
                                UnitListTableCell(Text(unit.id)),
                                UnitListTableCell(Text(unit.name)),
                                UnitEditHandles(
                                  onEdit: () => presenter.onEditClicked(unit),
                                )
                              ],
                            ))
                        .toList()));
  }
}
