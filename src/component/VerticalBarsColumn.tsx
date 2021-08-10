import React from 'react';
import NodeGroupItem from '../interface/NodeGroupItem';

interface Props {
  nodes: NodeGroupItem[];
  itemWidth: number;
  itemHeight: number;
  selectedKey?: string;
}

export default function VerticalBarsColumn({
  nodes,
  itemWidth,
  itemHeight,
  selectedKey,
}: Props) {
  return (
    <div>
      {nodes.map((node, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            left: `${node.x + itemWidth / 2}px`,
            bottom: 0,
            height: `${12 + 8 * index + itemHeight * index}px`,
            borderLeft: '1px solid #c7c7c7',
            filter: `${
              node.node._key === selectedKey ? 'brightness(0.8)' : ''
            }`,
          }}
        ></div>
      ))}
    </div>
  );
}
