<template>
    <div>
		<el-card>
			<el-form ref="icrFormRef" :model="icrForm" label-width="80px" :inline="true">
                <el-form-item label="校准日期">
                    <el-date-picker
                    v-model="icrForm.calibrationDate"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
				<el-form-item>
					<el-button type="primary" icon="el-icon-search" @click="queryData">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="el-icon-folder-remove" @click="exportData">导出数据</el-button>
				</el-form-item>
			</el-form>

			<el-table ref="multipleTable" :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" border style="width: 100%" @selection-change="handleSelectionChange">
				<el-table-column type="index" align="center"></el-table-column>
				<el-table-column type="selection" align="center"></el-table-column>
				<el-table-column prop="_id" v-if="false" align="center"></el-table-column>
				<el-table-column prop="calibrationDate" label="校准日期" align="center"></el-table-column>
				<el-table-column prop="instrumentNum" label="校准仪器" align="center"></el-table-column>
				<el-table-column prop="dailyCalibration_1" label="日校准值" align="center"></el-table-column>
				<el-table-column prop="dailyCalibration_2" label="日校准值" align="center"></el-table-column>
				<el-table-column prop="dailyCalibration_3" label="日校准值" align="center"></el-table-column>
				<el-table-column prop="driftCalibration_1" label="漂移校准值" align="center"></el-table-column>
				<el-table-column prop="driftCalibration_2" label="漂移校准值" align="center"></el-table-column>
				<el-table-column prop="isCalibration" label="是否校准" align="center"></el-table-column>
				<el-table-column prop="calibrationPeople" label="校准人" align="center"></el-table-column>
			</el-table>

            <el-pagination align='center' @size-change="handleSizeChange" @current-change="handleCurrentChange" 
                :current-page="currentPage" 
                :page-sizes="[1, 5, 10, 20]" 
                :page-size="pageSize" 
                layout="total, sizes, prev, pager, next, jumper" 
                :total="tableData.length">
            </el-pagination>
		</el-card>
	</div>
</template>

<script>
import ExcelJs from "exceljs"

export default {
    data() {
		return {
			tableData: [],
			multipleSelection: [],
			icrForm: {
                calibrationDate: null,
			},
			addIcrForm: {
				calibrationDate: '',
				instrument: '',
				dailyCalibration0: '',
				dailyCalibration500: '',
				dailyCalibration10K: '',
				driftCalibration500: '',
				driftCalibration10K: '',
				isCalibration: '',
				calibrationPeople: '',
			},
			editIcrForm: {
				_id: '',
				calibrationDate: '',
				instrument: '',
				dailyCalibration0: '',
				dailyCalibration500: '',
				dailyCalibration10K: '',
				driftCalibration500: '',
				driftCalibration10K: '',
				isCalibration: '',
				calibrationPeople: '',
			},
			addIcrDialog: false,
			editIcrDialog: false,
			currentPage: 1,
            total: 0,
            pageSize: 10,
		}
    },
    methods: {
		async queryData() {
			const { data: result } = await this.$http.post('/icr/instrumentCalibrationRecord', { params: this.icrForm })
			this.tableData = result.data.map(v => {
				v.calibrationDate = this.$moment(v.calibrationDate).format("YYYY-MM-DD HH:mm:ss")
				return v
			})
		},
		async exportData() {
			const { data: result } = await this.$http.post('/icr/instrumentCalibrationRecord', { params: this.icrForm })
			const exportData = result.data.map(v => {
				v.calibrationDate = this.$moment(v.calibrationDate).format("YYYY-MM-DD HH:mm:ss")
				return v
			})

			const workbook = new ExcelJs.Workbook()
			const worksheet = workbook.addWorksheet('sheet1')
			worksheet.columns = [
				{ header: '校准日期', key: 'calibrationDate' },
				{ header: '校准仪器', key: 'instrumentNum' },
				{ header: '日校准值', key: 'dailyCalibration_1' },
				{ header: '日校准值', key: 'dailyCalibration_2' },
				{ header: '日校准值', key: 'dailyCalibration_3' },
				{ header: '漂移校准值', key: 'driftCalibration_1' },
				{ header: '漂移校准值', key: 'driftCalibration_2' },
				{ header: '是否校准', key: 'isCalibration' },
				{ header: '校准人', key: 'calibrationPeople' },
			]
			worksheet.addRows(exportData)
			const buffer = await workbook.xlsx.writeBuffer()
			const link = document.createElement("a")
			const blobData = new Blob([buffer], { type: "application/vnd.ms-excel;charset=utf-8;" })
			link.download = '仪器管理信息报告.xlsx'
			link.href = URL.createObjectURL(blobData)
			link.click()
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
		dialogClose (form) { // 关闭对话框
            this.$refs[`${form}Ref`].resetFields()
        },
    },
    created() {
		this.queryData()
    }
}
</script>

<style lang="less" scoped>
</style>
