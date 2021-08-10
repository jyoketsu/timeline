import React from 'react';
import NodeGroupItem from '../interface/NodeGroupItem';
import VerticalBarsColumn from './VerticalBarsColumn';

interface Props {
  nodeGroups: NodeGroupItem[][];
  itemWidth: number;
  itemHeight: number;
  selectedKey?: string;
}

export default function VerticalBars({
  nodeGroups,
  itemWidth,
  itemHeight,
  selectedKey,
}: Props) {
  return (
    <div>
      {nodeGroups.map((nodes, index) => (
        <VerticalBarsColumn
          key={index}
          nodes={nodes}
          itemWidth={itemWidth}
          itemHeight={itemHeight}
          selectedKey={selectedKey}
        />
      ))}
    </div>
  );
}
