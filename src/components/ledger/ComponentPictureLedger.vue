<template>
    <div>
		<el-card>
			<el-form ref="cplFormRef" :model="cplForm" label-width="100px" :inline="true">
                <el-form-item label="装置">
					<el-select v-model="cplForm.device" placeholder="请选择" clearable>
						<el-option
							v-for="item in deviceOptions"
							:key="item.value"
							:label="item.label"
							:value="item.label">
						</el-option>
					</el-select>
				</el-form-item>
                <el-form-item label="区域">
					<el-select v-model="cplForm.area" placeholder="请选择" clearable>
						<el-option
							v-for="item in areaOptions"
							:key="item.value"
							:label="item.label"
							:value="item.label">
						</el-option>
					</el-select>
				</el-form-item>
                <el-form-item label="设备">
					<el-select v-model="cplForm.equipment" placeholder="请选择" clearable>
						<el-option
							v-for="item in equipmentOptions"
							:key="item.value"
							:label="item.label"
							:value="item.label">
						</el-option>
					</el-select>
				</el-form-item>
				<!-- <el-form-item label="检测周期">
					<el-select v-model="cplForm.quarter" placeholder="请选择" clearable>
						<el-option
							v-for="item in quarterOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item> -->
				<el-form-item>
					<el-button type="primary" icon="el-icon-search" @click="queryData">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="el-icon-download" @click="exportPicture">导出图片</el-button>
				</el-form-item>
			</el-form>

			<el-table ref="table" :data="tableData" border style="width: 100%">
				<el-table-column fixed type="index" align="center"></el-table-column>
                <el-table-column fixed label="图片" align="center">
					<template slot-scope="scope">
						<el-button type="primary" size="mini" icon="el-icon-search" @click="showPicture(scope.row)">查看</el-button>
                    </template>
				</el-table-column>
				<el-table-column prop="label" label="标签" align="center"></el-table-column>
				<el-table-column prop="picture" label="图片名称" align="center"></el-table-column>
				<el-table-column prop="componentType" label="组件类型" align="center"></el-table-column>
				<el-table-column prop="medium" label="主要介质" align="center"></el-table-column>
				<el-table-column prop="mediumStatus" label="介质状态" align="center"></el-table-column>
                <el-table-column prop="location" label="位置描述" align="center"></el-table-column>
				<el-table-column prop="device" label="装置" align="center"></el-table-column>
				<el-table-column prop="area" label="区域" align="center"></el-table-column>
                <el-table-column prop="equipment" label="设备" align="center"></el-table-column>
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

export default {
    data() {
		return {
			tableProps: {
				'标签': 'label',
				'图片名称': 'picture',
				'主要介质': 'medium',
				'位置描述': 'location',
				'装置': 'device',
                '区域': 'area',
                '设备': 'equipment',
			},
			tableData: [],
			cplForm: {
				quarter: '',
                device: '',
                area: '',
                equipment: '',
				currentPage: 1,
				pageSize: 10,
			},
			quarterOptions: [
				{ label: '半年度检测', value: '半年度检测' },
				{ label: '季度检测', value: '季度检测' }
			],
            deviceOptions: [],
            areaOptions: [],
            equipmentOptions: [],
			currentPage: 1,
            total: 0,
            pageSize: 10,
            showPictureDialog: false,
			pictureUrl: '',
			companyNum: ''
		}
    },
    methods: {
		async queryData(query) {
			if (query) {
				Object.assign(this.cplForm, query)
			}
			const { data: result } = await this.$http.get('/cpl/componentPictureLedger', { params: this.cplForm })
			this.tableData = result.data.labelData
			this.total = result.data.total
		},
		async exportPicture() {
			const { data: result } = await this.$http.get('/cpl/exportComponentPictureLedger')
			if (+result.code === 0) await this.download()
		},
		async download(){
			window.open('https://www.mmldar.com/api/' + this.companyNum + '/pictureLedger.zip', 'self')
		},
        showPicture(row) {
			this.showPictureDialog = true
			this.pictureUrl = "https://www.mmldar.com/api" + row.picturePath
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
		async getUserInfo() {
            const { data: result } = await this.$http.get('/user/userInfo')
            if (+result.code === 0) {
                const userInfo = result.data
                this.companyNum = userInfo.companyNum
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
		this.getUserInfo()
    }
}
</script>

<style lang="less" scoped>
</style>
