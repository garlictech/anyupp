/* eslint-disable @typescript-eslint/no-explicit-any */
import { DOCUMENT } from '@angular/common';
import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  Output,
  TemplateRef,
} from '@angular/core';
import { Maybe, NestedSortItem } from '@bgap/domain';
import {
  buildNodesFromData,
  parseNodes,
} from './drag-n-drop-nested-list.utils';

export interface TreeNode {
  data: { id: string };
  children: TreeNode[];
  isExpanded?: boolean;
}

export interface DropInfo {
  targetId: string | null;
  action?: string;
}

@Component({
  selector: 'lib-admin-drag-n-drop-nested-list',
  templateUrl: './drag-n-drop-nested-list.component.html',
  styleUrls: ['./drag-n-drop-nested-list.component.scss'],
})
export class DragNDropNestedListComponent implements OnChanges {
  @Input() dataSource: (any & { id: string })[] = [];
  @Input() nestConfig: Maybe<NestedSortItem>[] = [];
  @Input() listItemTemplate?: TemplateRef<any>;
  @Output() readonly nodeChange = new EventEmitter<NestedSortItem[]>();
  public nodes: TreeNode[] = [];
  public dropTargetIds: string[] = []; // ids for connected drop lists
  public nodeLookup: { [id: string]: TreeNode } = {};
  public dropActionTodo?: DropInfo | null;

  constructor(@Inject(DOCUMENT) private document: Document) {}

  ngOnChanges() {
    this.nodes = buildNodesFromData(this.dataSource, this.nestConfig);
    this.prepareDragDrop(this.nodes);
  }

  prepareDragDrop(nodes: TreeNode[]) {
    nodes.forEach(node => {
      this.dropTargetIds.push(node.data.id);
      this.nodeLookup[node.data?.id] = node;
      this.prepareDragDrop(node.children);
    });
  }

  dragMoved(event: any) {
    const e = this.document.elementFromPoint(
      event.pointerPosition.x,
      event.pointerPosition.y,
    );

    if (!e) {
      this._clearDragInfo();
      return;
    }
    const container = e.classList.contains('node-item')
      ? e
      : e.closest('.node-item');
    if (!container) {
      this._clearDragInfo();
      return;
    }
    this.dropActionTodo = {
      targetId: container.getAttribute('data-id'),
    };
    const targetRect = container.getBoundingClientRect();
    const oneThird = targetRect.height / 3;

    if (event.pointerPosition.y - targetRect.top < oneThird) {
      // before
      this.dropActionTodo['action'] = 'before';
    } else if (event.pointerPosition.y - targetRect.top > 2 * oneThird) {
      // after
      this.dropActionTodo['action'] = 'after';
    } else {
      // inside
      this.dropActionTodo['action'] = 'inside';
    }
    this._showDragInfo();
  }

  public drop(event: any) {
    if (!this.dropActionTodo) {
      return;
    }

    const draggedItemId = event.item.data;
    const parentItemId = event.previousContainer.id;
    const targetListId = this._getParentNodeId(
      this.dropActionTodo.targetId || '',
      this.nodes,
      'main',
    );

    const draggedItem = this.nodeLookup[draggedItemId];

    const oldItemContainer =
      parentItemId !== 'main'
        ? this.nodeLookup[parentItemId].children
        : this.nodes;
    const newContainer =
      targetListId !== 'main'
        ? this.nodeLookup[targetListId || '']?.children
        : this.nodes;

    const i = oldItemContainer.findIndex(c => c.data.id === draggedItemId);
    oldItemContainer.splice(i, 1);

    switch (this.dropActionTodo.action) {
      case 'before':
      case 'after': {
        const targetIndex = newContainer?.findIndex(
          c => c.data.id === this.dropActionTodo?.targetId,
        );

        if (this.dropActionTodo.action == 'before') {
          newContainer.splice(targetIndex, 0, draggedItem);
        } else {
          newContainer.splice(targetIndex + 1, 0, draggedItem);
        }
        break;
      }
      case 'inside':
        this.nodeLookup[this.dropActionTodo.targetId as string]?.children.push(
          draggedItem,
        );
        this.nodeLookup[this.dropActionTodo.targetId as string].isExpanded =
          true;
        break;
    }

    this._clearDragInfo(true);

    const NestedSortItems = parseNodes(this.nodes, [], undefined);

    this.nodeChange.emit(NestedSortItems);
  }

  private _getParentNodeId(
    id: string,
    nodesToSearch: TreeNode[],
    parentId: string,
  ): string | null {
    for (const node of nodesToSearch) {
      if (node.data.id == id) {
        return parentId;
      }
      const ret = this._getParentNodeId(id, node.children, node.data.id);
      if (ret) {
        return ret;
      }
    }

    return null;
  }

  private _showDragInfo() {
    this._clearDragInfo();

    if (this.dropActionTodo) {
      this.document
        .getElementById(`node-${this.dropActionTodo?.targetId}`)
        ?.classList?.add('drop-' + this.dropActionTodo.action);
    }
  }

  private _clearDragInfo(dropped = false) {
    if (dropped) {
      this.dropActionTodo = null;
    }

    this.document
      .querySelectorAll('.drop-before')
      .forEach(element => element.classList.remove('drop-before'));
    this.document
      .querySelectorAll('.drop-after')
      .forEach(element => element.classList.remove('drop-after'));
    this.document
      .querySelectorAll('.drop-inside')
      .forEach(element => element.classList.remove('drop-inside'));
  }
}
