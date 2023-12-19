<template>
    <div>
		<el-card>
			<el-form ref="calibrationFormRef" :model="calibrationForm" label-width="80px" :inline="true">
                <el-form-item label="校准日期">
                    <el-date-picker
                    v-model="calibrationForm.date"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
					<el-button type="primary" icon="el-icon-search" @click="queryData">查询</el-button>
					<el-button type="primary" icon="el-icon-plus" @click="addCalibrationDialog = true">新增</el-button>
					<el-button type="danger" icon="el-icon-delete" @click="deleteData">删除</el-button>
                </el-form-item>
			</el-form>

			<el-table ref="multipleTable" :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" border style="width: 100%"
			@selection-change="handleSelectionChange">
				<el-table-column fixed type="index" align="center"></el-table-column>
                <el-table-column fixed type="selection" align="center"></el-table-column>
				<el-table-column prop="_id" align="center" v-if="false"></el-table-column>
				<el-table-column fixed prop="consignID" label="委托编号" align="center"></el-table-column>
				<el-table-column fixed prop="calibrationDate" label="校准日期" align="center"></el-table-column>
                <el-table-column fixed prop="instrumentNum" label="仪器编号" align="center"></el-table-column>
				<el-table-column fixed prop="calibrationPeople" label="校准人" align="center"></el-table-column>
				<el-table-column fixed prop="standardGasNum" label="标准气编号" align="center"></el-table-column>
				<el-table-column fixed prop="standardGas" label="标准气名称" align="center"></el-table-column>
				<el-table-column label="检测前校验记录" align="center"> 
					<el-table-column prop="standardGasActual" label="标准值ppm" align="center"></el-table-column>
					<el-table-column prop="value_1" label="测定值ppm(1)" align="center"></el-table-column>
					<el-table-column prop="value_2" label="测定值ppm(2)" align="center"></el-table-column>
					<el-table-column prop="value_3" label="测定值ppm(3)" align="center"></el-table-column>
					<el-table-column prop="average" label="平均值ppm" align="center"></el-table-column>
					<el-table-column prop="valueError" label="示值误差%" align="center"></el-table-column>
					<el-table-column prop="time" label="时间" align="center"></el-table-column>
				</el-table-column>
				<el-table-column label="漂移核查记录" align="center">   
					<el-table-column prop="drift_1" label="测定值ppm(1)" align="center"></el-table-column>
					<el-table-column prop="drift_2" label="测定值ppm(2)" align="center"></el-table-column>
					<el-table-column prop="drift_3" label="测定值ppm(3)" align="center"></el-table-column>
					<el-table-column prop="driftAverage" label="平均值ppm" align="center"></el-table-column>
					<el-table-column prop="driftError" label="漂移误差%" align="center"></el-table-column>
					<el-table-column prop="driftTime" label="时间" align="center"></el-table-column>
				</el-table-column>
			</el-table>

            <el-pagination align='center' @size-change="handleSizeChange" @current-change="handleCurrentChange" 
                :current-page="currentPage" 
                :page-sizes="[1, 5, 10, 20]" 
                :page-size="pageSize" 
                layout="total, sizes, prev, pager, next, jumper" 
                :total="tableData.length">
            </el-pagination>
		</el-card>

		<el-dialog
            title="LDAR校准记录表"
            :visible.sync="addCalibrationDialog"
            width="60%" @close="dialogClose('addCalibrationForm')">
            <el-form :model="addCalibrationForm" ref="addCalibrationFormRef" label-width="70px">
				<el-form-item label="委托编号" prop="consignID">
					<el-input v-model="addCalibrationForm.consignID" clearable style="width: 220px"></el-input>
				</el-form-item>
				<el-form-item label="校准日期" prop="calibrationDate">
				    <el-date-picker
						v-model="addCalibrationForm.calibrationDate"
						type="date"
						placeholder="选择日期"
						clearable>
					</el-date-picker>
				</el-form-item>
				<el-form-item label="仪器设备" prop="instrumentNum">
					<el-select v-model="addCalibrationForm.instrumentNum" style="width: 220px" clearable>
                        <el-option v-for="(item, index) in instrumentNumOptions" :key="index" :label="item" :value="item">
                        </el-option>
                    </el-select>
				</el-form-item>
				<el-form-item label="校准人" prop="calibrationPeople">
					<el-input v-model="addCalibrationForm.calibrationPeople" clearable style="width: 220px"></el-input>
				</el-form-item>
				<table border="1"  cellspacing="0" cellpadding="10">
					<tr align="center">
						<td rowspan="2">校准项目ppm</td>
						<td rowspan="2">标准物质编号</td>
						<td rowspan="2">标准值ppm</td>
						<td colspan="4">检测前校准记录</td>
						<td colspan="4">漂移核查记录</td>
					</tr>
					<tr>
						<td>测定值ppm</td>
						<td>平均值ppm</td>
						<td>示值误差%</td>
						<td width="10%">时间</td>
						<td>测定值ppm</td>
						<td>平均值ppm</td>
						<td>示值误差%</td>
						<td width="10%">时间</td>
					</tr>
					<tr>
						<td rowspan="3" contentEditable="true" class="standardGas">O2(21%)</td>
						<td rowspan="3" contentEditable="true" class="standardGasNum"></td>
						<td rowspan="3" contentEditable="true" class="standardGasActual"></td>
						<td contentEditable="true" class="value_1"></td>
						<td rowspan="3" contentEditable="true" class="average"></td>
						<td rowspan="3" contentEditable="true" class="valueError"></td>
						<td rowspan="3" contentEditable="true" class="time"></td>
						<td contentEditable="true" class="drift_1"></td>
						<td rowspan="3" contentEditable="true" class="driftAverage"></td>
						<td rowspan="3" contentEditable="true" class="driftError"></td>
						<td rowspan="3" contentEditable="true" class="driftTime"></td>
					</tr>
					<tr>
						<td contentEditable="true" class="value_2"></td>
						<td contentEditable="true" class="drift_2"></td>
					</tr>
					<tr>
						<td contentEditable="true" class="value_3"></td>
						<td contentEditable="true" class="drift_3"></td>
					</tr>

					<tr>
						<td rowspan="3" contentEditable="true" class="standardGas">CH4(500)</td>
						<td rowspan="3" contentEditable="true" class="standardGasNum"></td>
						<td rowspan="3" contentEditable="true" class="standardGasActual"></td>
						<td contentEditable="true" class="value_1"></td>
						<td rowspan="3" contentEditable="true" class="average"></td>
						<td rowspan="3" contentEditable="true" class="valueError"></td>
						<td rowspan="3" contentEditable="true" class="time"></td>
						<td contentEditable="true" class="drift_1"></td>
						<td rowspan="3" contentEditable="true" class="driftAverage"></td>
						<td rowspan="3" contentEditable="true" class="driftError"></td>
						<td rowspan="3" contentEditable="true" class="driftTime"></td>
					</tr>
					<tr>
						<td contentEditable="true" class="value_2"></td>
						<td contentEditable="true" class="drift_2"></td>
					</tr>
					<tr>
						<td contentEditable="true" class="value_3"></td>
						<td contentEditable="true" class="drift_3"></td>
					</tr>

					<tr>
						<td rowspan="3" contentEditable="true" class="standardGas">CH4(5000)</td>
						<td rowspan="3" contentEditable="true" class="standardGasNum"></td>
						<td rowspan="3" contentEditable="true" class="standardGasActual"></td>
						<td contentEditable="true" class="value_1"></td>
						<td rowspan="3" contentEditable="true" class="average"></td>
						<td rowspan="3" contentEditable="true" class="valueError"></td>
						<td rowspan="3" contentEditable="true" class="time"></td>
						<td contentEditable="true" class="drift_1"></td>
						<td rowspan="3" contentEditable="true" class="driftAverage"></td>
						<td rowspan="3" contentEditable="true" class="driftError"></td>
						<td rowspan="3" contentEditable="true" class="driftTime"></td>
					</tr>
					<tr>
						<td contentEditable="true" class="value_2"></td>
						<td contentEditable="true" class="drift_2"></td>
					</tr>
					<tr>
						<td contentEditable="true" class="value_3"></td>
						<td contentEditable="true" class="drift_3"></td>
					</tr>
				</table>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCalibrationDialog = false">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </span>
        </el-dialog>
	</div>
