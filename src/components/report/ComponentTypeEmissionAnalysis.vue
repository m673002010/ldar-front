<template>
    <div>
		<el-card>
			<el-form ref="cteaFormRef" :model="cteaForm" label-width="80px" :inline="true">
				<el-form-item label="周期编号">
					<el-select v-model="cteaForm.quarterCode" placeholder="请选择" clearable>
						<el-option
							v-for="(item, index) in quarterCodeOptions"
							:key="index"
							:label="item"
							:value="item">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="el-icon-search" @click="queryData">查询</el-button>
					<el-button type="primary" icon="el-icon-s-data" @click="statistic">统计</el-button>
					<el-button type="success" icon="el-icon-plus" @click="addCteaDialog = true">新增</el-button>
					<el-button type="warning" icon="el-icon-edit" @click="editCtea">编辑</el-button>
					<el-button type="danger" icon="el-icon-delete" @click="deleteCtea">删除</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="el-icon-folder-remove" @click="exportData">导出数据</el-button>
				</el-form-item>
			</el-form>

			<el-table ref="multipleTable" :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" @selection-change="handleSelectionChange" border style="width: 100%">
				<el-table-column type="index" align="center"></el-table-column>
				<el-table-column type="selection" align="center"></el-table-column>
				<el-table-column prop="_id" v-if="false" align="center"></el-table-column>
				<!-- <el-table-column prop="quarterCode" label="周期编号" align="center"></el-table-column> -->
				<el-table-column prop="sealPointType" label="密封点类型" align="center"></el-table-column>
				<el-table-column prop="detectionCount" label="检测个数" align="center"></el-table-column>
				<el-table-column prop="leakCount" label="泄漏个数" align="center"></el-table-column>
				<el-table-column prop="repairCount" label="修复个数" align="center"></el-table-column>
				<el-table-column prop="leakRate" label="泄漏率" align="center"></el-table-column>
				<el-table-column prop="leakRateAfterRepair" label="修复后泄漏率" align="center"></el-table-column>
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
			title="排放量"
			:visible.sync="addCteaDialog"
			width="30%" @close="dialogClose('addCteaForm')">
			<el-form :model="addCteaForm" ref="addCteaFormRef" label-width="100px">
				<el-form-item label="周期编号" prop="quarterCode">
					<el-select v-model="addCteaForm.quarterCode" placeholder="请选择" clearable>
						<el-option v-for="(item, index) in quarterCodeOptions" :key="index" :label="item" :value="item">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="密封点类型" prop="sealPointType">
					<el-input v-model="addCteaForm.sealPointType" clearable></el-input>
				</el-form-item>
				<el-form-item label="检测个数" prop="detectionCount">
					<el-input v-model="addCteaForm.detectionCount" clearable></el-input>
				</el-form-item>
				<el-form-item label="泄漏个数" prop="leakCount">
					<el-input v-model="addCteaForm.leakCount" clearable></el-input>
				</el-form-item>
				<el-form-item label="修复个数" prop="repairCount">
					<el-input v-model="addCteaForm.repairCount" clearable></el-input>
				</el-form-item>
				<el-form-item label="泄漏率" prop="leakRate">
					<el-input v-model="addCteaForm.leakRate" clearable></el-input>
				</el-form-item>
				<el-form-item label="修复后泄漏率" prop="leakRateAfterRepair">
					<el-input v-model="addCteaForm.leakRateAfterRepair" clearable></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addCteaDialog = false">取 消</el-button>
				<el-button type="primary" @click="submit">确 定</el-button>
			</span>
		</el-dialog>

		<el-dialog
			title="排放量"
			:visible.sync="editCteaDialog"
			width="30%" @close="dialogClose('editCteaForm')">
			<el-form :model="editCteaForm" ref="editCteaFormRef" label-width="100px">
				<el-form-item label="周期编号" prop="quarterCode">
					<el-select v-model="editCteaForm.quarterCode" placeholder="请选择" clearable>
						<el-option v-for="(item, index) in quarterCodeOptions" :key="index" :label="item" :value="item">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="密封点类型" prop="sealPointType">
					<el-input v-model="editCteaForm.sealPointType" clearable></el-input>
				</el-form-item>
				<el-form-item label="检测个数" prop="detectionCount">
					<el-input v-model="editCteaForm.detectionCount" clearable></el-input>
				</el-form-item>
				<el-form-item label="泄漏个数" prop="leakCount">
					<el-input v-model="editCteaForm.leakCount" clearable></el-input>
				</el-form-item>
				<el-form-item label="修复个数" prop="repairCount">
					<el-input v-model="editCteaForm.repairCount" clearable></el-input>
				</el-form-item>
				<el-form-item label="泄漏率" prop="leakRate">
					<el-input v-model="editCteaForm.leakRate" clearable></el-input>
				</el-form-item>
				<el-form-item label="修复后泄漏率" prop="leakRateAfterRepair">
					<el-input v-model="editCteaForm.leakRateAfterRepair" clearable></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="editCteaDialog = false">取 消</el-button>
				<el-button type="primary" @click="submitEdit">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import ExcelJs from "exceljs"

