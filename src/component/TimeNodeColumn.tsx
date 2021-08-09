import React, { useEffect, useState } from 'react';
import NodeGroupItem from '../interface/NodeGroupItem';

interface ClickFunc {
  (node: NodeGroupItem): void;
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
  const [hoverKey, setHoverKey] = useState<string | null>(null);
  useEffect(() => {
    setHoverKey(null);
  }, [nodes]);
  return (
    <div>
      {nodes.map((node, index) => (
        <div key={index}>
          <div
            style={{
              position: 'absolute',
              left: `${node.x + itemWidth / 2}px`,
              bottom: `${27 + 18 * index + itemHeight * index}px`,
              filter: `grayscale(100%) ${
                node.node._key === selectedKey || node.node._key === hoverKey
                  ? 'brightness(0.8)'
                  : ''
              }`,
              // width: node.node._key === hoverKey ? '200%' : '100%',
              maxWidth:
                node.node._key === hoverKey ? '1000px' : itemWidth * 1.5,
              zIndex:
                node.node._key === selectedKey || node.node._key === hoverKey
                  ? 999
                  : 'unset',
              overflow: 'hidden',
              transition: 'max-width 1s',
            }}
            onMouseEnter={() => setHoverKey(node.node._key)}
            onMouseLeave={() => setHoverKey(null)}
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              handleClickNode(node);
            }}
          >
            {node.node.itemRender()}
          </div>
          <div
            style={{
              position: 'absolute',
              left: `${node.x + itemWidth / 2}px`,
              bottom: 0,
              height: `${27 + 18 * index + itemHeight * index}px`,
              borderLeft: '1px solid #c7c7c7',
              filter: `grayscale(100%) ${
                node.node._key === selectedKey || node.node._key === hoverKey
                  ? 'brightness(0.8)'
                  : ''
              }`,
            }}
          ></div>
        </div>
      ))}
    </div>
  );
}
