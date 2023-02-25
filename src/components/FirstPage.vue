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
                            <div class="item"><span>检测点数: 19083</span></div>
                            <div class="item"><span>可达点数: 18644</span><span>可达点数: 18644</span></div>
                        </div>
                        <div class="parent">
                            <div class="item"><span>泄漏点数: 110</span><span>维修点数: 110</span></div>
                            <div class="item"><span>延迟修复点数: 0</span></div>
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
                        <el-table-column align="center" prop="cycle" label="周期"></el-table-column>
                        <el-table-column align="center" prop="totalPoint" label="总点数"></el-table-column>
                        <el-table-column align="center" prop="haveCheckPoint" label="已检点"></el-table-column>
                        <el-table-column align="center" prop="completionRate" label="完成率"></el-table-column>
                        <el-table-column align="center" prop="leakPoint" label="泄漏点"></el-table-column>
                        <el-table-column align="center" prop="leakRate" label="泄漏率"></el-table-column>
                        <el-table-column align="center" prop="delayedFix" label="延迟修复"></el-table-column>
                    </el-table>
                </el-card>
            </div>

            <div style="margin-top: 20px">
                <el-card>
                    <el-table :data="fileTable" border style="width: 100%; font-size: 10px">
                        <el-table-column align="center" type="index" label="序号"></el-table-column>
                        <el-table-column align="center" prop="cycleNum" label="周期编号"></el-table-column>
                        <el-table-column align="center" prop="fileType" label="文件类型"></el-table-column>
                        <el-table-column align="center" prop="fileName" label="文件名称"></el-table-column>
                        <el-table-column align="center" prop="uploadTime" label="上传时间"></el-table-column>
                        <el-table-column align="center" width="70px" label="下载">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-download" size="mini"> </el-button>
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
            tableData: [
                { 
                    device: '丙溴磷装置', 
                    cycle: '半年度检测', 
                    totalPoint: '3519', 
                    haveCheckPoint: '3519', 
                    completionRate: '100%', 
                    leakPoint: '0',
                    leakRate: '0%',
                    delayedFix: '0'
                },
                {
                    device: '丙溴磷装置', 
                    cycle: '半年度检测', 
                    totalPoint: '3519', 
                    haveCheckPoint: '3519', 
                    completionRate: '100%', 
                    leakPoint: '0',
                    leakRate: '0%',
                    delayedFix: '0'
                },
                { 
                    device: '丙溴磷装置', 
                    cycle: '半年度检测', 
                    totalPoint: '3519', 
                    haveCheckPoint: '3519', 
                    completionRate: '100%', 
                    leakPoint: '0',
                    leakRate: '0%',
                    delayedFix: '0'
                },
                { 
                    device: '丙溴磷装置', 
                    cycle: '半年度检测', 
                    totalPoint: '3519', 
                    haveCheckPoint: '3519', 
                    completionRate: '100%', 
                    leakPoint: '0',
                    leakRate: '0%',
                    delayedFix: '0'
                },
                { 
                    device: '丙溴磷装置', 
                    cycle: '半年度检测', 
                    totalPoint: '3519', 
                    haveCheckPoint: '3519', 
                    completionRate: '100%', 
                    leakPoint: '0',
                    leakRate: '0%',
                    delayedFix: '0'
                }
            ],
            fileTable: [
                {
                    cycleNum: '2022-First-Ldar-Quarter',
                    fileType: '现场检测照片',
                    fileName: '宝灵二季度.zip',
                    uploadTime: '2022-04-05T17:37:33.57',
                    leakPoint: ''
                },
                {
                    cycleNum: '2022-First-Ldar-Quarter',
                    fileType: '可行性分析',
                    fileName: '宝灵装置分析.zip',
                    uploadTime: '2022-04-05T17:37:33.57',
                    leakPoint: ''
                },
                {
                    cycleNum: '2022-First-Ldar-Quarter',
                    fileType: '现场检测照片',
                    fileName: '检测照片.rar',
                    uploadTime: '2022-04-05T17:37:33.57',
                    leakPoint: ''
                }
            ],
            current: {
                device: [ '二甲基苯胺B车间', '甲霜灵车间', '霜霉威装置' ],
                data: [ 1, 3, 1 ]
            },
            all: {
                device: [ '2,6-二甲基苯胺装置A', '丙溴磷装置', '二甲基苯胺B车间', '罐区', '甲霜灵车间', '甲霜灵装置', '乳油配制车间', '霜霉威装置' ],
                data: [ 2, 3, 1, 8, 3, 90, 2, 1 ]
            }
		}
    },
    methods: {
        leak(option){
            if (!option) option = this.all

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
            this.leak(this.current)
        },
        clickAllCycle() {
            this.isAllCycle = true
            this.leak(this.all)
        }
    },
    created() {
    },
    mounted() {
		this.leak()
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
