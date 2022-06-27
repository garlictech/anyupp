/* eslint-disable @typescript-eslint/no-explicit-any */
import { Maybe, NestedSortItem } from '@bgap/domain';
import { TreeNode } from './drag-n-drop-nested-list.component';

export const findParentNode = (
  nodes: TreeNode[],
  parentId: string,
): TreeNode | null => {
  let parentNode: TreeNode | null = null;

  for (const node of nodes) {
    if (node.data?.id === parentId) {
      parentNode = node;
      break;
    }

    if (!parentNode && node.children) {
      parentNode = findParentNode(node.children, parentId);
    }
  }

  return parentNode;
};

export const buildNodesFromData = (
  dataSource: (any & { id: string })[],
  nestConfig: Maybe<NestedSortItem>[] = [],
) => {
  if (nestConfig?.length === 0) {
    return dataSource.map(item => ({
      data: item,
      children: [],
    }));
  }

  const nodes: TreeNode[] = [];

  nestConfig.forEach(item => {
    const dataItem = {
      data: dataSource.find(s => s.id === item?.id),
      children: [],
    };

    if (dataItem.data) {
      if (!item?.parentId) {
        nodes.push(dataItem);
      } else {
        const parentNode = findParentNode(nodes, item?.parentId);

        if (parentNode) {
          parentNode.children.push(dataItem);
          parentNode.isExpanded = true;
        }
      }
    }
  });

  return nodes;
};

export const parseNodes = (
  nodes: TreeNode[],
  flatNodes: NestedSortItem[],
  parentId?: string,
) => {
  for (const node of nodes) {
    flatNodes.push({
      id: node.data.id,
      parentId,
    });

    if (node.children) {
      flatNodes = parseNodes(node.children, flatNodes, node.data.id);
    }
  }

  return flatNodes;
};
