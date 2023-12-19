<template>
    <div class="box">
        <div class="left">
            <el-card>
                <div class="left-box">
                    <div class="left-top">
                        <el-button :type="isAllCycle ? '' : 'primary'" @click="clickCurrentCycle">当前周期</el-button>
                        <el-button :type="isAllCycle ? 'primary' : ''" @click="clickAllCycle">全部周期</el-button>
                    </div>

                    <div class="left-center">
                        <div class="parent">
                            <div class="item" style="background-color: #409EFF"><span>检测点数: {{ isAllCycle ? allDetected : currentDetected }}</span></div>
                            <div class="item" style="background-color: #67C23A"><span>可达点数: {{ isAllCycle ? allReachableCount : currentReachableCount }}</span><span>不可达点数: {{ isAllCycle ? allUnreachableCount : currentUnreachableCount }}</span></div>
                        </div>
                        <div class="parent">
                            <div class="item" style="background-color: #E6A23C"><span>泄漏点数: {{ isAllCycle ? allLeakFix : currentLeakFix }}</span><span>维修点数: {{ isAllCycle ? allLeakFix : currentLeakFix }}</span></div>
                            <div class="item" style="background-color: #F56C6C"><span>延迟修复点数: {{ isAllCycle ? allDelayFix : currentDelayFix }}</span></div>
                        </div>
                    </div>

                    <div class="left-bottom" id="leak"></div>
                </div>
            </el-card>
        </div>

        <div class="right">
            <div>
                <el-card>
                    <el-table :data="tableData" border style="width: 100%; font-size: 10px;">
                        <el-table-column align="center" type="index" label="序号"></el-table-column>
                        <el-table-column align="center" prop="device" label="装置名称"></el-table-column>
                        <!-- <el-table-column align="center" prop="cycle" label="周期"></el-table-column> -->
                        <el-table-column align="center" prop="totalPoint" label="总点数"></el-table-column>
                        <el-table-column align="center" prop="detectedPoint" label="已检点"></el-table-column>
                        <el-table-column align="center" prop="finishRatio" label="完成率"></el-table-column>
                        <el-table-column align="center" prop="leakPoint" label="泄漏点"></el-table-column>
                        <el-table-column align="center" prop="leakRatio" label="泄漏率"></el-table-column>
                        <el-table-column align="center" prop="delayFix" label="延迟修复"></el-table-column>
                    </el-table>
                </el-card>
            </div>

            <div style="margin-top: 20px">
                <el-card>
                    <el-table :data="fileTable" border style="width: 100%; font-size: 10px">
                        <el-table-column align="center" type="index" label="序号"></el-table-column>
                        <el-table-column prop="year" label="年份" align="center"></el-table-column>
                        <el-table-column prop="quarter" label="季度" align="center" width="120"></el-table-column>
                        <el-table-column prop="fileName" label="文件名" align="center"></el-table-column>
                        <el-table-column prop="fileType" label="文件类型" align="center"></el-table-column>
                        <el-table-column prop="createDate" label="上传时间" align="center"></el-table-column>
                        <el-table-column prop="createUser" label="上传人" align="center"></el-table-column>
                        <el-table-column label="操作" align="center">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-download" size="mini" @click="download(scope.row)">下载</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </div>
        </div>
    </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
    data() {
		return {
            isAllCycle: true,
            tableData: [],
            fileTable: [],
            current: {
                device: [],
                data: []
            },
            all: {
                device: [],
                data: []
            },
            currentDetected: 0,
            currentLeakFix: 0,
            currentDelayFix: 0,
            currentUnreachableCount: 0,
            currentReachableCount: 0,
            allDetected: 0,
            allLeakFix: 0,
            allDelayFix: 0,
            allUnreachableCount: 0,
            allReachableCount: 0,
		}
    },
    methods: {
        async leak(option){
            if (option === 'all') {
                await this.getAllCycle()
                option = this.all
            } else {
                await this.getCurrentCycle()
                option = this.current
            }

			// 基于准备好的dom，初始化echarts实例
			const myChart = echarts.init(document.getElementById('leak'))

			// 绘制图表
			myChart.setOption({
				title: {
					text: '泄露点数',
					left: 'left'
				},
				legend: {
					orient: 'vertical',
					left: 'right'
				},
				tooltip: {},
				xAxis: { 
                    type: 'category',
                    data: option.device
                },
				yAxis: {},
				series: [
                    { 
                        type: 'bar',
                        data: option.data
                    }
                ]
			})
		},
        clickCurrentCycle() {
            this.isAllCycle = false
            this.leak('current')
        },
        clickAllCycle() {
            this.isAllCycle = true
            this.leak('all')
        },
        async getCurrentCycle() {
            const { data: result } = await this.$http.get('/firstPage/currentCycle')
            const current = result.data
            this.currentDetected = current.detected
            this.currentLeakFix = current.leakFix
            this.currentDelayFix = current.delayFix
            this.currentUnreachableCount = current.unreachableCount
            this.currentReachableCount = current.reachableCount
            this.current.device = []
            this.current.data = []
            for (let item of current.deviceLeakArr) {
                this.current.device.push(item.name)
                this.current.data.push(item.value)
            }
            this.tableData = all.tableData.map(item => {
            	item.finishRatio = (item.detectedPoint / item.totalPoint * 100).toFixed(2) + '%'
				item.leakRatio = (item.leakPoint / item.totalPoint * 100).toFixed(2) + '%'

                return item
            })
        },
        async getAllCycle() {
            const { data: result } = await this.$http.get('/firstPage/allCycle')
            const all = result.data
            this.allDetected = all.detected
            this.allLeakFix = all.leakFix
            this.allDelayFix = all.delayFix
            this.allUnreachableCount = all.unreachableCount
            this.allReachableCount = all.reachableCount
            this.all.device = []
            this.all.data = []
            for (let item of all.deviceLeakArr) {
                this.all.device.push(item.name)
                this.all.data.push(item.value)
            }
            this.tableData = all.tableData.map(item => {
            	item.finishRatio = (item.detectedPoint / item.totalPoint * 100).toFixed(2) + '%'
				item.leakRatio = (item.leakPoint / item.totalPoint * 100).toFixed(2) + '%'

                return item
            })
        },
		async queryDetectFile() {
			const { data: result } = await this.$http.get('/uploadDetectionLedger/queryDetectFile', { params: this.udfForm })
			this.fileTable = result.data.map(v => {
				v.createDate = this.$moment(v.createDate).format("YYYY-MM-DD HH:mm:ss")
				return v
			})
		},
        async download(row){
			window.open('https://www.mmldar.com/api' + row.filePath, 'self')
		},
    },
    created() {
        this.queryDetectFile()
    },
    mounted() {
		this.leak('all')
	}
}
</script>

<style lang="less" scoped>
.box {
    display: flex;
	flex-direction: row;
}

.left {
    width: 35%;
    margin-right: 10px;
}

.right {
    width: 65%;
}

.left-box{
}

.left-top {
    display: flex; 
    flex-direction: row; 
    justify-content: center;
}

.left-center {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-top: 30px;
}

.left-bottom {
    width: 100%; 
    height: 250px; 
    margin-top: 30px;
}

.parent {
    display: flex;
    justify-content: space-between;
}

.item {
    width: 50%;
    margin: 10px;
    height: 100px;
    border-radius: 10px;
    box-shadow: 0 0 2px 0px #3F85ED;
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #3F85ED; 
    color: white;
}
</style>
