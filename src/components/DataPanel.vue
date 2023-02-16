<template>
    <div class="panel">
		<div class="top">
			<div id="totalPoint" class="top-item">
				<div>总点数</div>
				<div class="points"><span>12345</span></div>
			</div>
			<div id="staticPoint" class="top-item">
				<div>静密封点数</div>
				<div class="points"><span>12345</span></div>
			</div>
			<div id="dynamicPoint" class="top-item">
				<div>动密封点数</div>
				<div class="points"><span>12345</span></div>
			</div>
			<div id="reachablePoint" class="top-item">
				<div>可达点数</div>
				<div class="points"><span>12345</span></div>
			</div>
			<div id="unreachablePoint" class="top-item">
				<div>不可达点数</div>
				<div class="points"><span>12345</span></div>
			</div>
		</div>

		<div class="middle">
			<div id="annual" class="middle-item" style="width: 550px">
				<div style="text-align: center; font-size: 18px; font-weight: 700;"><span>年度检测记录</span></div>
				<el-table :data="tableData" border style="width: 100%" :cell-style="{padding: '0', height: '25px'}">
					<el-table-column prop="category" label="2022"></el-table-column>
					<el-table-column prop="first" label="一季度"></el-table-column>
					<el-table-column prop="second" label="二季度"></el-table-column>
					<el-table-column prop="third" label="三季度"></el-table-column>
					<el-table-column prop="fourth" label="四季度"></el-table-column>
				</el-table>
			</div>
			<div id="emission" class="middle-item" style="width: 550px"></div>
			<div id="picture" class="middle-item" style="width: 250px">
				<el-carousel>
					<el-carousel-item v-for="(item, index) in picList" :key="index">
						<img :src="item" width="200px" height="250px">
					</el-carousel-item>
				</el-carousel>
			</div>
		</div>

		<div class="bottom">
			<div id="seal" class="bottom-item"></div>
			<div id="component" class="bottom-item"></div>
			<div id="law" class="bottom-item">
				<div style="text-align: center; font-size: 18px; font-weight: 700;"><span>法律法规</span></div>
				<div>
					<animateList :List="pdfList"></animateList>
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
				'http://175.178.8.213:3002/pdf/石油化学工业污染物排放标准.pdf'
			]
		}
	},
	components:{
        animateList
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
		}
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
		background-color: #81befc;
		color: white;
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
		width: 450px;
		height: 100%;
		background-color: white;
	}

	.points {
		text-align: center;
		font-size: 20px;
	}
</style>
