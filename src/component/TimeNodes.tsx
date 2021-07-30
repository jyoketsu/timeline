import React from 'react';
import NodeGroupItem from '../interface/NodeGroupItem';
import TimeNodeColumn from './TimeNodeColumn';

interface Props {
  nodeGroups: NodeGroupItem[][];
  itemWidth: number;
  itemHeight: number;
}

export default function TimeNodes({
  nodeGroups,
  itemWidth,
  itemHeight,
}: Props) {
  return (
    <div>
      {nodeGroups.map((nodes, index) => (
        <TimeNodeColumn
          key={index}
          nodes={nodes}
          itemWidth={itemWidth}
          itemHeight={itemHeight}
        />
      ))}
    </div>
  );
}
