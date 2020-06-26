<template>
  <div class="nodes">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Nodes',
};
</script>

<style lang="postcss" scoped>
.nodes {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
