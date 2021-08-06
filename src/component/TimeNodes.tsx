import React from 'react';
import NodeGroupItem from '../interface/NodeGroupItem';
import TimeNodeColumn from './TimeNodeColumn';

interface ClickFunc {
  (node: NodeGroupItem): void;
}

interface Props {
  nodeGroups: NodeGroupItem[][];
  itemWidth: number;
  itemHeight: number;
  selectedKey?: string;
  handleClickNode: ClickFunc;
}

export default function TimeNodes({
  nodeGroups,
  itemWidth,
  itemHeight,
  selectedKey,
  handleClickNode,
}: Props) {
  return (
    <div>
      {nodeGroups.map((nodes, index) => (
        <TimeNodeColumn
          key={index}
          nodes={nodes}
          itemWidth={itemWidth}
          itemHeight={itemHeight}
          selectedKey={selectedKey}
          handleClickNode={handleClickNode}
        />
      ))}
    </div>
  );
}
