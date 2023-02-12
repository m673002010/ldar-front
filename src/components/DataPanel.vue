<template>
    <div class="panel">
		<div class="top">
			<div id="totalPoint" class="top-item">12345</div>
			<div id="staticPoint" class="top-item">12345</div>
			<div id="dynamicPoint" class="top-item">12345</div>
			<div id="reachablePoint" class="top-item">12345</div>
			<div id="unreachablePoint" class="top-item">12345</div>
		</div>

		<div class="middle">
			<div id="annual" class="middle-item"></div>
			<div id="emission" class="middle-item"></div>
			<div id="picture" class="middle-item"></div>
		</div>

		<div class="bottom">
			<div id="seal" class="bottom-item"></div>
			<div id="component" class="bottom-item"></div>
			<div id="law" class="bottom-item"></div>
		</div>
  	</div>
</template>

<script>
import * as echarts from 'echarts'
export default {
	name: 'DataPanel',
	data () {
		return {
			msg: 'Welcome to Your Vue.js App'
		}
	},
	mounted() {
		this.emission()
		this.seal()
		this.component()
	},
	methods: {
		emission(){
			// 基于准备好的dom，初始化echarts实例
			const myChart = echarts.init(document.getElementById('emission'))
			// 绘制图表
			myChart.setOption({
				legend: {},
				tooltip: {},
				dataset: {
					source: [
						['product', '维修前排放量', '维修后排放量', '减排量'],
						['一季度', 43.3, 85.8, 93.7],
						['二季度', 83.1, 73.4, 55.1],
						['三季度', 86.4, 65.2, 82.5],
						['四季度', 72.4, 53.9, 39.1]
					]
				},
				xAxis: { type: 'category' },
				yAxis: {},
				series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }]
			})
		},
		component(){
			const myChart = echarts.init(document.getElementById('component'))
			myChart.setOption({
				title: {
					text: '组件分布类型',
					left: 'center'
				},
				tooltip: {
					trigger: 'item'
				},
				legend: {
					orient: 'vertical',
					left: 'left'
				},
				series: [{
					type: 'pie',
					radius: '50%',
					data: [
						{ value: 1048, name: '开口线管' },
						{ value: 735, name: '泵' },
						{ value: 735, name: '搅拌器' },
						{ value: 1048, name: '连接件' },
						{ value: 735, name: '取样连接系统' },
						{ value: 735, name: '法兰' },
						{ value: 1048, name: '泄压设备' },
						{ value: 735, name: '阀门' }
					],
					emphasis: {
						itemStyle: {
							shadowBlur: 10,
							shadowOffsetX: 0,
							shadowColor: 'rgba(0, 0, 0, 0.5)'
						}
					}
					
				}]
			})
		},
		seal(){
			const myChart = echarts.init(document.getElementById('seal'))
			myChart.setOption({
				title: {
					text: '密封点类型',
					left: 'center'
				},
				tooltip: {
					trigger: 'item'
				},
				legend: {
					orient: 'vertical',
					left: 'left'
				},
				series: [{
					type: 'pie',
					radius: '50%',
					data: [
						{ value: 1048, name: '动密封' },
						{ value: 735, name: '静密封' }
					],
					emphasis: {
						itemStyle: {
							shadowBlur: 10,
							shadowOffsetX: 0,
							shadowColor: 'rgba(0, 0, 0, 0.5)'
						}
					}
					
				}]
			})
		}
	},
}
</script>

<style lang="less" scoped>
	.panel {
		display: flex;
		flex-direction: column;
	}

	.top {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		margin: 10px;
		width: 100%;
		height: 50px;
	}

	.middle {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		margin: 10px;
		width: 100%;
		height: 250px;
	}

	.bottom {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		margin: 10px;
		width: 100%;
		height: 250px;
	}

	.top-item {
		border-radius: 10px;
		box-shadow: 0 0 10px 2px #bdcee0;
		width: 250px;
		height: 100%;
		background-color: white;
	}

	.middle-item {
		border-radius: 10px;
		box-shadow: 0 0 10px 2px #bdcee0;
		width: 450px;
		height: 100%;
		background-color: white;
	}

	.bottom-item {
		border-radius: 10px;
		box-shadow: 0 0 10px 2px #bdcee0;
		width: 450px;
		height: 100%;
		background-color: white;
	}

</style>
