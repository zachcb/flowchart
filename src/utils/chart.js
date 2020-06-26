// targetIds.forEach((targetId, index) => {
//   const node = targetNodes[targetId];
//   // const [column, row] = coordinates;

//   if (index > 0) {
//     nodes[targetId] = node;
//   } else {
//     // const previousNode = targetNodes[targetId];
//     // const [previousColumn, previousRow] = previousCoordinates;

//   }
// });

/*
 * This is needed to allow for space between grid items that have branches
 * that are longer than others.
 *
 *
 * 1. Place index node
 * 2. Go through next node list
 * 3. For each node, traverse tree and find branch with largest depth
 * 4. Use depth to offset next node
 * 5. Traverse tree again, but place nodes in columns/rows
 * 6. Allow for this to be reversed
 *
*/

function isEmpty(target) {
  return (
    Object.entries(target).length === 0
    && target.constructor === Object
  );
}

function getDepth(entryNodeId, targetNodes) {
  const visitedNodeIds = [];
  let depth = 0;
  // const node = targetNodes[entryNodeId];
  // const depth = findTreeDepth(node.id, targetNodes, totalDepth);

  const traverse = (id) => {
    visitedNodeIds.push(id);

    if (targetNodes[id]) {
      targetNodes[id].previous.forEach((previousId) => {
        const tmpDepth = traverse(previousId);
        depth += 1;
        if (tmpDepth > depth) {
          depth = tmpDepth;
        }
      });
    }
  };

  traverse(entryNodeId);

  return depth;
}

function positionNodes(targetIds, targetNodes) {
  const nodes = {};
  const node = targetNodes[targetIds[0]];

  nodes[node.id] = node;

  if (node.previous.length > 0) {
    return nodes;
  }

  const traverse = (id) => {
    if (targetNodes[id]) {
      targetNodes[id].next.forEach((nextId) => {
        const depth = getDepth(nextId, targetNodes);
        const [columns, rows] = node.coordinates;

        console.log(depth);

        nodes[nextId] = { ...targetNodes[nextId], coordinates: [columns + depth, rows] };

        traverse(nextId);
      });
    }
  };

  traverse(node.id);

  return nodes;
}

function applySettings(targetIds, targetNodes, settings = {}) {
  if (isEmpty(settings)) {
    return targetNodes;
  }

  const nodes = {};

  targetIds.forEach((targetId) => {
    if (targetNodes[targetId]) {
      const { coordinates } = targetNodes[targetId];
      const [column, row] = coordinates;

      nodes[targetId] = {
        ...targetNodes[targetId],
        coordinates: [
          (column * settings.width) + settings.padding,
          (row * settings.height) + settings.padding,
        ],
      };
    }
  });

  return nodes;
}

function createConnections(targetIds, targetNodes, settings = {}) {
  if (isEmpty(settings)) {
    return targetNodes;
  }

  const connections = [];

  targetIds.forEach((targetId) => {
    if (targetNodes[targetId]) {
      const { coordinates, next } = targetNodes[targetId];
      const [width, height] = coordinates;

      // Normalize data, move nested loop.
      next.forEach((nextId) => {
        if (targetNodes[nextId]) {
          const [nextWidth, nextHeight] = targetNodes[nextId].coordinates;

          const nextConnection = {
            from: {
              id: targetId,
              coordinates: [
                width + settings.width / 2,
                height + (settings.height / 4),
              ],
            },
            to: {
              id: nextId,
              coordinates: [
                nextWidth,
                nextHeight + (settings.height / 4),
              ],
            },
          };

          connections.push(nextConnection);
        }
      });
    }
  });

  return connections;
}

function initialize(targetNodes = [], settings = {}) {
  let nodes = {};
  let ids = [];

  ids = targetNodes.map((node) => node.id);

  targetNodes.forEach((node) => {
    nodes[node.id] = { ...node, coordinates: [0, 0] };
  });

  ids.sort((id) => nodes[id] - nodes[id]);

  nodes = positionNodes(ids, nodes, settings);
  nodes = applySettings(ids, nodes, settings);
  const connections = createConnections(ids, nodes, settings);

  console.log(ids.map((id) => nodes[id]).filter((id) => id));
  console.log(connections);

  return {
    data: ids.map((id) => nodes[id]).filter((id) => id),
    connections,
  };
}

export default initialize;
