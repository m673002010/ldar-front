<template>
    <div class="panel">
		<div class="top">
			<div id="totalPoint" class="top-item">
				<el-progress type="circle" :percentage="totalPercent" :stroke-width="20" :format="totalFormat"></el-progress>
			</div>
			<div id="staticPoint" class="top-item">
				<el-progress type="circle" :percentage="staticPercent" :stroke-width="20" :format="staticFormat"></el-progress>
			</div>
			<div id="dynamicPoint" class="top-item">
				<el-progress type="circle" :percentage="dynamicPercent" :stroke-width="20" :format="dynamicFormat"></el-progress>
			</div>
			<div id="reachablePoint" class="top-item">
				<el-progress type="circle" :percentage="reachablePercent" :stroke-width="20" :format="reachableFormat"></el-progress>
			</div>
			<div id="unreachablePoint" class="top-item">
				<el-progress type="circle" :percentage="unreachablePercent" :stroke-width="20" :format="unreachableFormat"></el-progress>
			</div>
		</div>

		<div class="middle">
			<div id="emission" class="middle-item" style="width: 500px"></div>
			<div id="componentType" class="middle-item" style="width: 500px"></div>
			<div id="sealPointType" class="middle-item" style="width: 350px"></div>
		</div>

		<div class="bottom">
			<div id="annual" class="bottom-item" style="width: 500px">
				<div style="text-align: center; font-size: 18px; font-weight: 700; color: #4D4D4D"><span>年度检测记录</span></div>
				<el-table :data="transData" border style="width: 100%; font-size: 10px" :cell-style="{padding: '0', height: '25px'}">
					<el-table-column v-for="(item, index) in transTitle" :label="item" :key="index" align="center">
						<template slot-scope="scope">
							{{scope.row[index]}}
						</template>
					</el-table-column>
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
			originTitle: [
				'应测点数', 
				'实测点数', 
				'泄漏点数',
				'维修前排放量',
				'维修后排放量',
				'减排量',
			], // originTitle 该标题为 正常显示的标题, 数组中的顺序就是上面数据源对象中的字段标题对应的顺序
			originData: [],
			transTitle: [
				'2023', 
				'第1季度', 
				'第2季度', 
				'第3季度', 
				'第4季度'
			], // transTitle 该标题为转化后的标题, 注意多一列,  因为原来的标题变成了竖着显示了, 所以多一列标题, 第一个为空即可
			transData: [],
			picList: [
			 	'https://www.mmldar.com/api/picture/P1.jpg',
				'https://www.mmldar.com/api/picture/P2.jpg',
				'https://www.mmldar.com/api/picture/P3.jpg',
				'https://www.mmldar.com/api/picture/P4.jpg',
				'https://www.mmldar.com/api/picture/P5.jpg'
			],
			pdfList: [
				'https://www.mmldar.com/api/pdf/广东省LDAR实施的技术要求.pdf',
				'https://www.mmldar.com/api/pdf/江苏省泄漏检测与修复(LDAR)实施技术指南.pdf',
				'https://www.mmldar.com/api/pdf/上海市设备泄漏挥发性有机物排放控制技术规程.pdf',
				'https://www.mmldar.com/api/pdf/石化行业泄漏检测与修复工作指南.pdf',
				'https://www.mmldar.com/api/pdf/石化行业VOCs污染源排查工作指南.pdf',
				'https://www.mmldar.com/api/pdf/石油化学工业污染物排放标准.pdf',
			],
			totalPoint: 0,
			staticPoint: 0,
			dynamicPoint: 0,
			reachablePoint: 0,
			unreachablePoint: 0,
			totalPercent: 0,
			staticPercent: 0,
			dynamicPercent: 0,
			reachablePercent: 0,
			unreachablePercent: 0
		}
	},
	methods: {
		async pointStatic(){
			// 点数统计
			const { data: result } = await this.$http.get('/dataPanel/pointStatic')
			this.totalPoint = result.data.totalPoint
			this.staticPoint = result.data.staticPoint
			this.dynamicPoint = result.data.dynamicPoint
			this.reachablePoint = result.data.reachablePoint
			this.unreachablePoint = result.data.unreachablePoint
		},
		async emission(){
			const { data: result } = await this.$http.get('/hds/historyDetectionStatistics', { params: { year: '2023' } })
			let sourceData = result.data
			sourceData = sourceData.map(item => {
				const obj = { 
					'emissionBeforeRepair': item.emissionBeforeRepair,
					'emissionAfterRepair': item.emissionAfterRepair,
					'emissionDecrease': item.emissionDecrease
				}
				return obj
			})

			const title = [
				'一季度',
				'二季度',
				'三季度',
				'四季度',
			]

            // 数组按矩阵思路, 变成转置矩阵
            let matrixData = sourceData.map((row, i) => {
                const arr = []
                for (let key in row) {
                    arr.push(row[key])
                }
                return [title[i], ...arr]
            })

			// console.log('matrixData', matrixData)

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
						['product', '维修前排放量', '维修后排放量', '减排量'], ...matrixData
					]
				},
				xAxis: { type: 'category' },
				yAxis: {},
				series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }]
			})
		},
		async componentType(){
			const myChart = echarts.init(document.getElementById('componentType'))

			// 组件类型
			const { data: result } = await this.$http.get('/dataPanel/componentType')
			const data = result.data

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
					data,
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
		async sealPointType(){
			const myChart = echarts.init(document.getElementById('sealPointType'))

			// 密封点类型
			const { data: result } = await this.$http.get('/dataPanel/sealPointType')
			const data = result.data

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
					data,
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
		async historyDetectionStatistics() {
			const { data: result } = await this.$http.get('/hds/historyDetectionStatistics', { params: this.hdsForm })
			this.originData = result.data
			this.originData = this.originData.map(item => {
				delete item._id
				delete item.companyNum
				delete item.detectionCycle
				return item
			})

			// console.log('originData', this.originData)

            // 数组按矩阵思路, 变成转置矩阵
            let matrixData = this.originData.map(row => {
                const arr = []
                for (let key in row) {
                    arr.push(row[key])
                }
                return arr
            })
            // console.log('matrixData', matrixData)

            // 加入标题拼接最终的数据
            this.transData = matrixData[0].map((col, i) => {
                return [this.originTitle[i], ...matrixData.map((row) => {
                    return row[i]
                })]
            })
            // console.log('transData', this.transData)
		},
		async increase() {
			this.totalPercent = 100
			this.staticPercent = this.staticPoint / this.totalPoint * 100
			this.dynamicPercent = this.dynamicPoint / this.totalPoint * 100 > 90 ? 90 : this.dynamicPoint / this.totalPoint * 100
			this.reachablePercent = this.reachablePoint / this.totalPoint * 100 > 90 ? 90 : this.reachablePoint / this.totalPoint * 100
			this.unreachablePercent = this.unreachablePoint / this.totalPoint * 100 > 90 ? 90 : this.unreachablePoint / this.totalPoint * 100
			await this.sleep(3000)
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
		this.sealPointType()
		this.componentType()
		this.pointStatic()
		this.historyDetectionStatistics()
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