export default {
    data() {
		return {
			tableData: [],
			multipleSelection: [],
			cteaForm: {
				quarterCode: ''
			},
			addCteaForm: {
				quarterCode: '',
				sealPointType: '',
				detectionCount: '',
				leakCount: '',
				repairCount: '',
				leakRate: '',
				leakRateAfterRepair: '',
			},
			editCteaForm: {
				_id: '',
				quarterCode: '',
				sealPointType: '',
				detectionCount: '',
				leakCount: '',
				repairCount: '',
				leakRate: '',
				leakRateAfterRepair: '',
			},
			quarterCodeOptions: [],
			addCteaDialog: false,
			editCteaDialog: false,
			currentPage: 1,
            total: 0,
            pageSize: 10,
		}
    },
    methods: {
		async queryData() {
			const { data: result } = await this.$http.get('/ctea/componentTypeEmissionAnalysis', { params: this.cteaForm })
			this.tableData = result.data
		},
		async statistic () {
			await this.$http.post('/ctea/statisticCtea', this.cteaForm)
			this.queryData()
		},
		async exportData() {
			const { data: result } = await this.$http.get('/ctea/componentTypeEmissionAnalysis', { params: this.cteaForm })
			const exportData = result.data

			const workbook = new ExcelJs.Workbook()
			const worksheet = workbook.addWorksheet('sheet1')
			worksheet.columns = [
				{ header: '周期编号', key: 'quarterCode' },
				{ header: '密封点类型', key: 'sealPointType' },
				{ header: '检测个数', key: 'detectionCount' },
				{ header: '泄漏个数', key: 'leakCount' },
				{ header: '修复个数', key: 'repairCount' },
				{ header: '泄漏率(%)', key: 'leakRate' },
				{ header: '修复后泄漏率(%)', key: 'leakRateAfterRepair' },
			]
			worksheet.addRows(exportData)
			const buffer = await workbook.xlsx.writeBuffer()
			const link = document.createElement("a")
			const blobData = new Blob([buffer], { type: "application/vnd.ms-excel;charset=utf-8;" })
			link.download = '泄漏统计分析报表.xlsx'
			link.href = URL.createObjectURL(blobData)
			link.click()
		},
		async submit() {
			const { data: result } = await this.$http.post('/ctea/addCtea', this.addCteaForm)

			if (+result.code === 0) {
				this.$message.success('组件类型排放分析添加成功')
			} else {
				this.$message.error('组件类型排放分析添加失败')
			}
			this.queryData()
			this.addCteaDialog = false
		},
		editCtea () {
			if (this.multipleSelection.length !== 1 ) {
				this.$message.error('请一次勾选一条数据')
				return
			}
			this.editCteaDialog = true

			this.editCteaForm._id = this.multipleSelection[0]._id
			this.editCteaForm.quarterCode = this.multipleSelection[0].quarterCode
			this.editCteaForm.sealPointType = this.multipleSelection[0].sealPointType
			this.editCteaForm.detectionCount = this.multipleSelection[0].detectionCount
			this.editCteaForm.leakCount = this.multipleSelection[0].leakCount
			this.editCteaForm.repairCount = this.multipleSelection[0].repairCount
			this.editCteaForm.leakRate = this.multipleSelection[0].leakRate
			this.editCteaForm.leakRateAfterRepair = this.multipleSelection[0].leakRateAfterRepair
		},
		async submitEdit() {
			const { data: result } = await this.$http.post('/ctea/editCtea', { editParams: this.editCteaForm })

			if (+result.code === 0) {
				this.$message.success('组件类型排放分析编辑成功')
			} else {
				this.$message.error('组件类型排放分析编辑失败')
			}
			this.queryData()
			this.editCteaDialog = false
		},
		async deleteCtea() {
			if (this.multipleSelection.length === 0 ) {
				this.$message.error('请勾选数据')
				return
			}
			const { data: result } = await this.$http.post('/ctea/deleteCtea', { deleteData: this.multipleSelection })

			if (+result.code === 0) {
				this.$message.success('组件类型排放分析删除成功')
			} else {
				this.$message.error('组件类型排放分析删除失败')
			}

			this.queryData()
		},
		async queryQuarterCode() {
        	const { data: result } = await this.$http.get('/downloadDetectionTask/queryQuarterCode')
            this.quarterCodeOptions = result.data
			this.cteaForm.quarterCode = this.quarterCodeOptions[0]
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
		this.queryQuarterCode()
    }
}
</script>

<style lang="less" scoped>
</style>
