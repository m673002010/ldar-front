<template>
    <div>
		<el-card>
			<el-form ref="ddtFormRef" :model="ddtForm" label-width="100px" :inline="true">
				<el-form-item label="周期编号">
					<el-select v-model="ddtForm.quarterCode" placeholder="请选择" clearable>
						<el-option
							v-for="(item, index) in quarterCodeOptions"
							:key="index"
							:label="item"
							:value="item">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="任务单名称">
					<el-select v-model="ddtForm.assignNum" placeholder="请选择" clearable>
						<el-option
							v-for="(item, index) in assignNumOptions"
							:key="index"
							:label="item"
							:value="item">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="任务负责人">
					<el-input v-model="ddtForm.detectPeople" clearable></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="el-icon-search" @click="queryTask">查询</el-button>
                    <el-button type="primary" icon="el-icon-download" @click="downloadTask">下载</el-button>
				</el-form-item>
			</el-form>

			<el-table ref="multipleTable" :data="tableData" border style="width: 100%" @selection-change="handleSelectionChange">
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
			tableData: [],
			multipleSelection: [],
            quarterCodeOptions: [],
            assignNumOptions: [],
			ddtForm: {
				quarterCode: '',
                assignNum: '',
                detectPeople: '',
				currentPage: 1,
				pageSize: 10,
			},
			currentPage: 1,
            total: 0,
            pageSize: 10,
		}
    },
    methods: {
		async queryTask(query) {
			if (query) {
				Object.assign(this.ddtForm, query)
			}
			Object.assign(this.ddtForm, { currentPage: this.currentPage, pageSize: this.pageSize })
			const { data: result } = await this.$http.get('/downloadDetectionTask/queryTask', { params: this.ddtForm })
			this.tableData = result.data.assignOrderData.map(v => {
				v.createDate = this.$moment(v.createDate).format("YYYY-MM-DD HH:mm:ss")
				return v
			})
			this.total = result.data.total
			this.ddtForm.currentPage = 1
		},
		async downloadTask() {
			if (this.multipleSelection.length !== 1 ) {
				this.$message.error('请一次选择一条数据')
				return
			}
            const { quarterCode, assignNum } = this.multipleSelection[0]
			const { data: result } = await this.$http.get('/downloadDetectionTask/downloadTask', { params: { quarterCode, assignNum } })
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
				// { header: '时间戳', key: 'timestamp' },
			]
			worksheet.addRows(exportData)
			const buffer = await workbook.xlsx.writeBuffer()
			const link = document.createElement("a")
			const blobData = new Blob([buffer], { type: "application/vnd.ms-excel;charset=utf-8;" })
			link.download = `检测任务${assignNum}.xlsx`
			link.href = URL.createObjectURL(blobData)
			link.click()
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
    	this.ddtForm.quarterCode = this.quarterCode
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
