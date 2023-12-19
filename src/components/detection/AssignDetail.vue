<template>
    <div>
		<el-card>
			<el-form ref="assignDetailFormRef" :model="assignDetailForm" label-width="70px" :inline="true">
				<el-form-item>
                    <el-button type="danger" icon="el-icon-delete" @click="deleteAssign">删除</el-button>
				</el-form-item>
			</el-form>

			<el-table ref="multipleTable" :data="tableData" border style="width: 100%" @selection-change="handleSelectionChange">
				<el-table-column type="index" align="center"></el-table-column>
				<el-table-column type="selection" align="center"></el-table-column>
				<el-table-column prop="assignNum" label="任务编号" align="center" width="220"></el-table-column>
				<el-table-column prop="quarterCode" label="检测周期编码" align="center"></el-table-column>
                <el-table-column prop="detectPeople" label="任务负责人" align="center"></el-table-column>
                <el-table-column prop="detected" label="已检测" align="center"></el-table-column>
				<el-table-column prop="unDetected" label="未检测" align="center"></el-table-column>
				<el-table-column prop="leakFix" label="泄漏" align="center"></el-table-column>
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
export default {
	name: "assignDetail",
	props:{
		quarterCode: {
			type: String,
			default: ''
		},
	},
    data() {
		return {
			tableData: [],
			multipleSelection: [],
			assignDetailForm: {
				quarterCode: '',
				currentPage: 1,
				pageSize: 10,
			},
			currentPage: 1,
            total: 0,
            pageSize: 10,
		}
    },
    methods: {
		async queryAssignDetail(query) {
			if (query) {
				Object.assign(this.assignDetailForm, query)
			}
			Object.assign(this.assignDetailForm, { currentPage: this.currentPage, pageSize: this.pageSize })
			const { data: result } = await this.$http.get('/assignment/queryAssignDetail', { params: this.assignDetailForm })
			this.tableData = result.data.assignOrderData.map(v => {
				v.createDate = this.$moment(v.createDate).format("YYYY-MM-DD HH:mm:ss")
				v.startDate = this.$moment(v.startDate).format("YYYY-MM-DD HH:mm:ss")
                v.endDate = this.$moment(v.endDate).format("YYYY-MM-DD HH:mm:ss")
				return v
			})
			this.total = result.data.total
			this.assignDetailForm.currentPage = 1
		},
		async deleteAssign() {
			if (this.multipleSelection.length === 0 ) {
				this.$message.error('请勾选数据')
				return
			}

			this.$confirm('此操作将永久删除检测周期, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.confirmDeleteAssign()
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消删除'
				})        
			})
		},
		async confirmDeleteAssign() {
			const { data: result } = await this.$http.post('/assignment/deleteAssign', { deleteData: this.multipleSelection })

			if (+result.code === 0) {
				this.$message.success('任务删除成功')
			} else {
				this.$message.error('任务删除失败')
			}

			this.queryAssignDetail()
		},
		handleSizeChange(val){
            this.currentPage = 1
            this.pageSize = val
			this.queryAssignDetail({ currentPage: this.currentPage, pageSize: this.pageSize })
        },
        handleCurrentChange(val){
            this.currentPage = val
			this.queryAssignDetail({ currentPage: this.currentPage, pageSize: this.pageSize })
        },
		handleSelectionChange(val) {
        	this.multipleSelection = val
      	},
    },
	mounted() {
    	this.assignDetailForm.quarterCode = this.quarterCode
		this.queryAssignDetail()
  	},
    created() {
    }
}
</script>

<style lang="less" scoped>
</style>
