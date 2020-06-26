<template>
  <div id="app">
    <Chart v-bind="{ nodes: chart.data, connections: chart.connections }" />
  </div>
</template>

<script>
import steps from '@/data/example.json';
import prepareChart from '@/utils/chart';
import Chart from './components/Chart.vue';

export default {
  name: 'App',

  components: {
    Chart,
  },

  computed: {
    chart() {
      return prepareChart(steps.data.nodes, {
        padding: 0,
        width: 100,
        height: 100,
      });
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
