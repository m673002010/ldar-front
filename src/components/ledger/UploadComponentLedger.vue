<template>
    <div>
		<el-card>
			<el-form ref="componentFormRef" :model="componentForm" label-width="80px" :inline="true">
				<el-form-item>
					<el-button type="primary" @click="downloadTemplate" icon="el-icon-download">下载模板</el-button>
				</el-form-item>
				<el-form-item>
					<el-upload action="/" :on-change="importComponent" :auto-upload="false" :show-file-list="false" accept=".xls, .xlsx">
						<el-button type="primary" icon="el-icon-upload">导入数据</el-button>
					</el-upload>
				</el-form-item>
			</el-form>

			<el-table :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" v-loading="loading" element-loading-text="导入中..." border style="width: 100%">
				<el-table-column type="index" width="50" align="center"></el-table-column>
				<el-table-column prop="importFile" label="导入文件名" align="center"></el-table-column>
				<el-table-column prop="newCount" label="新增数据量" align="center"></el-table-column>
				<el-table-column prop="createDate" label="创建时间" align="center"></el-table-column>
				<el-table-column prop="createUser" label="创建人" align="center"></el-table-column>
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
				'装置编号': 'deviceNum',
				'装置名称': 'device',
				'区域编号': 'areaNum',
				'区域名称': 'area',
				'设备编号': 'equipmentNum',
				'设备名称': 'equipment',
				'标签号': 'label',
				'扩展号': 'expand',
				'PID图号': 'pid',
				'参考物': 'reference',
				'位置': 'location',
				'距离(米)': 'distance',
				'楼层': 'floor',
				'高度(米)': 'high',
				'附加描述': 'description',
				'组件类型': 'componentType',
				'介质状态': 'mediumStatus',
				'是否不可达': 'unreachable',
				'不可达原因': 'reason',
				'尺寸(mm)': 'size',
				'是否保温': 'ifWarm',
				'主要介质': 'medium',
				'FLAG号': 'FLAGNum',
				'FLAG名称': 'FLAG',
				'条形码': 'barCode',
				'数量': 'quantity',
				'原始图片': 'picture',
				'标点图片': 'markPicture',
				'标点位置': 'markPosition',
			},
			tableData: [],
			componentForm: {
			},
			deviceTypeOptions: [],
			departmentOptions: [
				'检测组',
				'技术组',
				'企业用户'
			],
			currentPage: 1,
            total: 0,
            pageSize: 10,
			loading: false
		}
    },
    methods: {
		async queryImportRecord() {
			const { data: result } = await this.$http.get('/component/queryImportRecord')

			const tableData = result.data.map(v => {
				v.createDate = this.$moment(v.createDate).format("YYYY-MM-DD HH:mm:ss")
				return v
			})
			this.tableData = tableData
		},
		async importComponent(file, fileList) {
			this.loading = true

			const excelData = await this.readExcel(file) // 调用读取excel数据的方法
			const importData = []

			// 校验表格数据完整性，以下字段必填
			const necessaryKeys = ['装置编号', '装置名称', '区域编号', '区域名称', '设备编号', '设备名称', '标签号', '扩展号', '组件类型', '介质状态', '是否不可达']
			let row = 0
			for (const item of excelData) {
				row++
				const obj = {}
				for (let key in item) {
					if (necessaryKeys.includes(key) && !item[key]) {
						this.$message.error(`表格第${row}行 缺失${key}`)
						this.loading = false
						return
					}
					obj[this.tableProps[key]] = item[key]
				}
				importData.push(obj)
			}

			const { data: result } = await this.$http.post('/component/importComponent', { importData, importFile: file.name })

			if (+result.code === 0) {
				this.$message.success('导入成功')
			} else {
				this.$message.error('导入失败: ' + result.message)
			}

			await this.queryImportRecord()

			this.loading = false
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
		async downloadTemplate() {
			const workbook = new ExcelJs.Workbook()
			const worksheet = workbook.addWorksheet('sheet1')
			worksheet.columns = [
				{ header: '装置编号', key: 'deviceNum' },
				{ header: '装置名称', key: 'device' },
				{ header: '区域编号', key: 'areaNum' },
				{ header: '区域名称', key: 'area' },
				{ header: '设备编号', key: 'equipmentNum' },
				{ header: '设备名称', key: 'equipment' },
				{ header: '标签号', key: 'label' },
				{ header: '扩展号', key: 'expand' },
				{ header: 'PID图号', key: 'pid' },
				{ header: '参考物', key: 'reference' },
				{ header: '位置', key: 'location' },
				{ header: '距离(米)', key: 'distance' },
				{ header: '楼层', key: 'floor' },
				{ header: '高度(米)', key: 'high' },
				{ header: '附加描述', key: 'description' },
				{ header: '组件类型', key: 'componentType' },
				{ header: '介质状态', key: 'mediumStatus' },
				{ header: '是否不可达', key: 'unreachable' },
				{ header: '不可达原因', key: 'reason' },
				{ header: '尺寸(mm)', key: 'size' },
				{ header: '是否保温', key: 'ifWarm' },
				{ header: '主要介质', key: 'medium' },
				{ header: 'FLAG号', key: 'FLAGNum' },
				{ header: 'FLAG名称', key: 'FLAG' },
				{ header: '条形码', key: 'barCode' },
				{ header: '数量', key: 'quantity' },
				{ header: '原始图片', key: 'picture' },
				{ header: '标点图片', key: 'markPicture' },
				{ header: '标点位置', key: 'markPosition' },
			]
			const buffer = await workbook.xlsx.writeBuffer()
			const link = document.createElement("a")
			const blobData = new Blob([buffer], { type: "application/vnd.ms-excel;charset=utf-8;" })
			link.download = '组件台账模板.xlsx'
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
		async queryDeviceType() {
			const { data: result } = await this.$http.get('/deviceType/queryDeviceType')
			for (const item of result.data) {
				this.deviceTypeOptions.push({ label: item.deviceType, value: item.deviceTypeNum })
			}
		},
    },
    created() {
		this.queryDeviceType()
		this.queryImportRecord()
    }
}
</script>

<style lang="less" scoped>
</style>