</template>

<script>
export default {
    data() {
		return {
			tableData: [],
			calibrationForm: {
				date: null,
			},
			addCalibrationForm: {
				consignID: '',
				calibrationDate: null,
				instrumentNum: '',
				calibrationPeople: ''
			},
			addCalibrationArr: [
				{
					standardGasNum: '',
					standardGas: '',
					standardGasActual: 0,
					value_1: 0,
					value_2: 0,
					value_3: 0,
					average: 0,
					valueError: 0,
					time: '',
					drift_1: 0,
					drift_2: 0,
					drift_3: 0,
					driftAverage: 0,
					driftError: 0,
					driftTime: '',
				},
				{
					standardGasNum: '',
					standardGas: '',
					standardGasActual: 0,
					value_1: 0,
					value_2: 0,
					value_3: 0,
					average: 0,
					valueError: 0,
					time: '',
					drift_1: 0,
					drift_2: 0,
					drift_3: 0,
					driftAverage: 0,
					driftError: 0,
					driftTime: '',

				},
				{
					standardGasNum: '',
					standardGas: '',
					standardGasActual: 0,
					value_1: 0,
					value_2: 0,
					value_3: 0,
					average: 0,
					valueError: 0,
					time: '',
					drift_1: 0,
					drift_2: 0,
					drift_3: 0,
					driftAverage: 0,
					driftError: 0,
					driftTime: '',
				},
			],
            multipleSelection: [],
			instrumentNumOptions: [],
			currentPage: 1,
            total: 0,
            pageSize: 10,
			addCalibrationDialog: false,
		}
    },
    methods: {
		async queryData() {
			const { data: result } = await this.$http.post('/calibration/queryCalibration', this.calibrationForm)
			const tableData = result.data.map(v => {
				v.calibrationDate = this.$moment(v.calibrationDate).format("YYYY-MM-DD HH:mm:ss")
				return v
			})
			this.tableData = tableData
		},
		async submit() {
			if (!this.addCalibrationForm.consignID || !this.addCalibrationForm.calibrationDate || !this.addCalibrationForm.instrumentNum) {
				this.$message.error('数据填写不完整')
				return
			}

			// 获取table中的数据
			for (const obj of this.addCalibrationArr) {
				for (const key in obj) {
					const elementsWithClass = document.getElementsByClassName(key)
					for (let i = 0; i < elementsWithClass.length; i++) {
						this.addCalibrationArr[i][key] = elementsWithClass[i].textContent
					}

					// 计算平均值、误差
					for (let i = 0; i < elementsWithClass.length; i++) {
						const value_1 = +this.addCalibrationArr[i].value_1
						const value_2 = +this.addCalibrationArr[i].value_2
						const value_3 = +this.addCalibrationArr[i].value_3
						this.addCalibrationArr[i].average = parseFloat(((value_1 + value_2 + value_3) / 3).toFixed(2))
						const standard = +this.addCalibrationArr[i].standardGasActual
						const average = this.addCalibrationArr[i].average
						if (standard === 0) {
							this.addCalibrationArr[i].valueError = 0
						} else {
							this.addCalibrationArr[i].valueError = parseFloat(((average - standard) / standard * 100).toFixed(2))
						}
						
						const drift_1 = +this.addCalibrationArr[i].drift_1
						const drift_2 = +this.addCalibrationArr[i].drift_2
						const drift_3 = +this.addCalibrationArr[i].drift_3
						this.addCalibrationArr[i].driftAverage = parseFloat(((drift_1 + drift_2 + drift_3) / 3).toFixed(2))
						const driftAverage = this.addCalibrationArr[i].driftAverage
						if (average === 0) {
							this.addCalibrationArr[i].driftError = 0
						} else {
							this.addCalibrationArr[i].driftError = parseFloat(((driftAverage - average) / average * 100).toFixed(2))
						}
					}
				}
			}

			const addData = this.addCalibrationArr.map(item => {
				item.consignID = this.addCalibrationForm.consignID
				item.calibrationDate = this.addCalibrationForm.calibrationDate
				item.instrumentNum = this.addCalibrationForm.instrumentNum

				return item
			})

			const { data: result } = await this.$http.post('/calibration/addCalibration', { addData })
			
			if (+result.code === 0) {
				this.$message.success('校准添加成功')
			} else {
				this.$message.error('校准添加失败')
			}

			this.addCalibrationDialog = false

			this.queryData()
		},
		async deleteData() {
			const { data: result } = await this.$http.post('/calibration/deleteCalibration', { deleteData: this.multipleSelection })
			
			if (+result.code === 0) {
				this.$message.success('校准管理删除成功')
			} else {
				this.$message.error('校准管理删除失败')
			}

			this.queryData()
		},
		async queryInstrument() {
			const { data: result } = await this.$http.get('/instrument/queryInstrument')
			this.instrumentNumOptions = result.data.map(item => { return item.instrumentNum })

		},
		handleSizeChange(val){
            this.currentPage = 1
            this.pageSize = val
        },
        handleCurrentChange(val){
            this.currentPage = val
        },
      	handleSelectionChange(val) {
        	this.multipleSelection = val
      	},
		dialogClose(form) {
			
		}
    },
	computed: {

	},
    created() {
        this.queryData()
		this.queryInstrument()
    }
}
</script>

<style lang="less" scoped>
</style>
