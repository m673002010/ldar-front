<template>
    <div class="panel">
		<div class="top">
			<div id="totalPoint" class="top-item">
				<el-progress type="circle" :percentage="totalPercent" :stroke-width="15" :format="totalFormat"></el-progress>
			</div>
			<div id="staticPoint" class="top-item">
				<el-progress type="circle" :percentage="staticPercent" :stroke-width="15" :format="staticFormat"></el-progress>
			</div>
			<div id="dynamicPoint" class="top-item">
				<el-progress type="circle" :percentage="dynamicPercent" :stroke-width="15" :format="dynamicFormat"></el-progress>
			</div>
			<div id="reachablePoint" class="top-item">
				<el-progress type="circle" :percentage="reachablePercent" :stroke-width="15" :format="reachableFormat"></el-progress>
			</div>
			<div id="unreachablePoint" class="top-item">
				<el-progress type="circle" :percentage="unreachablePercent" :stroke-width="15" :format="unreachableFormat"></el-progress>
			</div>
		</div>

		<div class="middle">
			<div id="emission" class="middle-item" style="width: 500px"></div>
			<div id="component" class="middle-item" style="width: 500px"></div>
			<div id="seal" class="middle-item" style="width: 350px"></div>
		</div>

		<div class="bottom">
			<div id="annual" class="bottom-item" style="width: 500px">
				<div style="text-align: center; font-size: 18px; font-weight: 700; color: #4D4D4D"><span>年度检测记录</span></div>
				<el-table cell-style="text-align:center" :data="tableData" border style="width: 100%; font-size: 10px" :cell-style="{padding: '0', height: '25px'}">
					<el-table-column align="center" prop="category" label="2022"></el-table-column>
					<el-table-column align="center" prop="first" label="一季度"></el-table-column>
					<el-table-column align="center" prop="second" label="二季度"></el-table-column>
					<el-table-column align="center" prop="third" label="三季度"></el-table-column>
					<el-table-column align="center" prop="fourth" label="四季度"></el-table-column>
				</el-table>
			</div>
			<div id="law" class="bottom-item" style="width: 500px">
				<div style="text-align: center; font-size: 18px; font-weight: 700; margin-bottom: 25px">
					<span style="color: #4D4D4D">法律法规</span>
				</div>
				<div class="animateList">
					<animateList :List="pdfList"></animateList>
				</div>
			</div>
			<div id="picture" class="bottom-item" style="width: 350px">
				<div style="text-align: center; font-size: 18px; font-weight: 700; color: #4D4D4D"><span>现场</span></div>
				<div>
					<el-carousel style="text-align: center; height: 225px" indicator-position="none"  arrow="never">
						<el-carousel-item v-for="(item, index) in picList" :key="index" style="height: 225px">
							<img :src="item" style="width: 175px; height: 225px; border-radius: 10px">
						</el-carousel-item>
					</el-carousel>
				</div>
			</div>
		</div>
  	</div>
</template>

<script>
import * as echarts from 'echarts'
import animateList from './AnimateList.vue' // 引入子组件路径
export default {
	name: 'dataPanel',
	data () {
		return {
			tableData: [
				{ category: '应测', first: '1542', second: '10908', third: '16025', fourth: '16025' },
				{ category: '实测', first: '1542', second: '10908', third: '16025', fourth: '16025' },
				{ category: '泄漏点数', first: '1542', second: '10908', third: '16025', fourth: '16025' },
				{ category: '维修前排放量', first: '1542', second: '10908', third: '16025', fourth: '16025' },
				{ category: '维修后排放量', first: '1542', second: '10908', third: '16025', fourth: '16025' },
				{ category: '减排量', first: '1542', second: '10908', third: '16025', fourth: '16025' }
			],
			picList: [
			 	'http://175.178.8.213:3002/picture/P1.jpg',
				'http://175.178.8.213:3002/picture/P2.jpg',
				'http://175.178.8.213:3002/picture/P3.jpg',
				'http://175.178.8.213:3002/picture/P4.jpg',
				'http://175.178.8.213:3002/picture/P5.jpg'
			],
			pdfList: [
				'http://175.178.8.213:3002/pdf/广东省LDAR实施的技术要求.pdf',
				'http://175.178.8.213:3002/pdf/江苏省泄漏检测与修复(LDAR)实施技术指南.pdf',
				'http://175.178.8.213:3002/pdf/上海市设备泄漏挥发性有机物排放控制技术规程.pdf',
				'http://175.178.8.213:3002/pdf/石化行业泄漏检测与修复工作指南.pdf',
				'http://175.178.8.213:3002/pdf/石化行业VOCs污染源排查工作指南.pdf',
				'http://175.178.8.213:3002/pdf/石油化学工业污染物排放标准.pdf',
			],
			totalPoint: 16025,
			staticPoint: 12911,
			dynamicPoint: 3114,
			reachablePoint: 15874,
			unreachablePoint: 151,
			totalPercent: 0,
			staticPercent: 0,
			dynamicPercent: 0,
			reachablePercent: 0,
			unreachablePercent: 0
		}
	},
	methods: {
		emission(){
			// 基于准备好的dom，初始化echarts实例
			const myChart = echarts.init(document.getElementById('emission'))
			// 绘制图表
			myChart.setOption({
				title: {
					text: '排放量',
					left: 'center'
				},
				legend: {
					orient: 'vertical',
					left: 'right'
				},
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
		},
		totalFormat (percentage) {
			return `总点数: ${this.totalPoint}`
		},
		staticFormat (percentage) {
			return `静密封点数: ${this.staticPoint}`
		},
		dynamicFormat (percentage) {
			return `动密封点数: ${this.dynamicPoint}`
		},
		reachableFormat (percentage) {
			return `可达点数: ${this.reachablePoint}`
		},
		unreachableFormat (percentage) {
			return `不可达点数: ${this.unreachablePoint}`
		},
		async increase() {
			this.totalPercent = this.totalPoint / this.totalPoint * 100
			this.staticPercent = this.staticPoint / this.totalPoint * 100
			this.dynamicPercent = this.dynamicPoint / this.totalPoint * 100
			this.reachablePercent = this.reachablePoint / this.totalPoint * 100
			this.unreachablePercent = this.unreachablePoint / this.totalPoint * 100
			await this.sleep(5000)
			this.decrease()
			await this.sleep(1000)
			this.increase()
      	},
		decrease() {
			this.totalPercent = 0
			this.staticPercent = 0
			this.dynamicPercent = 0
			this.reachablePercent = 0
			this.unreachablePercent = 0
		},
		sleep(delay) {
			return new Promise((resolve) => setTimeout(resolve, delay))
		}
	},
	components:{
		animateList
	},
	mounted() {
		this.emission()
		this.seal()
		this.component(),
		this.increase()
	}
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
		height: 125px;
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
		width: 250px;
		height: 100%;
		text-align:center;
	}

	.middle-item {
		border-radius: 10px;
		box-shadow: 0 0 10px 2px #bdcee0;
		// width: 450px;
		height: 100%;
		background-color: white;
	}

	.bottom-item {
		border-radius: 10px;
		box-shadow: 0 0 10px 2px #bdcee0;
		height: 100%;
		background-color: white;
	}
</style>
