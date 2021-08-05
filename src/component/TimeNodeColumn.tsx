import React from 'react';
import NodeGroupItem from '../interface/NodeGroupItem';

interface ClickFunc {
  (nodeKey: string, time: number): void;
}

interface Props {
  nodes: NodeGroupItem[];
  itemWidth: number;
  itemHeight: number;
  selectedKey?: string;
  handleClickNode: ClickFunc;
}

export default function TimeNodeColumn({
  nodes,
  itemWidth,
  itemHeight,
  selectedKey,
  handleClickNode,
}: Props) {
  return (
    <div>
      {nodes.map((node, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            left: `${node.x + itemWidth / 2}px`,
            bottom: `${5 * (index + 1) + itemHeight * index}px`,
            filter: `grayscale(100%) ${
              node.node._key === selectedKey ? '' : 'opacity(0.3)'
            }`,
          }}
          onClick={() => handleClickNode(node.node._key, node.node.time)}
        >
          {node.node.itemRender()}
        </div>
      ))}
    </div>
  );
}
