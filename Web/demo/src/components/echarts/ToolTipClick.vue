<template>
	<div>
		<div style="font-size:22px;color:#f00;">当前点击的系列是{{activeSeries}}</div>
		<div :id="chartKey" style="width:400px;height:300px;"></div>
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

let toolTipClickCallback = {

};

window.onClickSeries=function(series,chartkey)
{
	if(toolTipClickCallback[chartkey])
	{
		toolTipClickCallback[chartkey](series);
	}
}

export default {
	name:'tooltip-click',
	components:{},
	props:{
		chartKey:String,
	},
	data(){
		return {
			activeSeries:'',
		};
	},
	mounted(){
		let self = this;
		toolTipClickCallback[this.chartKey] = function(series)
		{
			console.log(series)
			self.activeSeries = series;
		}

		this.$nextTick(()=>
		{
			this.initToolTipClick();
		})
	},
	watch:{},
	methods:{
		initToolTipClick()
		{
			let self = this;
			let option = {
				xAxis: {
					type: 'category',
					data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
					axisPointer: {
								show: true,
					}
				},
				yAxis: {
					type: 'value'
				},
				series: [{
					name:'test1',
					data: [820, 932, 901, 934, 1290, 1330, 1320],
					type: 'line'
				},
				{
					name:'test2',
					data: [800, 900, 905, 935, 1005, 1307, 1320],
					type: 'line'
				}],
				tooltip:{
					enterable:true,
					trigger:'axis',
					transitionDuration: 2,
					formatter:function(param)
					{
						let ret="<div>";
						for(let i in param)
						{
							let toolTipData = param[i];
							ret += '<div style="text-align:left;" ><a href="javascript:void(0);" onclick="onClickSeries(\''+toolTipData.seriesName+'\',\''+self.chartKey+'\')">'+ toolTipData.marker+toolTipData.seriesName +  
									'</a>：<span style="float:right;">' + toolTipData.data +'</span></div>';
						}
						ret+="</div>"
						return ret;
					}
				}
			};

			let dom = document.getElementById(this.chartKey);
			let chartInstance = echarts.init(dom);
			chartInstance.setOption(option);
		},
	},
}
</script>

<style>

</style>