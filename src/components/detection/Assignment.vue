<template>
    <div>
		<el-card>
			<el-form ref="assignmentFormRef" :model="assignmentForm" label-width="70px" :inline="true">
				<el-form-item label="年度">
					<el-select v-model="assignmentForm.year" placeholder="请选择" clearable>
						<el-option
							v-for="item in yearOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="检测时间">
					<el-select v-model="assignmentForm.quarter" placeholder="请选择" clearable>
						<el-option
							v-for="item in quarterOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="el-icon-search" @click="queryAssignment">查询</el-button>
                    <el-button type="success" icon="el-icon-plus" @click="addAssignmentDialog = true">新增检测周期</el-button>
                    <el-button type="danger" icon="el-icon-delete" @click="deleteAssignment">删除</el-button>
				</el-form-item>
			</el-form>

			<el-table ref="multipleTable" :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" border style="width: 100%" @selection-change="handleSelectionChange">
				<el-table-column type="index" align="center"></el-table-column>
                <el-table-column type="selection" align="center"></el-table-column>
                <el-table-column label="分配" align="center" v-if="isAdmin">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="assign(scope.row)">分配</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="任务详情" align="center" width="110">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="assignDetail(scope.row)">任务详情</el-button>
                    </template>
                </el-table-column>
				<el-table-column prop="quarterCode" label="检测周期编码" align="center" width="220"></el-table-column>
				<el-table-column prop="quarter" label="检测周期" align="center"></el-table-column>
                <el-table-column prop="year" label="年度" align="center"></el-table-column>
                <el-table-column prop="detectType" label="检测类型" align="center"></el-table-column>
                <el-table-column prop="totalPoint" label="总点数" align="center"></el-table-column>
				<el-table-column prop="assigned" label="已分配" align="center"></el-table-column>
				<el-table-column prop="detected" label="已检测" align="center"></el-table-column>
                <el-table-column prop="unDetected" label="未检测" align="center"></el-table-column>
                <el-table-column prop="leakFix" label="泄漏/修复" align="center"></el-table-column>
                <el-table-column prop="startDate" label="开始时间" align="center"></el-table-column>
                <el-table-column prop="endDate" label="结束时间" align="center"></el-table-column>
				<!-- <el-table-column prop="createDate" label="创建时间" align="center"></el-table-column>
				<el-table-column prop="createUser" label="创建人" align="center"></el-table-column>  -->
			</el-table>

            <el-pagination align='center' @size-change="handleSizeChange" @current-change="handleCurrentChange" 
                :current-page="currentPage" 
                :page-sizes="[1, 5, 10, 20]" 
                :page-size="pageSize" 
                layout="total, sizes, prev, pager, next, jumper" 
                :total="tableData.length">
            </el-pagination>
		</el-card>

		<el-dialog
            title="新建检测周期"
            :visible.sync="addAssignmentDialog"
            width="30%" @close="dialogClose('addAssignmentForm')">
            <el-form :model="addAssignmentForm" ref="addAssignmentFormRef" label-width="70px">
				<el-form-item label="年度">
					<el-select v-model="addAssignmentForm.year" placeholder="请选择" clearable>
						<el-option
							v-for="item in yearOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="检测时间">
					<el-select v-model="addAssignmentForm.quarter" placeholder="请选择" clearable>
						<el-option
							v-for="item in quarterOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="检测类型">
					<el-select v-model="addAssignmentForm.detectType" placeholder="请选择" clearable>
						<el-option
							v-for="item in detectTypeOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addAssignmentDialog = false">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </span>
        </el-dialog>

        <div v-if="assignDialog">
            <el-dialog :visible.sync="assignDialog" width="80%">
                <assign :quarterCode="quarterCode"></assign>
            </el-dialog>
        </div>

        <div v-if="assignDetailDialog">
            <el-dialog :visible.sync="assignDetailDialog" width="100%">
                <assignDetail :quarterCode="quarterCode"></assignDetail>
            </el-dialog>
        </div>
	</div>
</template>

<script>
import assign from './Assign.vue'
import assignDetail from './AssignDetail.vue'

export default {
    data() {
		return {
            quarterCode: '',
			tableData: [],
			assignmentForm: {
				year: '',
				quarter: '',
			},
			addAssignmentForm: {
				year: '',
				quarter: '',
				detectType: '',
			},
			yearOptions: [
				{ label: '2023', value: '2023' }
			],
			quarterOptions: [
				{ label: '第1季度', value: '第1季度' },
				{ label: '第2季度', value: '第2季度' },
				{ label: '第3季度', value: '第3季度' },
                { label: '第4季度', value: '第4季度' },
			],
            detectTypeOptions: [
				{ label: '周期检', value: '周期检' },
                { label: '全检测', value: '全检测' },
			],
			currentPage: 1,
            total: 0,
            pageSize: 10,
            multipleSelection: [],
			addAssignmentDialog: false,
            assignDialog: false,
            assignDetailDialog: false,
			isAdmin: 0,
		}
    },
    methods: {
        assign(row) {
            this.assignDialog = true
            this.quarterCode = row.quarterCode
        },
        assignDetail(row) {
            this.assignDetailDialog = true
            this.quarterCode = row.quarterCode
        },
		async queryAssignment() {
			const { data: result } = await this.$http.get('/assignment/queryAssignment', { params: this.assignmentForm })

			const tableData = result.data.map(v => {
				v.createDate = this.$moment(v.createDate).format("YYYY-MM-DD HH:mm:ss")
				v.startDate = this.$moment(v.startDate).format("YYYY-MM-DD HH:mm:ss")
                v.endDate = this.$moment(v.endDate).format("YYYY-MM-DD HH:mm:ss")
				return v
			})
			this.tableData = tableData
		},
		async submit() {
			const { data: result } = await this.$http.post('/assignment/addAssignment', this.addAssignmentForm)

			if (+result.code === 0) {
				this.$message.success('任务添加成功')
			} else {
				this.$message.error('任务添加失败')
			}
			this.queryAssignment()
			this.addAssignmentDialog = false
		},
		async deleteAssignment() {
			if (this.multipleSelection.length === 0 ) {
				this.$message.error('请勾选数据')
				return
			}

			this.$confirm('此操作将永久删除检测周期, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.confirmDelete()
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消删除'
				})        
			})
		},
		async confirmDelete() {
			const { data: result } = await this.$http.post('/assignment/deleteAssignment', { deleteData: this.multipleSelection })

			if (+result.code === 0) {
				this.$message.success('任务删除成功')
			} else {
				this.$message.error('任务删除失败')
			}

			this.queryAssignment()
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
		dialogClose (form) {
            this.$refs[`${form}Ref`].resetFields()
        },
		async getUserInfo() {
			const { data: result } = await this.$http.get('/user/isAdmin')
			this.isAdmin = result.data
		}
    },
    created() {
		this.queryAssignment()
		this.getUserInfo()
    },
    components:{
		assign,
        assignDetail
	},
}
</script>

<style lang="less" scoped>
</style>
