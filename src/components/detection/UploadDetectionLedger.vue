<template>
    <div>
		<el-card>
			<el-form ref="udlFormRef" :model="udlForm" label-width="100px" :inline="true">
				<el-form-item label="周期编号">
					<el-select v-model="udlForm.quarterCode" placeholder="请选择" clearable>
						<el-option
							v-for="(item, index) in quarterCodeOptions"
							:key="index"
							:label="item"
							:value="item">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="任务单名称">
					<el-select v-model="udlForm.assignNum" placeholder="请选择" clearable>
						<el-option
							v-for="(item, index) in assignNumOptions"
							:key="index"
							:label="item"
							:value="item">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="检测人员">
					<el-input v-model="udlForm.detectPeople" clearable></el-input>
				</el-form-item>
                <el-form-item label="上传状态">
					<el-select v-model="udlForm.isUploaded" placeholder="请选择" clearable>
						<el-option
							v-for="(item, index) in isUploadedOptions"
							:key="index"
							:label="item"
							:value="item">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="el-icon-search" @click="queryTask">查询</el-button>
                    <el-button type="primary" icon="el-icon-download" @click="downloadTemplate">下载模板</el-button>
				</el-form-item>
                <el-form-item>
					<el-upload action="/" :on-change="uploadDetectTask" :auto-upload="false" :show-file-list="false" accept=".xls, .xlsx">
						<el-button type="primary" icon="el-icon-upload">导入数据</el-button>
					</el-upload>
				</el-form-item>
			</el-form>

			<el-table ref="multipleTable" :data="tableData" v-loading="loading" element-loading-text="上传中..." border style="width: 100%" @selection-change="handleSelectionChange">
				<el-table-column type="index" align="center"></el-table-column>
				<el-table-column type="selection" align="center"></el-table-column>
				<el-table-column prop="quarterCode" label="周期编号" align="center"></el-table-column>
				<el-table-column prop="assignNum" label="任务单名称" align="center" width="120"></el-table-column>
                <el-table-column prop="detectPeople" label="任务负责人" align="center"></el-table-column>
				<el-table-column prop="assigned" label="分配点数" align="center"></el-table-column>
                <el-table-column prop="detected" label="已检测" align="center"></el-table-column>
				<el-table-column prop="leakFix" label="泄漏/修复" align="center"></el-table-column>
				<el-table-column prop="isFinished" label="是否结束" align="center"></el-table-column>
                <el-table-column prop="startDate" label="开始时间" align="center"></el-table-column>
                <el-table-column prop="endDate" label="结束时间" align="center"></el-table-column>
				<!-- <el-table-column prop="createDate" label="创建时间" align="center"></el-table-column>
				<el-table-column prop="createUser" label="创建人" align="center"></el-table-column> -->
			</el-table>

            <el-pagination align='center' @size-change="handleSizeChange" @current-change="handleCurrentChange" 
                :current-page="currentPage" 
                :page-sizes="[1, 5, 10, 20]" 
                :page-size="pageSize" 
                layout="total, sizes, prev, pager, next, jumper" 
                :total="total">
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
				'装置名称': 'device',
				'区域名称': 'area',
				'设备名称': 'equipment',
				'标签号': 'label',
				'扩展号': 'expand',
				'检测时间': 'detectTime',
				'开始时间': 'detectStartDate',
				'结束时间': 'detectEndDate',
				'检测人员': 'detectPeople',
				'检测仪器': 'instrument',
				'背景值': 'detectBackgroundValue',
				'检测值': 'detectValue',
				'泄漏速率': 'leakRate',
				'是否难以检测': 'isHardDetect',
				'难以检测原因': 'hardDetectReason',
			},
			tableData: [],
			multipleSelection: [],
            quarterCodeOptions: [],
            assignNumOptions: [],
            isUploadedOptions: [
                '已上传',
                '未上传'
            ],
			udlForm: {
				quarterCode: '',
                assignNum: '',
                detectPeople: '',
                isUploaded: '',
				currentPage: 1,
				pageSize: 10,
			},
			currentPage: 1,
            total: 0,
            pageSize: 10,
			loading: false
		}
    },
    methods: {
		async queryTask(query) {
			if (query) {
				Object.assign(this.udlForm, query)
			}
			Object.assign(this.udlForm, { currentPage: this.currentPage, pageSize: this.pageSize })
			const { data: result } = await this.$http.get('/downloadDetectionTask/queryTask', { params: this.udlForm })
			this.tableData = result.data.assignOrderData.map(v => {
				v.createDate = this.$moment(v.createDate).format("YYYY-MM-DD HH:mm:ss")
				return v
			})
			this.total = result.data.total
			this.udlForm.currentPage = 1
		},
		async downloadTemplate() {
            const workbook = new ExcelJs.Workbook()
			const worksheet = workbook.addWorksheet('sheet1')
			worksheet.columns = [
				{ header: '装置名称', key: 'device' },
				{ header: '区域名称', key: 'area' },
				{ header: '设备名称', key: 'equipment' },
				{ header: '标签号', key: 'label' },
				{ header: '扩展号', key: 'expand' },
				{ header: '检测时间', key: 'detectTime' },
				{ header: '开始时间', key: 'detectStartDate' },
				{ header: '结束时间', key: 'detectEndDate' },
				{ header: '检测人员', key: 'detectPeople' },
				{ header: '检测仪器', key: 'instrument' },
				{ header: '背景值', key: 'detectBackgroundValue' },
				{ header: '检测值', key: 'detectValue' },
				{ header: '泄漏速率', key: 'leakRate' },
				{ header: '是否难以检测', key: 'isHardDetect' },
				{ header: '难以检测原因', key: 'hardDetectReason' },
			]
			const buffer = await workbook.xlsx.writeBuffer()
			const link = document.createElement("a")
			const blobData = new Blob([buffer], { type: "application/vnd.ms-excel;charset=utf-8;" })
			link.download = '检测模板.xlsx'
			link.href = URL.createObjectURL(blobData)
			link.click()
		},
        async uploadDetectTask(file, fileList) {
            if (this.multipleSelection.length !== 1 ) {
				this.$message.error('请勾选要导入的任务单')
				return
			}

			this.loading = true

            // 调用读取excel数据的方法
            const excelData = await this.readExcel(file)
			const detectData = []

			// 校验表格数据完整性，以下字段必填
			const necessaryKeys = ['装置名称', '区域名称', '设备名称', '标签号', '扩展号', '检测时间', '开始时间', '结束时间', '检测人员', '检测仪器', '背景值', '检测值']
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
				detectData.push(obj)
			}

            const form = {}
            form.quarterCode = this.multipleSelection[0].quarterCode
            form.assignNum = this.multipleSelection[0].assignNum
            form.detectData = detectData
            form.detectFile = file.name

            const { data: result } = await this.$http.post('/uploadDetectionLedger/uploadDetectTask', form)

            if (+result.code === 0) {
				this.$message.success('上传成功')
			} else {
				this.$message.error(result.message)
			}

			await this.queryTask()

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
		handleSizeChange(val){
            this.currentPage = 1
            this.pageSize = val
			this.queryTask({ currentPage: this.currentPage, pageSize: this.pageSize })
        },
        handleCurrentChange(val){
            this.currentPage = val
			this.queryTask({ currentPage: this.currentPage, pageSize: this.pageSize })
        },
		handleSelectionChange(val) {
        	this.multipleSelection = val
      	},
		async queryQuarterCode() {
        	const { data: result } = await this.$http.get('/downloadDetectionTask/queryQuarterCode')
            this.quarterCodeOptions = result.data
      	},
		async queryAssignNum() {
        	const { data: result } = await this.$http.get('/downloadDetectionTask/queryAssignNum')
            this.assignNumOptions = result.data
      	}
    },
	mounted() {
    	this.udlForm.quarterCode = this.quarterCode
		this.queryTask()
  	},
    created() {
		this.queryQuarterCode()
		this.queryAssignNum()
    }
}
</script>

<style lang="less" scoped>
</style>
