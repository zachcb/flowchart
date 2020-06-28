<template>
  <div class="chart">
    <Nodes>
      <Node
        v-for="({ id, name, coordinates }) of nodes"
        v-bind="{ id, name, coordinates }"
        :key="`node-${id}`"
      ></Node>

      <svg width="100%" height="100%">
        <Connection
          v-for="({ from, to }) of connections"
          v-bind="{
            id: from.id,
            start: from.coordinates,
            end: to.coordinates
          }"
          :key="`node-connection-${from.id}-${to.id}`"
        ></Connection>
      </svg>
    </Nodes>
  </div>
</template>

<script>
import Node from './Node.vue';
import Nodes from './Nodes.vue';
import Connection from './Connection.vue';

export default {
  name: 'Chart',

  components: {
    Node,
    Nodes,
    Connection,
  },

  props: {
    nodes: {
      type: Array,
      default: () => [],
    },

    connections: {
      type: Array,
      default: () => [],
    },
  },

  computed: {
    normalizedNodes() {
      const normalizedNodes = {};

      this.nodes.forEach((node) => {
        normalizedNodes[node.id] = node;
      });

      return normalizedNodes;
    },
  },
};
</script>

<style lang="postcss" scoped>
.chart {
  height: 100%;
  width: 100%;
}
</style>
