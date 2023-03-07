<template>
    <div>
		<el-card>
			<el-form ref="form" :model="form" label-width="50px" :inline="true">
				<el-form-item label="年份">
					<el-select v-model="form.year" placeholder="请选择">
						<el-option
							v-for="item in yearOption"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="季度">
					<el-select v-model="form.quarter" placeholder="请选择">
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
			form: {
				year: '',
				quarter: '',
			},
			yearOption: [
				{ label: '2019', value: '2019' },
				{ label: '2020', value: '2020' },
				{ label: '2021', value: '2021' },
				{ label: '2022', value: '2022' },
				{ label: '2023', value: '2023' },
			],
			quarterOptions: [
				{ label: '第一季度', value: '第一季度' },
				{ label: '第二季度', value: '第二季度' },
				{ label: '第三季度', value: '第三季度' },
				{ label: '第四季度', value: '第四季度' }
			],
			currentPage: 1, // 当前页码
            total: 0, // 总条数
            pageSize: 10, // 每页的数据条数
		}
    },
    methods: {
		async queryData() {
			const { data: result } = await this.$http.get('/param/instrumentDetectionStatistics', { params: this.form })
			this.tableData = result.data
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

			const { data: result } = await this.$http.post('/param/importData', { importData })
			
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
					let rowValues = row.values;
					// remove first element (extra without reason)
					rowValues.shift();
					// titles row
					if (rowNumber === 1) excelTitles = rowValues;
					// table data
					else {
						// create object with the titles and the row values (if any)
						let rowObject = {}
						for (let i = 0; i < excelTitles.length; i++) {
							let title = excelTitles[i];
							let value = rowValues[i] ? rowValues[i] : '';
							rowObject[title] = value;
						}
						excelData.push(rowObject);
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
			const { data: result } = await this.$http.get('/param/instrumentDetectionStatistics', { params: this.form })
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
			this.form = {
				year: '',
				quarter: '',
			}
		},
		async clearData() {
			const { data: result } = await this.$http.get('/param/deleteData')
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
    }
}
</script>

<style lang="less" scoped>
</style>
