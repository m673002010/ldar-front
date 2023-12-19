<template>
    <div>
		<el-card>
			<el-form ref="ecrFormRef" :model="ecrForm" label-width="80px" :inline="true">
				<el-form-item label="周期编号">
					<el-select v-model="ecrForm.quarterCode" placeholder="请选择" clearable>
						<el-option
							v-for="(item, index) in quarterCodeOptions"
							:key="index"
							:label="item"
							:value="item">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="维修前后">
					<el-select v-model="ecrForm.repairBeforeAfter" placeholder="请选择" clearable>
						<el-option
							v-for="(item, index) in repairBeforeAfterOptions"
							:key="index"
							:label="item"
							:value="item">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="el-icon-search" @click="queryData">查询</el-button>
					<el-button type="success" icon="el-icon-plus" @click="addEcrDialog = true">新增</el-button>
					<el-button type="warning" icon="el-icon-edit" @click="editEcr">编辑</el-button>
					<el-button type="danger" icon="el-icon-delete" @click="deleteEcr">删除</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="el-icon-folder-remove" @click="exportData">导出数据</el-button>
				</el-form-item>
			</el-form>

			<el-table ref="multipleTable" :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" border style="width: 100%" @selection-change="handleSelectionChange">
				<el-table-column type="index" align="center"></el-table-column>
				<el-table-column type="selection" align="center"></el-table-column>
				<el-table-column prop="_id" v-if="false" align="center"></el-table-column>
				<el-table-column prop="quarterCode" label="周期编号" align="center"></el-table-column>
				<el-table-column prop="deviceType" label="装置类型" align="center"></el-table-column>
				<el-table-column prop="device" label="装置名称" align="center"></el-table-column>
				<el-table-column prop="area" label="区域名称" align="center"></el-table-column>
				<el-table-column prop="equipment" label="设备名称" align="center"></el-table-column>
				<el-table-column prop="componentType" label="组件类型" align="center"></el-table-column>
				<el-table-column prop="mediumStatus" label="介质状态" align="center"></el-table-column>
                <el-table-column prop="count" label="数量" align="center"></el-table-column>
                <el-table-column prop="leakRate" label="泄漏速率(Kg/h)" align="center"></el-table-column>
			</el-table>

            <el-pagination align='center' @size-change="handleSizeChange" @current-change="handleCurrentChange" 
                :current-page="currentPage" 
                :page-sizes="[1, 5, 10, 20]" 
                :page-size="pageSize" 
                layout="total, sizes, prev, pager, next, jumper" 
                :total="tableData.length">
            </el-pagination>

			<el-dialog
				title="排放量"
				:visible.sync="addEcrDialog"
				width="30%" @close="dialogClose('addEcrForm')">
				<el-form :model="addEcrForm" ref="addEcrFormRef" label-width="100px">
					<el-form-item label="周期编号" prop="quarterCode">
						<el-select v-model="addEcrForm.quarterCode" placeholder="请选择" clearable>
							<el-option v-for="(item, index) in quarterCodeOptions" :key="index" :label="item" :value="item">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="维修前后" prop="repairBeforeAfter">
						<el-select v-model="addEcrForm.repairBeforeAfter" placeholder="请选择" clearable>
							<el-option v-for="(item, index) in repairBeforeAfterOptions" :key="index" :label="item" :value="item">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="装置类型" prop="deviceType">
						<el-select v-model="addEcrForm.deviceType" placeholder="请选择" clearable>
							<el-option v-for="item in deviceTypeOptions" :key="item.value" :label="item.label" :value="item.label">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="装置名称" prop="device">
						<el-select v-model="addEcrForm.device" placeholder="请选择" clearable>
							<el-option v-for="item in deviceOptions" :key="item.value" :label="item.label" :value="item.label">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="区域名称" prop="area">
						<el-select v-model="addEcrForm.area" placeholder="请选择" clearable>
							<el-option v-for="item in areaOptions" :key="item.value" :label="item.label" :value="item.label">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="设备名称" prop="equipment">
						<el-select v-model="addEcrForm.equipment" placeholder="请选择" clearable>
							<el-option v-for="item in equipmentOptions" :key="item.value" :label="item.label" :value="item.label">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="组件类型" prop="componentType">
						<el-select v-model="addEcrForm.componentType" placeholder="请选择" clearable>
							<el-option v-for="item in componentTypeOptions" :key="item.value" :label="item.label" :value="item.label">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="介质状态" prop="mediumStatus">
						<el-select v-model="addEcrForm.mediumStatus" placeholder="请选择" clearable>
							<el-option v-for="item in mediumStatusOptions" :key="item.value" :label="item.label" :value="item.label">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="数量" prop="count">
						<el-input v-model="addEcrForm.count" clearable></el-input>
					</el-form-item>
					<el-form-item label="泄漏速率" prop="leakRate">
						<el-input v-model="addEcrForm.leakRate" clearable></el-input>
					</el-form-item>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="addEcrDialog = false">取 消</el-button>
					<el-button type="primary" @click="submit">确 定</el-button>
				</span>
			</el-dialog>

			<el-dialog
				title="装置类型"
				:visible.sync="editEcrDialog"
				width="30%" @close="dialogClose('editEcrForm')">
				<el-form :model="editEcrForm" ref="editEcrFormRef" label-width="100px">
					<el-form-item label="周期编号" prop="quarterCode">
						<el-select v-model="editEcrForm.quarterCode" placeholder="请选择" clearable>
							<el-option v-for="(item, index) in quarterCodeOptions" :key="index" :label="item" :value="item">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="维修前后" prop="repairBeforeAfter">
						<el-select v-model="editEcrForm.repairBeforeAfter" placeholder="请选择" clearable>
							<el-option v-for="(item, index) in repairBeforeAfterOptions" :key="index" :label="item" :value="item">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="装置类型" prop="deviceType">
						<el-select v-model="editEcrForm.deviceType" placeholder="请选择" clearable>
							<el-option v-for="item in deviceTypeOptions" :key="item.value" :label="item.label" :value="item.label">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="装置名称" prop="device">
						<el-select v-model="editEcrForm.device" placeholder="请选择" clearable>
							<el-option v-for="item in deviceOptions" :key="item.value" :label="item.label" :value="item.label">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="区域名称" prop="area">
						<el-select v-model="editEcrForm.area" placeholder="请选择" clearable>
							<el-option v-for="item in areaOptions" :key="item.value" :label="item.label" :value="item.label">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="设备名称" prop="equipment">
						<el-select v-model="editEcrForm.equipment" placeholder="请选择" clearable>
							<el-option v-for="item in equipmentOptions" :key="item.value" :label="item.label" :value="item.label">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="组件类型" prop="componentType">
						<el-select v-model="editEcrForm.componentType" placeholder="请选择" clearable>
							<el-option v-for="item in componentTypeOptions" :key="item.value" :label="item.label" :value="item.label">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="介质状态" prop="mediumStatus">
						<el-select v-model="editEcrForm.mediumStatus" placeholder="请选择" clearable>
							<el-option v-for="item in mediumStatusOptions" :key="item.value" :label="item.label" :value="item.label">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="数量" prop="count">
						<el-input v-model="editEcrForm.count" clearable></el-input>
					</el-form-item>
					<el-form-item label="泄漏速率" prop="leakRate">
						<el-input v-model="editEcrForm.leakRate" clearable></el-input>
					</el-form-item>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="editEcrDialog = false">取 消</el-button>
					<el-button type="primary" @click="submitEdit">确 定</el-button>
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
			tableData: [],
			multipleSelection: [],
			ecrForm: {
				quarterCode: '',
				repairBeforeAfter: '',
			},
			addEcrForm: {
				quarterCode: '',
				repairBeforeAfter: '',
				device: '',
				deviceType: '',
				area: '',
				equipment: '',
				componentType: '',
				mediumStatus: '',
				count: '',
				leakRate: '',
			},
			editEcrForm: {
				_id: '',
				quarterCode: '',
				repairBeforeAfter: '',
				device: '',
				deviceType: '',
				area: '',
				equipment: '',
				componentType: '',
				mediumStatus: '',
				count: '',
				leakRate: '',
			},
			quarterCodeOptions: [],
			repairBeforeAfterOptions: [
				'维修前',
				'维修后',
			],
			deviceOptions: [],
			deviceTypeOptions: [],
			areaOptions: [],
			equipmentOptions: [],
			componentTypeOptions: [],
			mediumStatusOptions: [],
			addEcrDialog: false,
			editEcrDialog: false,
			currentPage: 1,
            total: 0,
            pageSize: 10,
		}
    },
    methods: {
		async queryData() {
			const { data: result } = await this.$http.get('/ecr/emissionCalculationReport', { params: this.ecrForm })
			this.tableData = result.data
		},
		async exportData() {
			const { data: result } = await this.$http.get('/ecr/emissionCalculationReport', { params: this.ecrForm })
			const exportData = result.data

			const workbook = new ExcelJs.Workbook()
			const worksheet = workbook.addWorksheet('sheet1')
			worksheet.columns = [
				{ header: '周期编号', key: 'quarterCode' },
				{ header: '装置类型', key: 'deviceType' },
				{ header: '装置名称', key: 'device' },
				{ header: '区域名称', key: 'area' },
				{ header: '设备名称', key: 'equipment' },
				{ header: '组件类型', key: 'componentType' },
				{ header: '介质状态', key: 'mediumStatus' },
                { header: '数量', key: 'count' },
                { header: '泄漏率(Kg/h)', key: 'leakRate' }
			]
			worksheet.addRows(exportData)
			const buffer = await workbook.xlsx.writeBuffer()
			const link = document.createElement("a")
			const blobData = new Blob([buffer], { type: "application/vnd.ms-excel;charset=utf-8;" })
			link.download = '泄漏率统计报表.xlsx'
			link.href = URL.createObjectURL(blobData)
			link.click()
		},
		async submit() {
			const { data: result } = await this.$http.post('/ecr/addEcr', this.addEcrForm)

			if (+result.code === 0) {
				this.$message.success('排放量计算添加成功')
			} else {
				this.$message.error('排放量计算添加失败')
			}
			this.queryData()
			this.addEcrDialog = false
		},
		editEcr	() {
			if (this.multipleSelection.length !== 1 ) {
				this.$message.error('请一次勾选一条数据')
				return
			}
			this.editEcrDialog = true

			this.editEcrForm._id = this.multipleSelection[0]._id
			this.editEcrForm.quarterCode = this.multipleSelection[0].quarterCode
			this.editEcrForm.repairBeforeAfter = this.multipleSelection[0].repairBeforeAfter
			this.editEcrForm.device = this.multipleSelection[0].device
			this.editEcrForm.deviceType = this.multipleSelection[0].deviceType
			this.editEcrForm.area = this.multipleSelection[0].area
			this.editEcrForm.equipment = this.multipleSelection[0].equipment
			this.editEcrForm.componentType = this.multipleSelection[0].componentType
			this.editEcrForm.mediumStatus = this.multipleSelection[0].mediumStatus
			this.editEcrForm.count = this.multipleSelection[0].count
			this.editEcrForm.leakRate = this.multipleSelection[0].leakRate
		},
		async submitEdit() {
			const { data: result } = await this.$http.post('/ecr/editEcr', { editParams: this.editEcrForm })

			if (+result.code === 0) {
				this.$message.success('排放量计算编辑成功')
			} else {
				this.$message.error('排放量计算编辑失败')
			}
			this.queryData()
			this.editEcrDialog = false
		},
		async deleteEcr() {
			if (this.multipleSelection.length === 0 ) {
				this.$message.error('请勾选数据')
				return
			}
			const { data: result } = await this.$http.post('/ecr/deleteEcr', { deleteData: this.multipleSelection })

			if (+result.code === 0) {
				this.$message.success('排放量计算删除成功')
			} else {
				this.$message.error('排放量计算删除失败')
			}

			this.queryData()
		},
		async queryQuarterCode() {
        	const { data: result } = await this.$http.get('/downloadDetectionTask/queryQuarterCode')
            this.quarterCodeOptions = result.data
      	},
		async queryDevice() {
			const { data: result } = await this.$http.get('/device/queryDevice')

			for (const item of result.data) {
				this.deviceOptions.push({ label: item.device, value: item.deviceNum })
			}
		},
		async queryDeviceType() {
			const { data: result } = await this.$http.get('/deviceType/queryDeviceType')

			for (const item of result.data) {
				this.deviceTypeOptions.push({ label: item.deviceType, value: item.deviceTypeNum })
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
		async queryStatus() {
			const { data: result } = await this.$http.get('/medium/queryMedium')

			for (const item of result.data) {
				this.mediumStatusOptions.push({ label: item.medium, value: item.report })
			}
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
		this.queryDevice()
		this.queryDeviceType()
		this.queryArea()
		this.queryEquipment()
        this.queryComponentType()
		this.queryStatus()
    }
}
</script>

<style lang="less" scoped>
</style>
