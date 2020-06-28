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

function getDepth(entryNodeId, targetNodes, propertyName = 'previous') {
  const visitedNodeIds = [];
  let depth = 0;

  const traverse = (id) => {
    visitedNodeIds.push(id);

    if (targetNodes[id]) {
      targetNodes[id][propertyName].forEach((previousId) => {
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

  const activeId = (node.next && node.next[0]) || node.id;
  // let activeColumn = 1;
  // let activeRow = 0;

  const traverse = (id, previousCoordinates = [0, 0]) => {
    if (targetNodes[id]) {
      const [previousColumn, previousRow] = previousCoordinates;
      const { previous } = targetNodes[id];
      let column = 0;
      let row = 0;

      nodes[id] = targetNodes[id];

      // Check if previous node has multiple next items

      if (previous.length === 0) {
        row = previousRow + 1;
        nodes[id].coordinates = [column, row];
      } else if (previous.length === 1) {
        column = previousColumn + 1;
        nodes[id].coordinates = [column, row];
      } else if (previous.length > 1) {
        column = getDepth(id, targetNodes, 'previous');
        nodes[id].coordinates = [column, row];
      }

      // if (next.length > 1) {
      //   // column = getDepth(id, targetNodes, 'next');
      //   nodes[id].coordinates = [column, row];
      // } else if (next.length === 0) {
      //   row = 0;
      // }

      targetNodes[id].next.forEach((nextId) => traverse(nextId, [column, row]));
    }
  };

  traverse(activeId);

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
