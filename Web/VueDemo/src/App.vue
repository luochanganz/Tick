<template>
	<div>
		<ChartClick/>
    <ToolTipClick chartKey="a"></ToolTipClick>
    <FlameChart />
		<!-- <Sort/> -->
	</div>
</template>

<script>
import ChartClick from './components/echarts/ChartClick.vue';
import ToolTipClick from './components/echarts/ToolTipClick.vue';
import FlameChart from './components/echarts/FlameChart.vue';
import Sort from './components/algorithm/Sort.vue';

export default {
  name: 'app',
  components: {
    ChartClick,ToolTipClick,FlameChart,
    Sort,
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
