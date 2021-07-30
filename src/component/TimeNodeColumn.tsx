import React from 'react';
import NodeGroupItem from '../interface/NodeGroupItem';

interface Props {
  nodes: NodeGroupItem[];
  itemWidth: number;
  itemHeight: number;
}

export default function TimeNodeColumn({
  nodes,
  itemWidth,
  itemHeight,
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
          }}
        >
          {node.node.itemRender()}
        </div>
      ))}
    </div>
  );
}
