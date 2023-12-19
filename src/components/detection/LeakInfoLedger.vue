<template>
    <div>
		<el-card>
			<el-form ref="leakInfoLedgerFormRef" :model="leakInfoLedgerForm" label-width="100px" :inline="true">
				<el-form-item label="年份">
					<el-select v-model="leakInfoLedgerForm.year" placeholder="请选择" clearable>
						<el-option
							v-for="item in yearOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="检测周期">
					<el-select v-model="leakInfoLedgerForm.quarter" placeholder="请选择" clearable>
						<el-option
							v-for="item in quarterOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
                <el-form-item label="复测日期">
                    <el-date-picker
                    v-model="leakInfoLedgerForm.date"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期" clearable>
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="组件类型">
					<el-select v-model="leakInfoLedgerForm.componentType" placeholder="请选择" clearable>
						<el-option
							v-for="item in componentTypeOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
                <el-form-item label="装置">
					<el-select v-model="leakInfoLedgerForm.device" placeholder="请选择" clearable>
						<el-option
							v-for="item in deviceOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
                <el-form-item label="区域">
					<el-select v-model="leakInfoLedgerForm.area" placeholder="请选择" clearable>
						<el-option
							v-for="item in areaOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
                <el-form-item label="设备">
					<el-select v-model="leakInfoLedgerForm.equipment" placeholder="请选择" clearable>
						<el-option
							v-for="item in equipmentOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="密封点类型">
					<el-select v-model="leakInfoLedgerForm.sealPointType" placeholder="请选择" clearable>
						<el-option
							v-for="item in sealPointTypeOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="复测人员">
					<el-input v-model="leakInfoLedgerForm.retestPeople" clearable></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="el-icon-search" @click="queryData">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="el-icon-folder-remove" @click="exportData">导出数据</el-button>
				</el-form-item>
			</el-form>

			<el-table ref="table" :data="tableData" border style="width: 100%">
				<el-table-column fixed type="index" align="center"></el-table-column>
                <el-table-column fixed label="图片" align="center" width="120">
					<template slot-scope="scope">
						<el-button type="primary" icon="el-icon-search" size="mini" @click="showPicture(scope.row)">查看</el-button>
                    </template>
				</el-table-column>
				<el-table-column fixed prop="device" label="装置名称" align="center"></el-table-column>
				<el-table-column fixed prop="area" label="区域名称" align="center"></el-table-column>
				<el-table-column fixed prop="equipment" label="设备名称" align="center"></el-table-column>
                <el-table-column fixed prop="equipmentNum" label="设备编号" align="center"></el-table-column>
				<el-table-column fixed prop="label" label="标签号" align="center"></el-table-column>
				<el-table-column fixed prop="expand" label="扩展号" align="center"></el-table-column>
                <el-table-column fixed prop="detectStartDate" label="检测开始时间" align="center"></el-table-column>
                <el-table-column fixed prop="detectEndDate" label="检测结束时间" align="center"></el-table-column>
				<el-table-column prop="medium" label="主要介质" align="center"></el-table-column>
                <el-table-column prop="threshold" label="阈值" align="center"></el-table-column>
                <el-table-column prop="isLeak" label="是否泄漏" align="center"></el-table-column>
				<el-table-column prop="componentType" label="组件类型" align="center"></el-table-column>
				<el-table-column prop="pid" label="PID图号" align="center"></el-table-column>
				<el-table-column prop="reference" label="参考物" align="center"></el-table-column>
				<el-table-column prop="location" label="位置" align="center"></el-table-column>
				<el-table-column prop="distance" label="距离(米)" align="center"></el-table-column>
				<el-table-column prop="floor" label="楼层" align="center"></el-table-column>
				<el-table-column prop="high" label="高度(米)" align="center"></el-table-column>
				<el-table-column prop="description" label="附加描述" align="center"></el-table-column>
				<el-table-column prop="unreachable" label="是否不可达" align="center"></el-table-column>  
				<el-table-column prop="reason" label="不可达原因" align="center"></el-table-column>
                <el-table-column prop="isHardDetect" label="是否难于检测" align="center"></el-table-column>
                <el-table-column prop="hardDetectReason" label="难于检测原因" align="center"></el-table-column>
                <el-table-column prop="detectPeople" label="检测员" align="center"></el-table-column>
                <el-table-column prop="repairPeople" label="维修人员" align="center"></el-table-column>
                <el-table-column prop="repairCount" label="维修次数" align="center"></el-table-column>
                <el-table-column prop="detectNetWorth" label="检测净值" align="center"></el-table-column>
                <el-table-column prop="repairEndDate" label="维修结束日期" align="center"></el-table-column>
                <el-table-column prop="repairUseTime" label="维修使用时间(天)" align="center"></el-table-column>
                <el-table-column prop="repairMeasure" label="维修措施" align="center"></el-table-column>
				<el-table-column prop="retestStartDate" label="复测开始时间" align="center"></el-table-column>
				<el-table-column prop="retestEndDate" label="复测结束时间" align="center"></el-table-column>
				<el-table-column prop="retestInstrument" label="复测检测仪器" align="center"></el-table-column>
                <el-table-column prop="retestPeople" label="复测人员" align="center"></el-table-column>
				<el-table-column prop="retestValue" label="复测值" align="center"></el-table-column>
                <el-table-column prop="retestBackgroundValue" label="复测背景值" align="center"></el-table-column>
                <el-table-column prop="isDelayRepair" label="是否延迟维修" align="center"></el-table-column>
                <el-table-column prop="delayRepairReason" label="延迟修复原因" align="center"></el-table-column>
                <el-table-column prop="planRepairDate" label="预计修复时间" align="center"></el-table-column>
			</el-table>

            <el-pagination align='center' @size-change="handleSizeChange" @current-change="handleCurrentChange" 
                :current-page="currentPage" 
                :page-sizes="[1, 5, 10, 20]" 
                :page-size="pageSize" 
                layout="total, sizes, prev, pager, next, jumper" 
                :total="total">
            </el-pagination>

            <el-dialog title="图片" :visible.sync="showPictureDialog" width="30%">
				<div style="text-align: center;">
					<img :src="pictureUrl" style="width: 400px; height: 400px;">
				</div>
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
			leakInfoLedgerForm: {
				year: '',
				quarter: '',
                componentType: '',
                date: null,
                device: '',
                area: '',
                equipment: '',
                sealPointType: '',
                retestPeople: '',
				currentPage: 1,
				pageSize: 10,
			},
			yearOptions: [
				{ label: '2023', value: '2023' },
			],
			quarterOptions: [
				{ label: '第1季度', value: '第1季度' },
				{ label: '第2季度', value: '第2季度' },
				{ label: '第3季度', value: '第3季度' },
				{ label: '第4季度', value: '第4季度' }
			],
            componentTypeOptions: [],
            deviceOptions: [],
            areaOptions: [],
            equipmentOptions: [],
            sealPointTypeOptions: [
				{ label: '动密封', value: 'dynamic' },
				{ label: '静密封', value: 'static' }
			],
			currentPage: 1,
            total: 0,
            pageSize: 10,
            showPictureDialog: false,
			pictureUrl: '',
		}
    },
    methods: {
		async queryData(query) {
			if (query) {
				Object.assign(this.leakInfoLedgerForm, query)
			}
			const { data: result } = await this.$http.post('/leakInfoLedger/queryLeakInfoLedger', this.leakInfoLedgerForm)
			this.tableData = result.data.leakData
			this.tableData = this.tableData.map(v => {
				if (v.detectStartDate) v.detectStartDate = this.$moment(v.detectStartDate).format("YYYY-MM-DD HH:mm:ss")
                if (v.detectEndDate) v.detectEndDate = this.$moment(v.detectEndDate).format("YYYY-MM-DD HH:mm:ss")
				if (v.retestStartDate) v.retestStartDate = this.$moment(v.retestStartDate).format("YYYY-MM-DD HH:mm:ss")
				if (v.retestEndDate) v.retestEndDate = this.$moment(v.retestEndDate).format("YYYY-MM-DD HH:mm:ss")
				if (v.repairEndDate) v.repairEndDate = this.$moment(v.repairEndDate).format("YYYY-MM-DD HH:mm:ss")
				if (v.planRepairDate) v.planRepairDate = this.$moment(v.planRepairDate).format("YYYY-MM-DD HH:mm:ss")
				return v
			})
			this.total = result.data.total
			this.leakInfoLedgerForm.currentPage = 1
		},
		async exportData() {
			const { data: result } = await this.$http.post('/leakInfoLedger/exportLeakInfoLedger', this.leakInfoLedgerForm)
			let exportData = result.data

			exportData = exportData.map(v => {
				if (v.detectStartDate) v.detectStartDate = this.$moment(v.detectStartDate).format("YYYY-MM-DD HH:mm:ss")
                if (v.detectEndDate) v.detectEndDate = this.$moment(v.detectEndDate).format("YYYY-MM-DD HH:mm:ss")
				if (v.retestStartDate) v.retestStartDate = this.$moment(v.retestStartDate).format("YYYY-MM-DD HH:mm:ss")
				if (v.retestEndDate) v.retestEndDate = this.$moment(v.retestEndDate).format("YYYY-MM-DD HH:mm:ss")
				if (v.repairEndDate) v.repairEndDate = this.$moment(v.repairEndDate).format("YYYY-MM-DD HH:mm:ss")
				if (v.planRepairDate) v.planRepairDate = this.$moment(v.planRepairDate).format("YYYY-MM-DD HH:mm:ss")
				return v
			})

			const workbook = new ExcelJs.Workbook()
			const worksheet = workbook.addWorksheet('sheet1')
			worksheet.columns = [
				{ header: '检测开始时间', key: 'detectStartDate' },
				{ header: '检测结束时间', key: 'detectEndDate' },
				{ header: '装置名称', key: 'device' },
				{ header: '区域名称', key: 'area' },
				{ header: '设备名称', key: 'equipment' },
				{ header: '标签号', key: 'label' },
				{ header: '扩展号', key: 'expand' },
                { header: '设备号', key: 'equipmentNum' },
                { header: 'PID图号', key: 'pid' },
                { header: '参考物', key: 'reference' },
				{ header: '位置', key: 'location' },
				{ header: '距离(米)', key: 'distance' },
				{ header: '楼层', key: 'floor' },
				{ header: '高度(米)', key: 'high' },
				{ header: '附加描述', key: 'description' },
				{ header: '是否难于检测', key: 'isHardDetect' },
				{ header: '难于检测原因', key: 'hardDetectReason' },
				{ header: '是否不可达', key: 'unreachable' },
				{ header: '不可达原因', key: 'reason' },
				{ header: '主要介质', key: 'medium' },
				{ header: '检测净值', key: 'detectNetWorth' },
				{ header: '检测背景值', key: 'detectBackgroundValue' },
				{ header: '阈值', key: 'threshold' },
				{ header: '是否泄漏', key: 'isLeak' },
				{ header: '组件类型', key: 'componentType' },
				{ header: '检测员', key: 'detectPeople' },
				{ header: '维修人员', key: 'repairPeople' },
				{ header: '维修次数', key: 'repairCount' },
				{ header: '维修结束日期', key: 'repairEndDate' },
				{ header: '维修使用时间(天)', key: 'repairUseTime' },
				{ header: '维修措施', key: 'repairMeasure' },
				{ header: '复测开始时间', key: 'retestStartDate' },
				{ header: '复测结束时间', key: 'retestEndDate' },
				{ header: '复测检测仪器', key: 'retestInstrument' },
				{ header: '复测人员', key: 'retestPeople' },
				{ header: '复测值', key: 'retestValue' },
				{ header: '复测背景值', key: 'retestBackgroundValue' },
				{ header: '是否延迟维修', key: 'isDelayRepair' },
				{ header: '延迟修复原因', key: 'delayRepairReason' },
				{ header: '预计修复时间', key: 'planRepairDate' },
			]
			worksheet.addRows(exportData)
			const buffer = await workbook.xlsx.writeBuffer()
			const link = document.createElement("a")
			const blobData = new Blob([buffer], { type: "application/vnd.ms-excel;charset=utf-8;" })
			link.download = '泄漏信息台账.xlsx'
			link.href = URL.createObjectURL(blobData)
			link.click()
		},
        showPicture(row) {
			this.showPictureDialog = true
			this.pictureUrl = "https://www.mmldar.com/api" + row.picturePath
		},
		async queryComponentType() {
			const { data: result } = await this.$http.get('/componentType/queryComponentType')
			for (const item of result.data) {
				this.componentTypeOptions.push({ label: item.componentType, value: item.componentTypeNum })
			}
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
		handleSizeChange(val){
            this.currentPage = 1
            this.pageSize = val
			this.queryData({ currentPage: this.currentPage, pageSize: this.pageSize })
        },
        handleCurrentChange(val){
            this.currentPage = val
			this.queryData({ currentPage: this.currentPage, pageSize: this.pageSize })
        }
    },
    created() {
		this.queryData()
		this.queryDevice()
		this.queryArea()
		this.queryEquipment()
        this.queryComponentType()
    }
}
</script>

<style lang="less" scoped>
</style>
