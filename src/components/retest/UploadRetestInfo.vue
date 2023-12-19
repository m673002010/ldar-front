<template>
    <div>
		<el-card>
			<el-form ref="uriFormRef" :model="uriForm" label-width="100px" :inline="true">
				<el-form-item label="装置">
					<el-select v-model="uriForm.device" placeholder="请选择" clearable>
						<el-option
							v-for="item in deviceOptions"
							:key="item.value"
							:label="item.label"
							:value="item.label">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="区域">
					<el-select v-model="uriForm.area" placeholder="请选择" clearable>
						<el-option
							v-for="item in areaOptions"
							:key="item.value"
							:label="item.label"
							:value="item.label">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="设备">
					<el-select v-model="uriForm.equipment" placeholder="请选择" clearable>
						<el-option
							v-for="item in equipmentOptions"
							:key="item.value"
							:label="item.label"
							:value="item.label">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="组件类型">
					<el-select v-model="uriForm.componentType" placeholder="请选择" clearable>
						<el-option
							v-for="item in componentTypeOptions"
							:key="item.value"
							:label="item.label"
							:value="item.label">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="是否泄漏">
					<el-select v-model="uriForm.isLeak" placeholder="请选择" clearable>
						<el-option
							v-for="(item, index) in isLeakOptions"
							:key="index"
							:label="item"
							:value="item">
						</el-option>
					</el-select>
				</el-form-item>
                <el-form-item label="是否延迟修复">
					<el-select v-model="uriForm.isDelayRepair" placeholder="请选择" clearable>
						<el-option
							v-for="(item, index) in isDelayRepairOptions"
							:key="index"
							:label="item"
							:value="item">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="年度">
					<el-select v-model="uriForm.year" placeholder="请选择" clearable>
						<el-option
							v-for="item in yearOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="季度">
					<el-select v-model="uriForm.quarter" placeholder="请选择" clearable>
						<el-option
							v-for="item in quarterOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="el-icon-search" @click="queryRetestInfo">查询</el-button>
				</el-form-item>
				<el-form-item>
                    <el-button type="primary" icon="el-icon-download" @click="downloadTemplate">复测模板</el-button>
				</el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-upload" @click="uploadDialog = true">导入数据</el-button>
				</el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-edit" @click="editRepair">延迟修复</el-button>
				</el-form-item>
			</el-form>

			<el-table ref="multipleTable" :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" border style="width: 100%" @selection-change="handleSelectionChange">
				<el-table-column fixed type="index" align="center"></el-table-column>
				<el-table-column fixed type="selection" align="center"></el-table-column>
                <el-table-column fixed label="图片" align="center" width="120">
					<template slot-scope="scope">
						<el-button type="primary" icon="el-icon-search" size="mini" @click="showPicture(scope.row)">查看</el-button>
                    </template>
				</el-table-column>
				<el-table-column fixed prop="device" label="装置名称" align="center"></el-table-column>
				<el-table-column fixed prop="area" label="区域名称" align="center" width="120"></el-table-column>
                <el-table-column fixed prop="equipment" label="设备名称" align="center"></el-table-column>
				<el-table-column fixed prop="label" label="标签号" align="center"></el-table-column>
                <el-table-column fixed prop="expand" label="扩展号" align="center"></el-table-column>
                <el-table-column fixed prop="componentType" label="组件类型" align="center"></el-table-column>
                <el-table-column fixed prop="medium" label="主要介质" align="center"></el-table-column>
				<el-table-column prop="detectStartDate" label="检测开始时间" align="center"></el-table-column>
				<el-table-column prop="detectEndDate" label="检测结束时间" align="center"></el-table-column>
                <el-table-column prop="detectBackgroundValue" label="检测背景值(ppm)" align="center"></el-table-column>
				<el-table-column prop="detectValue" label="检测值(ppm)" align="center"></el-table-column>
                <el-table-column prop="detectNetWorth" label="检测净值" align="center"></el-table-column>
				<el-table-column prop="threshold" label="阈值" align="center"></el-table-column>
                <el-table-column prop="isLeak" label="是否泄漏" align="center"></el-table-column>
                <el-table-column prop="detectPeople" label="检测员" align="center"></el-table-column>
				<el-table-column prop="retestStartDate" label="复测开始时间" align="center"></el-table-column>
                <el-table-column prop="retestEndDate" label="复测结束时间" align="center"></el-table-column>
                <el-table-column prop="retestInstrument" label="复测检测仪器" align="center"></el-table-column>
                <el-table-column prop="retestPeople" label="复测人员" align="center"></el-table-column>
                <el-table-column prop="retestValue" label="复测值" align="center"></el-table-column>
                <el-table-column prop="retestBackgroundValue" label="复测背景值" align="center"></el-table-column>
                <el-table-column prop="repairPeople" label="维修人员" align="center"></el-table-column>
                <el-table-column prop="repairCount" label="维修次数" align="center"></el-table-column>
                <el-table-column prop="repairEndDate" label="维修结束日期" align="center"></el-table-column>
                <el-table-column prop="repairUseTime" label="维修使用时间(天)" align="center"></el-table-column>
                <el-table-column prop="repairMeasure" label="维修措施" align="center"></el-table-column>
                <el-table-column prop="isDelayRepair" label="是否延迟维修" align="center"></el-table-column>
                <el-table-column prop="delayRepairReason" label="延迟修复原因" align="center"></el-table-column>
                <el-table-column prop="planRepairDate" label="预计修复时间" align="center"></el-table-column>
                <el-table-column prop="pid" label="PID图号" align="center"></el-table-column>
                <el-table-column prop="reference" label="参考物" align="center"></el-table-column>
                <el-table-column prop="location" label="位置" align="center"></el-table-column>
                <el-table-column prop="distance" label="距离(米)" align="center"></el-table-column>
                <el-table-column prop="floor" label="楼层" align="center"></el-table-column>
                <el-table-column prop="high" label="高度(米)" align="center"></el-table-column>
                <el-table-column prop="description" label="附加描述" align="center"></el-table-column>
                <el-table-column prop="unreachable" label="是否不可达" align="center"></el-table-column>
                <el-table-column prop="reason" label="不可达原因" align="center"></el-table-column>
			</el-table>

            <el-pagination align='center' @size-change="handleSizeChange" @current-change="handleCurrentChange" 
                :current-page="currentPage" 
                :page-sizes="[1, 5, 10, 20, 50, 100]" 
                :page-size="pageSize" 
                layout="total, sizes, prev, pager, next, jumper" 
                :total="tableData.length">
            </el-pagination>

            <el-dialog title="图片" :visible.sync="showPictureDialog" width="30%">
				<div style="text-align: center;">
					<img :src="pictureUrl" style="width: 400px; height: 400px;">
				</div>
        	</el-dialog>

            <el-dialog
                title="上传复测信息"
                :visible.sync="uploadDialog"
                width="30%" @close="dialogClose">
                <el-form :model="uploadForm" ref="uploadFormRef" label-width="70px">
                    <el-form-item label="年度">
                        <el-select v-model="uploadForm.quarterCode" placeholder="请选择" clearable>
                            <el-option
                                v-for="(item, index) in quarterCodeOptions"
                                :key="index"
                                :label="item"
                                :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-upload action="/" :on-change="uploadFile" :auto-upload="false" :show-file-list="true" :limit="1">
                            <el-button type="primary">选择文件</el-button>
                        </el-upload>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="uploadDialog = false">取 消</el-button>
                    <el-button type="primary" @click="submit">确 定</el-button>
                </span>
            </el-dialog>

			<el-dialog
                title="上传复测信息"
                :visible.sync="repairDialog"
                width="30%" @close="dialogClose">
                <el-form :model="repairForm" ref="repairFormRef" label-width="100px">
                    <el-form-item label="是否延迟修复">
                        <el-select v-model="repairForm.isDelayRepair" placeholder="请选择" clearable>
                            <el-option
                                v-for="(item, index) in isDelayRepairOptions"
                                :key="index"
                                :label="item"
                                :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
					<el-form-item label="延迟修复原因">
						<el-input v-model="repairForm.delayRepairReason" clearable></el-input>
					</el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="repairDialog = false">取 消</el-button>
                    <el-button type="primary" @click="submitRepair">确 定</el-button>
                </span>
            </el-dialog>
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
				'区域名称': 'area' ,
				'设备名称': 'equipment',
				'标签号': 'label',
				'扩展号': 'expand',
				'维修人员': 'repairPeople',
				'维修次数': 'repairCount',
				'维修结束日期': 'repairEndDate',
				'维修使用时间(天)': 'repairUseTime',
                '维修措施': 'repairMeasure',
				'维修后泄漏速率': 'afterLeakRate',
				'复测开始时间': 'retestStartDate',
                '复测结束时间': 'retestEndDate',
                '复测检测仪器': 'retestInstrument',
                '复测人员': 'retestPeople',
                '复测值': 'retestValue',
                '复测背景值': 'retestBackgroundValue',
				'是否延迟维修': 'isDelayRepair',
				'延迟修复原因': 'delayRepairReason',
				'预计修复时间': 'planRepairDate',
			},
			tableData: [],
			multipleSelection: [],
			deviceOptions: [],
			areaOptions: [],
			equipmentOptions: [],
            componentTypeOptions: [],
			quarterCodeOptions: [],
            isLeakOptions: [
                '是',
                '否'
            ],
            isDelayRepairOptions: [
                '是',
                '否'
            ],
			yearOptions: [
				{ label: '2023', value: '2023' }
			],
			quarterOptions: [
				{ label: '第1季度', value: '第1季度' },
				{ label: '第2季度', value: '第2季度' },
				{ label: '第3季度', value: '第3季度' },
                { label: '第4季度', value: '第4季度' },
			],
			uriForm: {
				device: '',
                area: '',
                equipment: '',
                componentType: '',
                isLeak: '是',
                isDelayRepair: '',
				year: '',
				quarter: ''
			},
			uploadForm: {
				quarterCode: '',
                importData: [],
			},
			repairForm: {
				_id: '',
				isDelayRepair: '',
                delayRepairReason: '',
			},
			currentPage: 1,
            total: 0,
            pageSize: 10,
			showPictureDialog: false,
			pictureUrl: '',
			uploadDialog: false,
			repairDialog: false,
		}
    },
    methods: {
        showPicture(row) {
			this.showPictureDialog = true
			this.pictureUrl = "https://www.mmldar.com/api" + row.picturePath
		},
		async queryRetestInfo() {
			const { data: result } = await this.$http.get('/uploadRetestInfo/queryRetestInfo', { params: this.uriForm })
			this.tableData = result.data.map(v => {
				v.detectStartDate = this.$moment(v.detectStartDate).format("YYYY-MM-DD HH:mm:ss")
				v.detectEndDate = this.$moment(v.detectEndDate).format("YYYY-MM-DD HH:mm:ss")
				if (v.repairEndDate) v.repairEndDate = this.$moment(v.repairEndDate).format("YYYY-MM-DD HH:mm:ss")
                if (v.retestStartDate) v.retestStartDate = this.$moment(v.retestStartDate).format("YYYY-MM-DD HH:mm:ss")
                if (v.retestEndDate) v.retestEndDate = this.$moment(v.retestEndDate).format("YYYY-MM-DD HH:mm:ss")
                if (v.planRepairDate) v.planRepairDate = this.$moment(v.planRepairDate).format("YYYY-MM-DD HH:mm:ss")
				return v
			})
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
				{ header: '维修人员', key: 'repairPeople' },
				{ header: '维修次数', key: 'repairCount' },
				{ header: '维修结束日期', key: 'repairEndDate' },
				{ header: '维修使用时间(天)', key: 'repairUseTime' },
                { header: '维修措施', key: 'repairMeasure' },
				{ header: '复测开始时间', key: 'retestStartDate' },
                { header: '复测结束时间', key: 'retestEndDate' },
                { header: '复测检测仪器', key: 'retestInstrument' },
                { header: '复测人员', key: 'retestPeople' },
				{ header: '维修后泄漏速率', key: 'afterLeakRate' },
                { header: '复测值', key: 'retestValue' },
                { header: '复测背景值', key: 'retestBackgroundValue' },
				{ header: '是否延迟维修', key: 'isDelayRepair' },
				{ header: '延迟修复原因', key: 'delayRepairReason' },
				{ header: '预计修复时间', key: 'planRepairDate' },
			]
			const buffer = await workbook.xlsx.writeBuffer()
			const link = document.createElement("a")
			const blobData = new Blob([buffer], { type: "application/vnd.ms-excel;charset=utf-8;" })
			link.download = '复测模板.xlsx'
			link.href = URL.createObjectURL(blobData)
			link.click()
		},
        async submit() {
			try {
				const { data: result } = await this.$http.post('/uploadRetestInfo/importRetestInfo', this.uploadForm)

				if (+result.code === 0) {
					this.$message.success('导入成功')
				} else {
					this.$message.error('导入失败')
				}

				this.queryRetestInfo()
			} catch (error) {
				this.$message.error('导入失败' + error)
			}

            this.uploadDialog = false
            this.dialogClose()
        },
		async editRepair() {
			if (this.multipleSelection.length !== 1 ) {
				this.$message.error('请一次勾选一条数据')
				return
			}

			this.repairDialog = true
			this.repairForm._id = this.multipleSelection[0]._id
			this.repairForm.isDelayRepair = this.multipleSelection[0].isDelayRepair
			this.repairForm.delayRepairReason = this.multipleSelection[0].delayRepairReason
		},
        async submitRepair() {
			try {
				const { data: result } = await this.$http.post('/uploadRetestInfo/delayRepair', this.repairForm)

				if (+result.code === 0) {
					this.$message.success('延迟修改成功')
				} else {
					this.$message.error('延迟修改失败')
				}

				this.queryRetestInfo()
			} catch (error) {
				this.$message.error('延迟修改失败' + error)
			}

            this.repairDialog = false
        },
        async uploadFile(file, fileList) {
			const excelData = await this.readExcel(file) // 调用读取excel数据的方法
			const importData = []

			// 校验表格数据完整性，以下字段必填
			const necessaryKeys = [
				'装置名称', 
				'区域名称', 
				'设备名称', 
				'标签号', 
				'扩展号', 
				'维修人员', 
				'维修次数', 
				'维修结束日期',
				'维修使用时间(天)',
				'维修措施',
				'复测开始时间',
				'复测结束时间',
				'复测检测仪器',
				'复测人员',
				'复测值',
				'复测背景值',
				'是否延迟维修',
				'延迟修复原因'
			]
			let row = 0
			for (const item of excelData) {
				row++
				const obj = {}
				for (let key in item) {
					obj[this.tableProps[key]] = item[key]
				}
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
			this.uploadForm.importData = importData
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
        },
        handleCurrentChange(val){
            this.currentPage = val
        },
		handleSelectionChange(val) {
        	this.multipleSelection = val
      	},
		async queryDevice() {
			const { data: result } = await this.$http.get('/device/queryDevice')

			for (const item of result.data) {
				this.deviceOptions.push({ label: item.device, value: item.deviceNum })
			}
		},
		async queryArea() {
			const { data: result } = await this.$http.get('/area/queryArea')

			const areaOptions = []
			for (const item of result.data) {
				areaOptions.push({ label: item.area, value: item.areaNum })
				// 区域去重避免键冲突
				this.areaOptions = [...new Set(areaOptions.map(item => JSON.stringify(item)))].map(item => JSON.parse(item))
			}
		},
		async queryEquipment() {
			const { data: result } = await this.$http.get('/equipment/queryEquipment')

			const equipmentOptions = []
			for (const item of result.data) {
				equipmentOptions.push({ label: item.equipment, value: item.equipmentNum })
				// 设备去重避免键冲突
				this.equipmentOptions = [...new Set(equipmentOptions.map(item => JSON.stringify(item)))].map(item => JSON.parse(item))
			}
		},
        async queryComponentType() {
			const { data: result } = await this.$http.get('/componentType/queryComponentType')

			for (const item of result.data) {
				this.componentTypeOptions.push({ label: item.componentType, value: item.componentTypeNum })
			}
		},
		async queryQuarterCode() {
        	const { data: result } = await this.$http.get('/downloadDetectionTask/queryQuarterCode')
            this.quarterCodeOptions = result.data
      	},
		dialogClose () {
            this.uploadForm.quarterCode = ''
			this.uploadForm.importData = []
        },
    },
    created() {
		this.queryQuarterCode()
        this.queryRetestInfo()
		this.queryDevice()
		this.queryArea()
		this.queryEquipment()
        this.queryComponentType()
    }
}
</script>

<style lang="less" scoped>
</style>
