<style>
.lua-flame-chart{
	display: block;
	text-align: center;
	width: 800px;
	height: 800px;
	background-color: rgb(255, 255, 255);
	margin: auto;
}
</style>

<template>
	<div>
		<h1>火焰图演示</h1>
		<div class="lua-flame-chart" :style="chartStyle" ref="flame-chart"></div>
	</div>
</template>

<script>
var echarts = require('echarts/lib/echarts');
require('echarts/lib/chart/custom');
require("echarts/lib/component/grid");
require("echarts/lib/component/dataZoom");
require("echarts/lib/component/tooltip");

import {dom} from '../dom';

export default {
	components:{},
	data(){ 
		const option = 
			{
				grid:{
					show:false,
					left:0,
					right:0,
					top:0,
					bottom:0,
				},
				tooltip: {
					formatter: this.tooltipFormatter,
				},
				dataZoom: {
					type: 'inside',
					disabled:true,
					minValueSpan:1,
					filterMode: 'none',
				},
				xAxis: {
					show:false,
					type:'category',
					min:0,
					boundaryGap:false, //解决火焰图点击栈顶数据时，坐标轴左侧有空白的问题
					data:[],
				},
				yAxis: {
					show:false,
					type:'category',
					min:0,
					data:[] ,
				},
				series: [{
					name:'flame',
					type: 'custom',
					label: {
						show: true,
						formatter:this.lableFormatter,
						color:'#000',
						fontSize: 12,
						position:'insideLeft',
					},
					itemStyle: {
                        opacity : 0.8,
                        borderColor:'#d3eb62',
                        borderWidth: 0.5
                    },
					renderItem:this.renderItem,
					progressive: 0,
					itemStyle: {
						opacity: 0.8
					},
					encode: {
						x: [0,1],
						y: 2,
					},
					//animation :false,
					legendHoverLink :false,
					data: null,
				}],
				color:['#ba3e39', '#c44740', '#cd5048', '#d7584f', '#e16057', '#eb695e', '#f47166'],
				//animation:false,
			};
		return {
			option,
			chartInstance:null,

			totalChartData:{

			},
			nowData:{
				initMinDepth:0, //初始深度
				initXCount:0, //初始x轴长度
				minDepth:0, //当前最小深度
				xCount:1, //当前x轴长度
				width: -1, //当前x轴的像素长度
				minShowCount:1,//最小可渲染的采样次数,元素宽度小于2px的时候不渲染
				charWidth:1, //当前字符的平均宽度,12px的时候
				startValue:0, //当前x轴最小值
				endValue:0, //
				seriesName:'',
			},

			
			chartStyle:{
				height:'100rem',
			}
		};
	},
	computed:{},
	mounted(){

		this.totalChartData = this.createMockData();
		this.initChart();
		this.updateDomSize();
		
		this.$nextTick(()=>
		{
			this.udpateChartStyle();
			this.chartInstance.hideLoading();
			this.updateChartData(this.totalChartData);
		});
	},
	methods:{
        createMockData() {
            return {
                totalSampleCount: 10,
                minDepth: 0,
                maxDepth: 3,
                seriesData: [
                    // startIndex, depth, sampleCount, name
                    [0, 0, 10, 'root'],
                    [2, 1, 2, 'chA'],
                    [4, 1, 4, 'chB'],
                    [5, 2, 3, 'chC'],
                    [2, 2, 1, 'chD'],
					[6, 3, 2, 'chE'],
                ]
            }
        },

		initChart()
		{
			this.chartInstance = echarts.init(this.$refs['flame-chart']);
			this.chartInstance.setOption(this.option);

			this.initClickCallback();
			this.initResizeCallback();
		},
		initResizeCallback()
		{
			window.addEventListener('resize',()=>
			{
				this.updateDomSize();
				this.chartInstance.resize();
			});
		},
		initClickCallback()
		{
			this.chartInstance.off('click');
			this.chartInstance.on('click',(params)=>
			{
				const dataItem = params.data;
				this.zoomInSeries(dataItem);
			});
		},
		zoomInSeries(dataItem)
		{
			const nowData = this.nowData;
			const startValue = dataItem[0];
			const name = dataItem[3];
			const sampleCount = dataItem[2];
			const depth = dataItem[1];
			const endValue = startValue + sampleCount;

			this.nowData.xCount = sampleCount;
			this.nowData.minDepth = depth;
			this.nowData.startValue = startValue;
			this.nowData.endValue = endValue;
			this.nowData.minShowCount = nowData.xCount/(2*nowData.width);
			this.nowData.seriesName = name;
			this.chartInstance.dispatchAction(
				{
					type      : 'dataZoom',
					startValue: startValue,
					endValue  : endValue,
				});
		},
		renderItem(params,api)
		{
			const option = this.option;
			const nowData = this.nowData;
			const maxDepth = this.totalChartData.maxDepth;
			const startValue = api.value(0);
			const depth = api.value(1)
			const sampleCount = api.value(2);

			const endValue = startValue + sampleCount;
			// if(startValue>=nowData.endValue || endValue <= nowData.startValue //解决缩放过滤不够合理的问题
			// 	) 
			// {
			// 	return;
			// }
			const start = api.coord([startValue, maxDepth-depth]);
			const end = api.coord([endValue, maxDepth-depth]);
			const normalSize = api.size([1, 1]);
			const height = normalSize[1];
			const width= end[0]-start[0];
			// if(width<2) //过小的数据不进行渲染，优化效率
			// {
			// 	return;
			// }
			let rectShape = echarts.graphic.clipRectByRect({
				x: start[0],
				y: start[1]-height/2,
				width: width,
				height: normalSize[1],
			}, {
				x: params.coordSys.x,
				y: params.coordSys.y,
				width: params.coordSys.width,
				height: params.coordSys.height
			});

			let style = api.style({
					fill: option.color[parseInt(width%option.color.length)],
				})
			if(depth<nowData.minDepth)
			{
				style=api.style({
					fill: '#808080',
				})
			}

			return rectShape && {
				type: 'rect',
				shape: rectShape,
				style: style
			};
		},
		lableFormatter(params)
		{
			const nowData = this.nowData;
			const xCount = nowData.xCount;
			const width = nowData.width;
			const name = params.data[3];
			const sampleCount = params.data[2];
			let percent = sampleCount/xCount;
			let autoSize = width*percent-10;//留点位置出来
			autoSize = autoSize>0?autoSize:0;

			let avtCharW = nowData.charWidth;
			let strCount =parseInt(autoSize/avtCharW);
			if(autoSize<12)
			{
				return '';
			}
			return name.substr(0,strCount);
		},
		tooltipFormatter(params) 
		{
			const name = params.data[3];
			const sampleCount = params.data[2];
			const depth = params.data[1];
			const xCount = this.nowData.xCount;
			return params.marker + name+" (次数:"+ sampleCount+" 占比:"+(sampleCount*100/xCount).toFixed(2)+"% 深度："+depth+")";
		},
		updateDomSize()
		{
			this.nowData.width = dom.getSize(this.$refs['flame-chart'],'width');
			this.nowData.charWidth = dom.getCommonCharWidth('12px');
		},
		udpateChartStyle()
		{
			this.chartStyle.height = this.totalChartData.maxDepth*1.6+'rem';
			if(this.chartInstance)
			{
				this.$nextTick(()=>
				{
					this.chartInstance.resize();
				})
			}
		},
		updateChartData(data)
		{
			if(!this.chartInstance)
			{
				console.error('chart instace not valid');
				return;
			}

			let yCount = data.maxDepth;
			let xCount = data.totalSampleCount;
			let yAxisData = [];
			let xAxisData = [];

			this.nowData.initMinDepth = data.minDepth;
			this.nowData.initXCount = xCount;
			this.nowData.xCount = xCount;
			this.nowData.startValue = 0;
			this.nowData.endValue = xCount;
			for(let i=0;i<=yCount;++i)
			{
				yAxisData.push(i);
			}
			for(let i=0;i<=xCount;++i)
			{
				xAxisData.push(i);
			}

			this.chartInstance.setOption({
				series:{
					data:data.seriesData,
				},
				xAxis:{
					data:xAxisData,
				},
				yAxis:{
					data:yAxisData
				}
			})
		},
		clearChart()
		{
			if(!this.chartInstance)
			{
				return;
			}
			this.chartStyle.height = '2rem';
			this.$nextTick(()=>
			{
				this.chartInstance.resize();
			})
			this.chartInstance.setOption({
				series:{
					data:[],
				},
				xAxis:{
					data:[],
				},
				yAxis:{
					data:[]
				}
			})
		},
		checkDataValid(value)
		{
			return value.maxDepth !== undefined && value.minDepth !== undefined 
					&& value.totalSampleCount !== undefined
					&& Array.isArray(value.seriesData);
		},

	},
}
</script>