<template>
  <div :id="`node-${id}`" :style="styles" class="node">
    <div class="content">
      <span class="name">{{ name }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Node',

  props: {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    coordinates: {
      type: Array,
      required: true,
    },
  },

  computed: {
    styles() {
      const [x, y] = this.coordinates;

      return {
        left: `${x}px`,
        top: `${y}px`,
      };
    },
  },
};
</script>

<style lang="postcss" scoped>
.node {
  position: absolute;

  height: 50px;
  width: 50px;
}

.content {
  position: relative;

  height: 100%;
  width: 100%;

  border-radius: 50%;
  background: rgba(0, 0, 0, 0.25);
}

.name {
  position: absolute;

  top: -18px;
  left: 0;

  font-size: 14px;
  min-width: 100%;
}
</style>
