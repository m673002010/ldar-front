<template>
    <div>
		<el-card>
			<el-form ref="ddlFormRef" :model="ddlForm" :inline="true" label-width="100px">
				<el-form-item label="年度">
					<el-select v-model="ddlForm.year" placeholder="请选择" clearable>
						<el-option
							v-for="item in yearOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="检测周期">
					<el-select v-model="ddlForm.quarter" placeholder="请选择" clearable>
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
                    v-model="ddlForm.date"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期" clearable>
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="装置">
					<el-select v-model="ddlForm.device" placeholder="请选择" clearable>
						<el-option
							v-for="item in deviceOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="区域">
					<el-select v-model="ddlForm.area" placeholder="请选择" clearable>
						<el-option
							v-for="item in areaOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
                <el-form-item label="设备">
					<el-select v-model="ddlForm.equipment" placeholder="请选择" clearable>
						<el-option
							v-for="item in equipmentOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="组件类型">
                    <el-select v-model="ddlForm.componentType" placeholder="请选择" clearable>
						<el-option
							v-for="item in componentTypeOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="动静密封">
                    <el-select v-model="ddlForm.sealPointType" placeholder="请选择" clearable>
						<el-option
							v-for="item in sealPointTypeOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
                <el-form-item label="介质状态">
                    <el-select v-model="ddlForm.mediumStatus" placeholder="请选择" clearable>
						<el-option
							v-for="item in mediumStatusOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
                <el-form-item label="是否不可达">
					<el-select v-model="ddlForm.unreachable" placeholder="请选择" clearable>
						<el-option
							v-for="item in unreachableOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
                    </el-select>
				</el-form-item>
                <el-form-item label="是否泄露">
					<el-select v-model="ddlForm.isLeak" placeholder="请选择" clearable>
						<el-option
							v-for="item in isLeakOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
                    </el-select>
				</el-form-item>
				<el-form-item label="介质">
                    <el-input v-model="ddlForm.medium" clearable></el-input>
				</el-form-item>
				<el-form-item label="标签号">
					<el-input v-model="ddlForm.label" clearable></el-input>
				</el-form-item>
                <el-form-item label="检测人">
					<el-input v-model="ddlForm.detectPeople" clearable></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="el-icon-search" @click="queryData">查询</el-button>
				</el-form-item>
                <el-form-item>
					<el-button type="primary" icon="el-icon-search" @click="exportData">导出</el-button>
				</el-form-item>
			</el-form>
		
			<el-table ref="multipleTable" :data="tableData" @cell-dblclick="tableDbEdit" border style="width: 100%">
				<el-table-column fixed type="index" align="center"></el-table-column>
                <el-table-column fixed label="图片" align="center" width="120">
					<template slot-scope="scope">
						<el-button type="primary" icon="el-icon-search" size="mini" @click="showPicture(scope.row)">查看</el-button>
                    </template>
				</el-table-column>
				<el-table-column fixed prop="device" label="装置名称" align="center"></el-table-column>
                <el-table-column fixed prop="equipment" label="设备名称" align="center"></el-table-column>
				<el-table-column fixed prop="area" label="区域名称" align="center"></el-table-column>
				<el-table-column fixed prop="label" label="标签号" align="center"></el-table-column>
				<el-table-column fixed prop="expand" label="扩展号" align="center"></el-table-column>
                <el-table-column fixed prop="componentType" label="组件类型" align="center"></el-table-column>
				<el-table-column fixed prop="medium" label="介质" align="center"></el-table-column>
                <el-table-column fixed prop="mediumStatus" label="介质状态" align="center"></el-table-column>
                <el-table-column prop="detectStartDate" label="检测开始时间" align="center"></el-table-column>
                <el-table-column prop="detectEndDate" label="检测结束时间" align="center"></el-table-column>
                <el-table-column prop="detectValue" label="原检测值" align="center">
					<template slot-scope="scope">
						<!-- 条件判断如果满足则显示表单，否则默认展示文字 -->
						<el-input v-model="scope.row.detectValue" v-if="showInput == `detectValue${scope.row._id}` && isAdmin"
							@blur='blurInput(scope.row._id, "detectValue", scope.row.detectValue)' v-focus>
						</el-input>
						<p v-else>{{scope.row.detectValue}}</p>
					</template>
				</el-table-column>
				<el-table-column prop="detectBackgroundValue" label="背景值(ppm)" align="center"></el-table-column>
                <el-table-column prop="detectNetWorth" label="检测净值(ppm)" align="center"></el-table-column>
				<el-table-column prop="threshold" label="阈值" align="center"></el-table-column>
                <el-table-column prop="isLeak" label="是否泄露" align="center"></el-table-column>
                <el-table-column prop="leakLevel" label="泄露等级" align="center"></el-table-column>
                <el-table-column prop="isDelayRepair" label="是否延迟修复" align="center"></el-table-column>
                <el-table-column prop="detectValue" label="维修前值" align="center"></el-table-column>
                <el-table-column prop="backgroundValueBeforeRepair" label="维修前背景值(ppm)" align="center"></el-table-column>
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
                <el-table-column prop="detectPeople" label="检测员" align="center"></el-table-column>
                <el-table-column prop="instrument" label="检测仪器" align="center"></el-table-column>
                <el-table-column prop="rateBeforeRepair" label="维修前泄漏率(kg/h)" align="center"></el-table-column>
				<el-table-column prop="currentRate" label="当前泄漏速率(kg/h)" align="center"></el-table-column>
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
			ddlForm: {
                year: '',
                quarter: '',
                label: '',
                unreachable: '',
                isLeak: '',
                mediumStatus: '',
                date: null,
				device: '',
				area: '',
				equipment: '',
                componentType: '',
                sealPointType: '',
                medium: '',
                detectPeople: '',
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
			deviceOptions: [],
			areaOptions: [],
			equipmentOptions: [],
            componentTypeOptions: [],
            sealPointTypeOptions: [
                { label: '静密封', value: 'static' },
                { label: '动密封', value: 'dynamic' },
            ],
            mediumStatusOptions: [],
			unreachableOptions: [
				{ label: '是', value: '是' },
                { label: '否', value: '否' },
			],
			isLeakOptions: [
				{ label: '是', value: '是' },
                { label: '否', value: '否' },
			],
			multipleSelection: [],
			currentPage: 1,
            total: 0,
            pageSize: 10,
			showPictureDialog: false,
			pictureUrl: '',
			showInput: "",
			oldData: {},
			isAdmin: 0,
		}
    },
	directives: {
		// 通过自定义指令实现的表单自动获得光标的操作
		focus: {
			inserted: function(el) {
				if (el.tagName.toLocaleLowerCase() == "input") {
					el.focus()
				} else {
					if (el.getElementsByTagName("input")) {
						el.getElementsByTagName("input")[0].focus()
					}
				}
				el.focus()
			}
		},
		focusTextarea: {
			inserted: function(el) {
				if (el.tagName.toLocaleLowerCase() == "textarea") {
					el.focus()
				} else {
					if (el.getElementsByTagName("textarea")) {
						el.getElementsByTagName("textarea")[0].focus()
					}
				}
				el.focus()
			}
		}
  	},
    methods: {
		// 当input失去光标后进行的操作
		async blurInput(_id, name, value) {
			console.log("===blurInput===")
			let obj = {}
			// 判断数据是否有所改变，如果数据有改变则调用修改接口
			if (this.oldData[name] != value) {
				obj[name] = value //被改变的数据
				// 然后再写调用接口，提交内容的东西就可以了
				const { data: result } = await this.$http.post('/ddl/changeDetectValue', { _id, detectValue: value })

				if (+result.code === 0) {
					this.$message.success('修改成功')
				} else {
					this.$message.error(result.message)
				}

				await this.queryData()
			}
			this.showInput = ""
		},
		/*
		方法参数皆为框架方法的默认传参
		row     行数据
		column  被点击的触发了方法的单元格
		event   事件
		*/
		tableDbEdit(row, column, event) {
			this.showInput = column.property + row._id
			this.oldData[column.property] = row[column.property]
		},
		async queryData(query) {
			if (query) {
				Object.assign(this.ddlForm, query)
			}
			const { data: result } = await this.$http.post('/ddl/detectionDataLedger', this.ddlForm)
			this.tableData = result.data.detectData
			this.tableData = this.tableData.map(v => {
				v.detectStartDate = this.$moment(v.detectStartDate).format("YYYY-MM-DD HH:mm:ss")
                v.detectEndDate = this.$moment(v.detectEndDate).format("YYYY-MM-DD HH:mm:ss")
				return v
			})
			this.total = result.data.total
			this.ddlForm.currentPage = 1
		},
		async exportData() {
			const { data: result } = await this.$http.post('/ddl/exportDetectionDataLedger', this.ddlForm)
			let exportData = result.data
			exportData = exportData.map(v => {
				if (v.detectStartDate) v.detectStartDate = this.$moment(v.detectStartDate).format("YYYY-MM-DD HH:mm:ss")
                if (v.detectEndDate) v.detectEndDate = this.$moment(v.detectEndDate).format("YYYY-MM-DD HH:mm:ss")
				if (v.repairEndDate) v.repairEndDate = this.$moment(v.repairEndDate).format("YYYY-MM-DD HH:mm:ss")
				return v
			})

            const workbook = new ExcelJs.Workbook()
			const worksheet = workbook.addWorksheet('sheet1')
			worksheet.columns = [
				{ header: '装置编号', key: 'labelExpand' },
				{ header: '检测开始时间', key: 'detectStartDate' },
				{ header: '检测结束时间', key: 'detectEndDate' },
				{ header: '时间限值', key: 'limitTime' },
				{ header: '装置名称', key: 'device' },
				{ header: '区域名称', key: 'area' },
				{ header: '设备名称', key: 'equipment' },
				{ header: '标签号', key: 'label' },
				{ header: '扩展号', key: 'expand' },
				{ header: 'PID图号', key: 'pid' },
				{ header: '图片名称', key: 'picture' },
				{ header: '参考物', key: 'reference' },
				{ header: '位置', key: 'location' },
				{ header: '距离(米)', key: 'distance' },
				{ header: '楼层', key: 'floor' },
				{ header: '高度(米)', key: 'high' },
				{ header: '尺寸(mm)', key: 'size' },
				{ header: '附加描述', key: 'description' },
				{ header: '是否难于检测', key: 'isHardDetect' },
				{ header: '难于检测原因', key: 'hardDetectReason' },
				{ header: '是否不可达', key: 'unreachable' },
				{ header: '不可达原因', key: 'reason' },
				{ header: '检测净值', key: 'detectNetWorth' },
				{ header: '检测背景值', key: 'detectBackgroundValue' },
				{ header: '阈值', key: 'threshold' },
				{ header: '是否泄漏', key: 'isLeak' },
				{ header: '泄漏等级', key: 'leakLevel' },
				{ header: '是否延迟修复', key: 'isDelayRepair' },
				{ header: '组件类型', key: 'componentType' },
				{ header: '介质状态', key: 'mediumStatus' },
                { header: '主要介质', key: 'medium' },
                { header: '检测员', key: 'detectPeople' },
                { header: '检测仪器', key: 'instrument' },
                { header: 'PO号', key: 'quarterCode' },
                { header: '工单号', key: 'assignNum' },
                { header: '泄漏率', key: 'leakRate' },
                { header: '维修前泄漏率', key: 'rateBeforeRepair' },
                { header: '维修前值', key: 'valueBeforeRepair' },
                { header: '维修前背景值', key: 'backgroundValueBeforeRepair' },
                { header: '维修次数', key: 'repairCount' },
                { header: '维修人员', key: 'repairPeople' },
                { header: '维修日期', key: 'repairEndDate' },
                { header: '维修措施', key: 'repairMeasure' },
			]
			worksheet.addRows(exportData)
			const buffer = await workbook.xlsx.writeBuffer()
			const link = document.createElement("a")
			const blobData = new Blob([buffer], { type: "application/vnd.ms-excel;charset=utf-8;" })
			link.download = '检测报告.xlsx'
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
		async queryMediumStatus() {
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
        },
		async getUserInfo() {
			const { data: result } = await this.$http.get('/user/isAdmin')
			this.isAdmin = result.data
		}
    },
    created() {
		this.getUserInfo()
		this.queryData()
		this.queryDevice()
		this.queryArea()
		this.queryEquipment()
        this.queryComponentType()
        this.queryMediumStatus()
    }
}
</script>

<style lang="less" scoped>
</style>
