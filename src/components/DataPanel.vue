<template>
    <div class="panel">
		<div class="top">
			<div class="top-item"></div>
			<div class="top-item"></div>
			<div class="top-item"></div>
			<div class="top-item"></div>
			<div class="top-item"></div>
		</div>

		<div class="middle">
			<div class="middle-item"></div>
			<div class="middle-item"></div>
			<div class="middle-item"></div>
		</div>

		<div class="bottom">
			<div id="main" class="bottom-item"></div>
			<div class="bottom-item"></div>
			<div class="bottom-item"></div>
		</div>
  	</div>
</template>

<script>
import * as echarts from 'echarts'
export default {
	name: 'HelloWorld',
	data () {
		return {
			msg: 'Welcome to Your Vue.js App'
		}
	},
	mounted() {
		this.aa()
	},
	methods: {
		aa(){
			// 基于准备好的dom，初始化echarts实例
			var myChart = echarts.init(document.getElementById('main'));
			// 绘制图表
			myChart.setOption({
				title: {
					text: 'ECharts 入门示例'
				},
				tooltip: {},
				xAxis: {
					data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
				},
				yAxis: {},
				series: [
					{
						name: '销量',
						type: 'bar',
						data: [5, 20, 36, 10, 10, 20]
					}
				]
			});
		
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