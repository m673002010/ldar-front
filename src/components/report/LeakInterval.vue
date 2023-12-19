<template>
    <div>
		<el-card>
			<el-form ref="leakIntervalFormRef" :model="leakIntervalForm" label-width="80px" :inline="true">
				<el-form-item label="周期编号">
					<el-select v-model="leakIntervalForm.quarterCode" placeholder="请选择" clearable>
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
					<el-button type="success" icon="el-icon-plus" @click="addLeakIntervalDialog = true">新增</el-button>
					<el-button type="warning" icon="el-icon-edit" @click="editLeakInterval">编辑</el-button>
					<el-button type="danger" icon="el-icon-delete" @click="deleteLeakInterval">删除</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="el-icon-folder-remove" @click="exportData">导出数据</el-button>
				</el-form-item>
			</el-form>

			<el-table ref="multipleTable" :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" @selection-change="handleSelectionChange" border style="width: 100%">
				<el-table-column type="index" align="center"></el-table-column>
				<el-table-column type="selection" align="center"></el-table-column>
				<el-table-column prop="_id" v-if="false" align="center"></el-table-column>
				<el-table-column prop="device" label="装置名称" align="center" width="100"></el-table-column>
				<el-table-column prop="detectionCount" label="检测总点数" align="center" width="100"></el-table-column>
				<el-table-column prop="leakAnalysis" label="泄漏分析" align="center">   
                    <el-table-column prop="ppm100to500" label="100 < ppm < 500" align="center"></el-table-column>
                    <el-table-column prop="ppm500to2000" label="500 ≤ ppm < 2000" align="center"></el-table-column>
                    <el-table-column prop="ppm2000to10000" label="2000 ≤ ppm < 10000" align="center"></el-table-column>
                    <el-table-column prop="ppmMoreThan10000" label="ppm ≥ 10000" align="center"></el-table-column>
                </el-table-column>
				<el-table-column prop="processAnalysis" label="处理分析" align="center">
                    <el-table-column prop="delayFix" label="延迟修复" align="center" width="100"></el-table-column>
                    <el-table-column prop="haveFixed" label="修复成功" align="center" width="100"></el-table-column>
                    <el-table-column prop="nofixed" label="修复未成功" align="center" width="100"></el-table-column>
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
			title="排放量"
			:visible.sync="addLeakIntervalDialog"
			width="30%" @close="dialogClose('addLeakIntervalForm')">
			<el-form :model="addLeakIntervalForm" ref="addLeakIntervalFormRef" label-width="180px">
				<el-form-item label="周期编号" prop="quarterCode">
					<el-select v-model="addLeakIntervalForm.quarterCode" placeholder="请选择" clearable>
						<el-option v-for="(item, index) in quarterCodeOptions" :key="index" :label="item" :value="item">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="装置名称" prop="device">
					<el-input v-model="addLeakIntervalForm.device" clearable></el-input>
				</el-form-item>
				<el-form-item label="检测总点数" prop="detectionCount">
					<el-input v-model="addLeakIntervalForm.detectionCount" clearable></el-input>
				</el-form-item>
				<el-form-item label="100 < ppm < 500" prop="ppm100to500">
					<el-input v-model="addLeakIntervalForm.ppm100to500" clearable></el-input>
				</el-form-item>
				<el-form-item label="500 ≤ ppm < 2000" prop="ppm500to2000">
					<el-input v-model="addLeakIntervalForm.ppm500to2000" clearable></el-input>
				</el-form-item>
				<el-form-item label="2000 ≤ ppm < 10000" prop="ppm2000to10000">
					<el-input v-model="addLeakIntervalForm.ppm2000to10000" clearable></el-input>
				</el-form-item>
				<el-form-item label="ppm ≥ 10000" prop="ppmMoreThan10000">
					<el-input v-model="addLeakIntervalForm.ppmMoreThan10000" clearable></el-input>
				</el-form-item>
				<el-form-item label="延迟修复" prop="delayFix">
					<el-input v-model="addLeakIntervalForm.delayFix" clearable></el-input>
				</el-form-item>
				<el-form-item label="修复成功" prop="haveFixed">
					<el-input v-model="addLeakIntervalForm.haveFixed" clearable></el-input>
				</el-form-item>
				<el-form-item label="修复未成功" prop="nofixed">
					<el-input v-model="addLeakIntervalForm.nofixed" clearable></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addLeakIntervalDialog = false">取 消</el-button>
				<el-button type="primary" @click="submit">确 定</el-button>
			</span>
		</el-dialog>

		<el-dialog
			title="排放量"
			:visible.sync="editLeakIntervalDialog"
			width="30%" @close="dialogClose('editLeakIntervalForm')">
			<el-form :model="editLeakIntervalForm" ref="editLeakIntervalFormRef" label-width="100px">
				<el-form-item label="周期编号" prop="quarterCode">
					<el-select v-model="editLeakIntervalForm.quarterCode" placeholder="请选择" clearable>
						<el-option v-for="(item, index) in quarterCodeOptions" :key="index" :label="item" :value="item">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="装置名称" prop="device">
					<el-input v-model="editLeakIntervalForm.device" clearable></el-input>
				</el-form-item>
				<el-form-item label="检测总点数" prop="detectionCount">
					<el-input v-model="editLeakIntervalForm.detectionCount" clearable></el-input>
				</el-form-item>
				<el-form-item label="100 < ppm < 500" prop="ppm100to500">
					<el-input v-model="editLeakIntervalForm.ppm100to500" clearable></el-input>
				</el-form-item>
				<el-form-item label="500 ≤ ppm < 2000" prop="ppm500to2000">
					<el-input v-model="editLeakIntervalForm.ppm500to2000" clearable></el-input>
				</el-form-item>
				<el-form-item label="2000 ≤ ppm < 10000" prop="ppm2000to10000">
					<el-input v-model="editLeakIntervalForm.ppm2000to10000" clearable></el-input>
				</el-form-item>
				<el-form-item label="ppm ≥ 10000" prop="ppmMoreThan10000">
					<el-input v-model="editLeakIntervalForm.ppmMoreThan10000" clearable></el-input>
				</el-form-item>
				<el-form-item label="延迟修复" prop="delayFix">
					<el-input v-model="editLeakIntervalForm.delayFix" clearable></el-input>
				</el-form-item>
				<el-form-item label="修复成功" prop="haveFixed">
					<el-input v-model="editLeakIntervalForm.haveFixed" clearable></el-input>
				</el-form-item>
				<el-form-item label="修复未成功" prop="nofixed">
					<el-input v-model="editLeakIntervalForm.nofixed" clearable></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="editLeakIntervalDialog = false">取 消</el-button>
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
			leakIntervalForm: {
				quarterCode: ''
			},
			addLeakIntervalForm: {
				quarterCode: '',
				device: '',
				detectionCount: '',
				ppm100to500: '',
				ppm500to2000: '',
				ppm2000to10000: '',
				ppmMoreThan10000: '',
				delayFix: '',
				haveFixed: '',
				nofixed: '',
			},
			editLeakIntervalForm: {
				_id: '',
				quarterCode: '',
				device: '',
				detectionCount: '',
				ppm100to500: '',
				ppm500to2000: '',
				ppm2000to10000: '',
				ppmMoreThan10000: '',
				delayFix: '',
				haveFixed: '',
				nofixed: '',
			},
			quarterCodeOptions: [],
			addLeakIntervalDialog: false,
			editLeakIntervalDialog: false,
			currentPage: 1,
            total: 0,
            pageSize: 10,
		}
    },
    methods: {
		async queryData() {
			const { data: result } = await this.$http.get('/leakInterval/queryLeakInterval', { params: this.leakIntervalForm })
			this.tableData = result.data
		},
		async statistic () {
			if (!this.leakIntervalForm.quarterCode) {
				this.$message.error('请选择左上角周期编号')
				return
			}
			await this.$http.post('/leakInterval/statisticLeakInterval', this.leakIntervalForm)
			this.queryData()
		},
		async exportData() {
			const { data: result } = await this.$http.get('/leakInterval/queryLeakInterval', { params: this.leakIntervalForm })
			const exportData = result.data

			const workbook = new ExcelJs.Workbook()
			const worksheet = workbook.addWorksheet('sheet1')
			worksheet.columns = [
				{ header: '装置名称', key: 'device' },
				{ header: '检测总点数', key: 'detectionCount' },
				{ header: '100 < ppm < 500', key: 'ppm100to500' },
				{ header: '500 ≤ ppm < 2000', key: 'ppm500to2000' },
				{ header: '2000 ≤ ppm < 10000', key: 'ppm2000to10000' },
				{ header: 'ppm ≥ 10000', key: 'ppmMoreThan10000' },
				{ header: '延迟修复', key: 'delayFix' },
				{ header: '修复成功', key: 'haveFixed' },
				{ header: '修复未成功', key: 'nofixed' }
			]
			worksheet.addRows(exportData)
			const buffer = await workbook.xlsx.writeBuffer()
			const link = document.createElement("a")
			const blobData = new Blob([buffer], { type: "application/vnd.ms-excel;charset=utf-8;" })
			link.download = '泄漏等级统计报告.xlsx'
			link.href = URL.createObjectURL(blobData)
			link.click()
		},
		async submit() {
			const { data: result } = await this.$http.post('/leakInterval/addLeakInterval', this.addLeakIntervalForm)

			if (+result.code === 0) {
				this.$message.success('组件类型排放分析添加成功')
			} else {
				this.$message.error('组件类型排放分析添加失败')
			}
			this.queryData()
			this.addLeakIntervalDialog = false
		},
		editLeakInterval () {
			if (this.multipleSelection.length !== 1 ) {
				this.$message.error('请一次勾选一条数据')
				return
			}
			this.editLeakIntervalDialog = true

			this.editLeakIntervalForm._id = this.multipleSelection[0]._id
			this.editLeakIntervalForm.quarterCode = this.multipleSelection[0].quarterCode
			this.editLeakIntervalForm.device = this.multipleSelection[0].device
			this.editLeakIntervalForm.detectionCount = this.multipleSelection[0].detectionCount
			this.editLeakIntervalForm.ppm100to500 = this.multipleSelection[0].ppm100to500
			this.editLeakIntervalForm.ppm500to2000 = this.multipleSelection[0].ppm500to2000
			this.editLeakIntervalForm.ppm2000to10000 = this.multipleSelection[0].ppm2000to10000
			this.editLeakIntervalForm.ppmMoreThan10000 = this.multipleSelection[0].ppmMoreThan10000
			this.editLeakIntervalForm.delayFix = this.multipleSelection[0].delayFix
			this.editLeakIntervalForm.haveFixed = this.multipleSelection[0].haveFixed
			this.editLeakIntervalForm.nofixed = this.multipleSelection[0].nofixed
		},
		async submitEdit() {
			const { data: result } = await this.$http.post('/leakInterval/editLeakInterval', { editParams: this.editLeakIntervalForm })

			if (+result.code === 0) {
				this.$message.success('组件类型排放分析编辑成功')
			} else {
				this.$message.error('组件类型排放分析编辑失败')
			}
			this.queryData()
			this.editLeakIntervalDialog = false
		},
		async deleteLeakInterval() {
			if (this.multipleSelection.length === 0 ) {
				this.$message.error('请勾选数据')
				return
			}
			const { data: result } = await this.$http.post('/leakInterval/deleteLeakInterval', { deleteData: this.multipleSelection })

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
			console.log('===========', this.quarterCodeOptions)
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
