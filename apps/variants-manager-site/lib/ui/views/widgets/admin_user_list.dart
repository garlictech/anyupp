import '/domain/states/admin_user_list.dart';
import '/ui/presenters/admin_user_list_presenter.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'icon_button.dart';

class AdminUserListTableCell extends StatelessWidget {
  final Widget content;

  AdminUserListTableCell(this.content);
  @override
  Widget build(BuildContext context) {
    return TableCell(
      verticalAlignment: TableCellVerticalAlignment.middle,
      child: Padding(
          padding: EdgeInsetsDirectional.fromSTEB(10, 10, 10, 10),
          child: content),
    );
  }
}

class AdminUserEditHandles extends StatelessWidget {
  final VoidCallback onEdit;
  final VoidCallback onDelete;

  AdminUserEditHandles({required this.onEdit, required this.onDelete});

  @override
  Widget build(BuildContext context) {
    return AdminUserListTableCell(Column(children: [
      Row(children: [
        AppIconButton(icon: Icon(Icons.edit), onPressed: onEdit),
        AppIconButton(icon: Icon(Icons.delete), onPressed: onDelete),
      ])
    ]));
  }
}

class AdminUserListWidget extends ConsumerWidget {
  final _header = TableRow(children: [
    AdminUserListTableCell(
        Text("ID", style: TextStyle(fontWeight: FontWeight.bold))),
    AdminUserListTableCell(
        Text("Name", style: TextStyle(fontWeight: FontWeight.bold))),
    AdminUserListTableCell(
        Text("Email", style: TextStyle(fontWeight: FontWeight.bold))),
    AdminUserListTableCell(
        Text('Phone', style: TextStyle(fontWeight: FontWeight.bold))),
    AdminUserListTableCell(Text('')),
  ]);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final model = ref.watch(adminUserListMVPProvider(context));
    final presenter = ref.watch(adminUserListMVPProvider(context).notifier);
    final adminUserListState = ref.watch(adminUserListProvider);
    bool working = adminUserListState.working || model.working;

    return working
        ? CircularProgressIndicator()
        : Table(
            defaultColumnWidth: IntrinsicColumnWidth(),
            border: TableBorder.all(color: Colors.grey, width: 1),
            children: [_header] +
                adminUserListState.users
                    .map((adminUser) => TableRow(
                          children: [
                            AdminUserListTableCell(Text(adminUser.id)),
                            AdminUserListTableCell(Text(adminUser.name)),
                            AdminUserListTableCell(Text(adminUser.email)),
                            AdminUserListTableCell(
                                Text(adminUser.phone ?? 'N/A')),
                            AdminUserEditHandles(
                                onEdit: () =>
                                    presenter.onEditClicked(adminUser.id),
                                onDelete: () =>
                                    presenter.onDeleteClicked(adminUser.id))
                          ],
                        ))
                    .toList());
  }
}
