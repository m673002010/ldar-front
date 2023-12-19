<template>
    <div>
		<el-card>
			<el-form ref="cilFormRef" :model="cilForm" :inline="true" label-width="100px">
				<el-form-item label="装置">
					<el-select v-model="cilForm.device" placeholder="请选择" clearable>
						<el-option
							v-for="item in deviceOptions"
							:key="item.value"
							:label="item.label"
							:value="item.label">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="区域">
					<el-select v-model="cilForm.area" placeholder="请选择" clearable>
						<el-option
							v-for="item in areaOptions"
							:key="item.value"
							:label="item.label"
							:value="item.label">
						</el-option>
					</el-select>
				</el-form-item>
                <el-form-item label="设备">
					<el-select v-model="cilForm.equipment" placeholder="请选择" clearable>
						<el-option
							v-for="item in equipmentOptions"
							:key="item.value"
							:label="item.label"
							:value="item.label">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="组件类型">
                    <el-select v-model="cilForm.componentType" placeholder="请选择" clearable>
						<el-option
							v-for="item in componentTypeOptions"
							:key="item.value"
							:label="item.label"
							:value="item.label">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="动静密封">
                    <el-select v-model="cilForm.sealPointType" placeholder="请选择" clearable>
						<el-option
							v-for="item in sealPointTypeOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
                <el-form-item label="介质状态">
                    <el-select v-model="cilForm.mediumStatus" placeholder="请选择" clearable>
						<el-option
							v-for="item in mediumStatusOptions"
							:key="item.value"
							:label="item.label"
							:value="item.label">
						</el-option>
					</el-select>
				</el-form-item>
                <el-form-item label="是否不可达">
                    <el-select v-model="cilForm.unreachable" placeholder="请选择" clearable>
						<el-option
							v-for="item in unreachableOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="介质">
                    <el-input v-model="cilForm.medium" clearable></el-input>
				</el-form-item>
				<el-form-item label="标签号">
					<el-input v-model="cilForm.label" clearable></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="el-icon-search" @click="queryData">查询</el-button>
				</el-form-item>
                <el-form-item>
					<el-button type="primary" icon="el-icon-search" @click="exportData">导出</el-button>
				</el-form-item>
			</el-form>
		
			<el-table ref="multipleTable" :data="tableData" border style="width: 100%">
				<el-table-column fixed type="index" align="center"></el-table-column>
                <el-table-column fixed label="图片" align="center" width="120">
					<template slot-scope="scope">
						<el-button type="primary" icon="el-icon-search" size="mini" @click="showPicture(scope.row)">查看</el-button>
                    </template>
				</el-table-column>
				<el-table-column fixed prop="device" label="装置名称" align="center"></el-table-column>
				<el-table-column fixed prop="area" label="区域名称" align="center"></el-table-column>
				<el-table-column fixed prop="equipment" label="设备名称" align="center"></el-table-column>
				<el-table-column fixed prop="label" label="标签号" align="center"></el-table-column>
				<el-table-column fixed prop="expand" label="扩展号" align="center"></el-table-column>
				<el-table-column fixed prop="componentType" label="组件类型" align="center"></el-table-column>
				<el-table-column fixed prop="medium" label="主要介质" align="center"></el-table-column>
				<el-table-column fixed prop="mediumStatus" label="介质状态" align="center"></el-table-column>
				<el-table-column prop="pid" label="PID图号" align="center"></el-table-column>
				<el-table-column prop="reference" label="参考物" align="center"></el-table-column>
				<el-table-column prop="location" label="位置" align="center"></el-table-column>
				<el-table-column prop="distance" label="距离(米)" align="center"></el-table-column>
				<el-table-column prop="floor" label="楼层" align="center"></el-table-column>
				<el-table-column prop="high" label="高度(米)" align="center"></el-table-column>
				<el-table-column prop="description" label="附加描述" align="center"></el-table-column>
				<el-table-column prop="size" label="尺寸(mm)" align="center"></el-table-column>
				<el-table-column prop="unreachable" label="是否不可达" align="center"></el-table-column>
				<el-table-column prop="reason" label="不可达原因" align="center"></el-table-column>
                <el-table-column prop="isExemption" label="是否豁免" align="center"></el-table-column>
                <el-table-column prop="regulationCode" label="法规" align="center"></el-table-column>
                <el-table-column prop="quarter" label="检测频率" align="center"></el-table-column>
				<el-table-column prop="quantity" label="数量" align="center"></el-table-column>
			</el-table>

            <el-pagination align='center' @size-change="handleSizeChange" @current-change="handleCurrentChange" 
                :current-page="currentPage" 
                :page-sizes="[1, 10, 50, 100]" 
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
			cilForm: {
				device: '',
				area: '',
				equipment: '',
                label: '',
                unreachable: '',
                componentType: '',
                sealPointType: '',
                mediumStatus: '',
                medium: '',
				currentPage: 1,
				pageSize: 10,
			},
			deviceOptions: [],
			areaOptions: [],
			equipmentOptions: [],
            componentTypeOptions: [],
            sealPointTypeOptions: [
                { label: '全部', value: 'all' },
                { label: '静密封', value: '静密封' },
                { label: '动密封', value: '动密封' },
            ],
			unreachableOptions: [
				{ label: '是', value: '是' },
                { label: '否', value: '否' },
			],
            mediumStatusOptions: [],
			multipleSelection: [],
			currentPage: 1,
            total: 0,
            pageSize: 10,
			editComponentDialog: false,
			showPictureDialog: false,
			pictureUrl: '',
		}
    },
    methods: {
		async queryData(query) {
			if (query) {
				Object.assign(this.cilForm, query)
			}
			const { data: result } = await this.$http.get('/cil/componentInfoLedger', { params: this.cilForm })
			this.tableData = result.data.componentData
			this.total = result.data.total
			this.cilForm.currentPage = 1
		},
		async exportData() {
			const { data: result } = await this.$http.get('/cil/exportComponentInfoLedger', { params: this.cilForm })
			const exportData = result.data

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
			worksheet.addRows(exportData)
			const buffer = await workbook.xlsx.writeBuffer()
			const link = document.createElement("a")
			const blobData = new Blob([buffer], { type: "application/vnd.ms-excel;charset=utf-8;" })
			link.download = '组件台账.xlsx'
			link.href = URL.createObjectURL(blobData)
			link.click()
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
		async queryStatus() {
			const { data: result } = await this.$http.get('/medium/queryMedium')

			for (const item of result.data) {
				this.mediumStatusOptions.push({ label: item.medium, value: item.report })
			}
		},
        showPicture(row) {
			this.showPictureDialog = true
			this.pictureUrl = "https://www.mmldar.com/api" + row.picturePath
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
        this.queryStatus()
    }
}
</script>

<style lang="less" scoped>
</style>
