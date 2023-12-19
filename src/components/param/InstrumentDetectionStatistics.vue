<template>
    <div>
		<el-card>
			<el-form ref="idsFormRef" :model="idsForm" label-width="50px" :inline="true">
				<el-form-item label="年份">
					<el-select v-model="idsForm.year" placeholder="请选择" clearable>
						<el-option
							v-for="item in yearOption"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="季度">
					<el-select v-model="idsForm.quarter" placeholder="请选择" clearable>
						<el-option
							v-for="item in quarterOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="el-icon-search" @click="queryData">查询</el-button>
                    <el-button type="success" icon="el-icon-plus" @click="addIdsDialog = true">新增</el-button>
					<el-button type="warning" icon="el-icon-edit" @click="editIds">编辑</el-button>
					<el-button type="danger" icon="el-icon-delete" @click="deleteIds">删除</el-button>
					<el-button type="primary" icon="el-icon-download" @click="downloadTemplate">下载模板</el-button>
				</el-form-item>
				<el-form-item>
					<el-upload action="/" :on-change="importData" :auto-upload="false" :show-file-list="false" accept=".xls, .xlsx">
						<el-button type="primary" icon="el-icon-folder-add">导入数据</el-button>
					</el-upload>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="el-icon-folder-remove" @click="exportData">导出数据</el-button>
					<el-button type="primary" icon="el-icon-refresh" @click="resetForm">重置</el-button>
					<el-button type="danger" icon="el-icon-delete" @click="clearData">清除</el-button>
				</el-form-item>
			</el-form>

			<el-table ref="table" :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" border style="width: 100%"
			@selection-change="handleSelectionChange">
				<el-table-column type="index" align="center"></el-table-column>
				<el-table-column type="selection" align="center"></el-table-column>
				<el-table-column prop="_id" v-if="false" align="center"></el-table-column>
				<el-table-column prop="year" label="年份" align="center"></el-table-column>
				<el-table-column prop="quarter" label="检测季度" align="center"></el-table-column>
				<el-table-column prop="instrumentNum" label="仪器编号" align="center"></el-table-column>
				<el-table-column prop="instrument" label="仪器名称" align="center"></el-table-column>
				<el-table-column prop="model" label="仪器型号" align="center"></el-table-column>
				<el-table-column prop="maintenance" label="维护内容" align="center"></el-table-column>
				<el-table-column prop="quantity" label="检测数量" align="center"></el-table-column>
				<el-table-column prop="calibrationUnit" label="检定/校准单位" align="center"></el-table-column>
				<el-table-column prop="certificateNum" label="检定/校准证书编号" align="center"></el-table-column>
				<el-table-column prop="description" label="描述" align="center"></el-table-column>
                <!-- <el-table-column prop="createDate" label="创建时间" align="center"></el-table-column>
				<el-table-column prop="createUser" label="创建人" align="center"></el-table-column>
				<el-table-column prop="editDate" label="修改时间" align="center"></el-table-column> -->
				<el-table-column prop="editUser" label="修改人" align="center"></el-table-column>
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
            title="仪器检测统计"
            :visible.sync="addIdsDialog"
            width="30%" @close="dialogClose('addIdsForm')">
            <el-form :model="addIdsForm" ref="addIdsFormRef" label-width="150px">
                <el-form-item label="年份" prop="year">
                    <el-input v-model="addIdsForm.year" style="width: 200px"></el-input>
                </el-form-item>
                <el-form-item label="检测季度" prop="quarter">
                    <el-input v-model="addIdsForm.quarter" style="width: 200px"></el-input>
                </el-form-item>
				<el-form-item label="仪器编号" prop="instrumentNum" >
					<el-input v-model="addIdsForm.instrumentNum" style="width: 200px"></el-input>
                </el-form-item>
				<el-form-item label="仪器名称" prop="instrument" >
					<el-input v-model="addIdsForm.instrument" style="width: 200px"></el-input>
                </el-form-item>
				<el-form-item label="仪器型号" prop="model" >
					<el-input v-model="addIdsForm.model" style="width: 200px"></el-input>
                </el-form-item>
				<el-form-item label="维护内容" prop="maintenance" >
					<el-input v-model="addIdsForm.maintenance" style="width: 200px"></el-input>
                </el-form-item>
				<el-form-item label="检测数量" prop="quantity" >
					<el-input v-model="addIdsForm.quantity" style="width: 200px"></el-input>
                </el-form-item>
				<el-form-item label="检定/校准单位" prop="calibrationUnit" >
					<el-input v-model="addIdsForm.calibrationUnit" style="width: 200px"></el-input>
                </el-form-item>
				<el-form-item label="检定/校准证书编号" prop="certificateNum" >
					<el-input v-model="addIdsForm.certificateNum" style="width: 200px"></el-input>
                </el-form-item>
				<el-form-item label="描述" prop="description" >
					<el-input v-model="addIdsForm.description" style="width: 200px"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addIdsDialog = false">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </span>
        </el-dialog>

		<el-dialog
            title="仪器检测统计"
            :visible.sync="editIdsDialog"
            width="30%" @close="dialogClose('editIdsForm')">
            <el-form :model="editIdsForm" ref="editIdsFormRef" label-width="150px">
                <el-form-item label="年份" prop="year">
                    <el-input v-model="editIdsForm.year" style="width: 200px"></el-input>
                </el-form-item>
                <el-form-item label="检测季度" prop="quarter">
                    <el-input v-model="editIdsForm.quarter" style="width: 200px"></el-input>
                </el-form-item>
				<el-form-item label="仪器编号" prop="instrumentNum" >
					<el-input v-model="editIdsForm.instrumentNum" style="width: 200px"></el-input>
                </el-form-item>
				<el-form-item label="仪器名称" prop="instrument" >
					<el-input v-model="editIdsForm.instrument" style="width: 200px"></el-input>
                </el-form-item>
				<el-form-item label="仪器型号" prop="model" >
					<el-input v-model="editIdsForm.model" style="width: 200px"></el-input>
                </el-form-item>
				<el-form-item label="维护内容" prop="maintenance" >
					<el-input v-model="editIdsForm.maintenance" style="width: 200px"></el-input>
                </el-form-item>
				<el-form-item label="检测数量" prop="quantity" >
					<el-input v-model="editIdsForm.quantity" style="width: 200px"></el-input>
                </el-form-item>
				<el-form-item label="检定/校准单位" prop="calibrationUnit" >
					<el-input v-model="editIdsForm.calibrationUnit" style="width: 200px"></el-input>
                </el-form-item>
				<el-form-item label="检定/校准证书编号" prop="certificateNum" >
					<el-input v-model="editIdsForm.certificateNum" style="width: 200px"></el-input>
                </el-form-item>
				<el-form-item label="描述" prop="description" >
					<el-input v-model="editIdsForm.description" style="width: 200px"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editIdsDialog = false">取 消</el-button>
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
			tableProps: {
				'年份': 'year',
				'检测季度': 'quarter',
				'仪器编号': 'instrumentNum',
				'仪器名称': 'instrument',
				'仪器型号': 'model',
				'维护内容': 'maintenance',
				'检测数量': 'quantity',
				'检定/校准单位': 'calibrationUnit',
				'检定/校准证书编号': 'certificateNum',
				'描述': 'description',
			},
			tableData: [],
			idsForm: {
				year: '',
				quarter: '',
			},
			addIdsForm: {
				year: '',
				quarter: '',
				instrumentNum: '',
				instrument: '',
				model: '',
				maintenance: '',
				quantity: '',
				calibrationUnit: '',
				certificateNum: '',
				description: '',
			},
			editIdsForm: {
				_id: '',
				year: '',
				quarter: '',
				instrumentNum: '',
				instrument: '',
				model: '',
				maintenance: '',
				quantity: '',
				calibrationUnit: '',
				certificateNum: '',
				description: '',
			},
			yearOption: [
				{ label: '2023', value: '2023' },
			],
			quarterOptions: [
				{ label: '第1季度', value: '第1季度' },
				{ label: '第2季度', value: '第2季度' },
				{ label: '第3季度', value: '第3季度' },
				{ label: '第4季度', value: '第4季度' }
			],
			currentPage: 1,
            total: 0,
            pageSize: 10,
			addIdsDialog: false,
			editIdsDialog: false
		}
    },
    methods: {
		async queryData() {
			const { data: result } = await this.$http.get('/ids/instrumentDetectionStatistics', { params: this.idsForm })
			this.tableData = result.data
		},
		async submit() {
			const { data: result } = await this.$http.post('/ids/addIds', this.addIdsForm)

			if (+result.code === 0) {
				this.$message.success('仪器检测统计新增成功')
			} else {
				this.$message.error('仪器检测统计新增失败')
			}
			this.queryData()
			this.addIdsDialog = false
		},
		editIds() {
			if (this.multipleSelection.length !== 1 ) {
				this.$message.error('请一次勾选一条数据')
				return
			}
			this.editIdsDialog = true
			this.editIdsForm._id = this.multipleSelection[0]._id
			this.editIdsForm.year = this.multipleSelection[0].year
			this.editIdsForm.quarter = this.multipleSelection[0].quarter
			this.editIdsForm.instrumentNum = this.multipleSelection[0].instrumentNum
			this.editIdsForm.instrument = this.multipleSelection[0].instrument
			this.editIdsForm.model = this.multipleSelection[0].model
			this.editIdsForm.maintenance = this.multipleSelection[0].maintenance
			this.editIdsForm.quantity = this.multipleSelection[0].quantity
			this.editIdsForm.calibrationUnit = this.multipleSelection[0].calibrationUnit
			this.editIdsForm.certificateNum = this.multipleSelection[0].certificateNum
			this.editIdsForm.description = this.multipleSelection[0].description
		},
		async submitEdit() {
			const { data: result } = await this.$http.post('/ids/editIds', this.editIdsForm)

			if (+result.code === 0) {
				this.$message.success('仪器检测统计编辑成功')
			} else {
				this.$message.error('仪器检测统计编辑失败')
			}
			this.queryData()
			this.editIdsDialog = false
		},
		async deleteIds() {
			if (this.multipleSelection.length === 0 ) {
				this.$message.error('请勾选数据')
				return
			}
			const { data: result } = await this.$http.post('/ids/deleteIds', { deleteData: this.multipleSelection })

			if (+result.code === 0) {
				this.$message.success('仪器检测统计删除成功')
			} else {
				this.$message.error('仪器检测统计删除失败')
			}

			this.queryData()
		},
		async importData(file, fileList) {
			const excelData = await this.readExcel(file) // 调用读取excel数据的方法
			const importData = []
			for (const item of excelData) {
				const obj = {}
				for (let key in item) {
					obj[this.tableProps[key]] = item[key]
				}
				importData.push(obj)
			}

			const { data: result } = await this.$http.post('/ids/importData', { importData })
			
			if (+result.code === 0) {
				this.$message.success('导入成功')
			} else {
				this.$message.error('导入失败')
			}

			await this.queryData()
		},
		async readExcel(file) {
			const buffer = await this.readFile(file)
			const workbook = new ExcelJs.Workbook()
			await workbook.xlsx.load(buffer)
			const worksheet = workbook.worksheets[0]

			let excelTitles = []
    		let excelData = []

			worksheet.eachRow((row, rowNumber) => {
				// rowNumber 0 is empty
				if (rowNumber > 0) {
					// get values from row
					let rowValues = row.values
					// remove first element (extra without reason)
					rowValues.shift()
					// titles row
					if (rowNumber === 1) excelTitles = rowValues
					// table data
					else {
						// create object with the titles and the row values (if any)
						let rowObject = {}
						for (let i = 0; i < excelTitles.length; i++) {
							let title = excelTitles[i]
							let value
							if (rowValues[i]) value = rowValues[i]
							else if(rowValues[i] === 0) value = rowValues[i]
							else rowValues[i] = ''
							rowObject[title] = value
						}
						excelData.push(rowObject)
					}
				}
    		})
			return excelData
		},
		readFile (file) {
			return new Promise((resolve, reject) => {
				var fr = new FileReader()
				fr.onload = () => {
					resolve(fr.result)
				}
				fr.onerror = reject
				fr.readAsArrayBuffer(file.raw)
			})
		},
		async exportData() {
			const { data: result } = await this.$http.get('/ids/instrumentDetectionStatistics', { params: this.idsForm })
			const exportData = result.data

			const workbook = new ExcelJs.Workbook()
			const worksheet = workbook.addWorksheet('sheet1')
			worksheet.columns = [
				{ header: '年份', key: 'year' },
				{ header: '检测季度', key: 'quarter' },
				{ header: '仪器编号', key: 'instrumentNum' },
				{ header: '仪器名称', key: 'instrument' },
				{ header: '仪器型号', key: 'model' },
				{ header: '维护内容', key: 'maintenance' },
				{ header: '检测数量', key: 'quantity' },
				{ header: '检定/校准单位', key: 'calibrationUnit' },
				{ header: '检定/校准证书编号', key: 'certificateNum' },
				{ header: '描述', key: 'description' }
			]
			worksheet.addRows(exportData)
			const buffer = await workbook.xlsx.writeBuffer()
			const link = document.createElement("a")
			const blobData = new Blob([buffer], { type: "application/vnd.ms-excel;charset=utf-8;" })
			link.download = '仪器管理信息报告.xlsx'
			link.href = URL.createObjectURL(blobData)
			link.click()
		},
		async downloadTemplate() {
			const workbook = new ExcelJs.Workbook()
			const worksheet = workbook.addWorksheet('sheet1')
			worksheet.columns = [
				{ header: '年份', key: 'year' },
				{ header: '检测季度', key: 'quarter' },
				{ header: '仪器编号', key: 'instrumentNum' },
				{ header: '仪器名称', key: 'instrument' },
				{ header: '仪器型号', key: 'model' },
				{ header: '维护内容', key: 'maintenance' },
				{ header: '检测数量', key: 'quantity' },
				{ header: '检定/校准单位', key: 'calibrationUnit' },
				{ header: '检定/校准证书编号', key: 'certificateNum' },
				{ header: '描述', key: 'description' }
			]
			const buffer = await workbook.xlsx.writeBuffer()
			const link = document.createElement("a")
			const blobData = new Blob([buffer], { type: "application/vnd.ms-excel;charset=utf-8;" })
			link.download = '仪器管理信息报告.xlsx'
			link.href = URL.createObjectURL(blobData)
			link.click()
		},
		resetForm() {
			this.idsForm = {
				year: '',
				quarter: '',
			}
		},
		async clearData() {
			const { data: result } = await this.$http.get('/ids/deleteData')
			await this.queryData()
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
      	}
    },
    created() {
		this.queryData()
    }
}
</script>

<style lang="less" scoped>
</style>
