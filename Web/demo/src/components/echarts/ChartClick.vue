<template>
  <div>
	  <div id="app" style="width:400px;height:300px;"></div>
	  <div id="app2" style="width:400px;height:300px;"></div>
  </div>
</template>

<script>
var echarts = require('echarts/lib/echarts');
require("echarts/lib/chart/line");
require("echarts/lib/component/grid");
require("echarts/lib/component/dataZoom");
require("echarts/lib/component/toolbox");
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
require("echarts/lib/component/markLine");
require("echarts/lib/component/axisPointer");
require("echarts/lib/component/legendScroll");

export default {
  name: 'app',
  mounted:function()
  {
	  this.$nextTick(function()
	  {
		  this.initClickDemo();
		  this.initClickWithMarkLine();
	  })
  },
  methods: {
    initClickDemo:function()
	{
		let option = {
			xAxis: {
				type: 'category',
				data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
			},
			yAxis: {
				type: 'value'
			},
			series: [{
				data: [820, 932, 901, 934, 1290, 1330, 1320],
				type: 'line'
			}]
		};

		let dom = document.getElementById('app');
		let chartInstance = echarts.init(dom);
		chartInstance.setOption(option);

		chartInstance.off('click');//取消监听点击事件,也可以防止重复绑定
		chartInstance.on('click',function(param)
		{
			console.log(param);
		});
	},
	initClickWithMarkLine:function()
	{
		let xAxisData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
		let option = {
			xAxis: {
				type: 'category',
				data: xAxisData,
			},
			yAxis: {
				type: 'value'
			},
			series: [{
				data: [820, 932, 901, 934, 1290, 1330, 1320],
				type: 'line'
			}]
		};

		let dom = document.getElementById('app2');
		let chartInstance = echarts.init(dom);
		chartInstance.setOption(option);

		let self = this;
		chartInstance.getZr().off('click');//取消监听点击事件,也可以防止重复绑定
		chartInstance.getZr().on('click',function(param)
		{
				let x = param.offsetX;
				let y = param.offsetY;
				let result = chartInstance.convertFromPixel({
					seriesIndex:0,
					xAxisIndex:0,
				},[x,y]);
				let index = result[0];
				let xAxis =xAxisData[index];
				console.log(xAxis);
				self.setMarkLine(xAxis,chartInstance);
		});
	},
	setMarkLine:function(xAxis,chartInstance)
	{
		let markLine = { 
			silent:true, //取消标线的点击事件
			animation:false, //不播放标线的动画
			data: [{					
				name: xAxis,
				xAxis: xAxis, //表示标注 x=xAxis的线, 具体配置项可以参考 https://www.echartsjs.com/zh/option.html#series-line.markLine 
				label: {
						silent: true,
						position : 'end',
				}
			}]
		};

		chartInstance.setOption({
			series:{
				markLine:markLine,
			},
		})
	}
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
