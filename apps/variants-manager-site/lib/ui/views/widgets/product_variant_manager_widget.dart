import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:variants_manager_site/ui/presenters/product_variant_manager_presenter.dart';

import '../../../domain/entities/entities.dart';
import '../../../domain/states/product_list.dart';

class WidgetTableCell extends StatelessWidget {
  final Widget content;

  const WidgetTableCell({Key? key, required this.content}) : super(key: key);

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

class ProductVariantManagerWidget extends ConsumerWidget {
  final String unitId;
  final String role;

  const ProductVariantManagerWidget(
      {Key? key, required this.unitId, required this.role})
      : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final productList = ref.watch(productListProvider(unitId));
    final vm = ref.watch(productVariantManagerMVPProvider(unitId));
    final presenter =
        ref.watch(productVariantManagerMVPProvider(unitId).notifier);
    final working = productList.working || vm.working;

    Widget _getProductContent(Product product) {
      final content = Text(product.name);

      return WidgetTableCell(
          content: role == "target"
              ? DragTarget<Variant>(builder: (BuildContext context,
                  List<dynamic> accepted, List<dynamic> rejected) {
                  return content;
                }, onAccept: (data) {
                  presenter.onDragAccept(product, data);
                })
              : content);
    }

    return working
        ? const CircularProgressIndicator()
        : SingleChildScrollView(
            controller: ScrollController(),
            child: Table(
                defaultColumnWidth: const IntrinsicColumnWidth(),
                border: TableBorder.all(color: Colors.grey, width: 1),
                children: productList.products
                    .map((product) => TableRow(children: [
                          _getProductContent(product),
                          WidgetTableCell(
                              content: Column(
                                  children: product.variants
                                      .map((variant) =>
                                          _getVariantContent(variant))
                                      .toList()))
                        ]))
                    .toList()));
  }

  Widget _getVariantContent(Variant variant) {
    final content = Padding(
        padding: const EdgeInsets.all(10),
        child: Text(variant.variantName.hu ?? 'unknown'));

    return role == "source"
        ? Draggable<Variant>(data: variant, child: content, feedback: content)
        : content;
  }
}
