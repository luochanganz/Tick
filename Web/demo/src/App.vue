<template>
  <div>
    <ChartClick msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import ChartClick from './components/ChartClick.vue';

export default {
  name: 'app',
  components: {
    ChartClick
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
