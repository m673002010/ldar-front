<template>
    <div>
		<el-card>
			<el-form ref="mediumForm" :model="mediumForm" label-width="80px" :inline="true">
				<el-form-item label="介质编号">
					<el-input v-model="mediumForm.mediumNum" clearable></el-input>
				</el-form-item>
				<el-form-item label="介质名称">
					<el-input v-model="mediumForm.medium" clearable></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="el-icon-search" @click="queryMedium">查询</el-button>
                    <el-button type="success" icon="el-icon-plus" @click="addMediumDialog = true">新增</el-button>
					<el-button type="warning" icon="el-icon-edit" @click="editMedium">编辑</el-button>
					<el-button type="danger" icon="el-icon-delete" @click="deleteMedium">删除</el-button>
				</el-form-item>
			</el-form>
            
			<el-table ref="multipleTable" :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" border style="width: 100%"
			@selection-change="handleSelectionChange">
				<el-table-column type="index" align="center"></el-table-column>
				<el-table-column type="selection" align="center"></el-table-column>
				<el-table-column prop="_id" v-if="false" align="center"></el-table-column>
				<el-table-column prop="mediumNum" label="介质编号" align="center"></el-table-column>
				<el-table-column prop="medium" label="介质名称" align="center"></el-table-column>
				<el-table-column prop="report" label="导出报告" align="center"></el-table-column>
				<!-- <el-table-column prop="createDate" label="创建时间" align="center"></el-table-column>
				<el-table-column prop="createUser" label="创建人" align="center"></el-table-column>
				<el-table-column prop="editDate" label="修改时间" align="center"></el-table-column> -->
				<el-table-column prop="editUser" label="修改人" align="center"></el-table-column>
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
            title="介质状态"
            :visible.sync="addMediumDialog"
            width="30%" @close="dialogClose('addMediumForm')">
            <el-form :model="addMediumForm" ref="addMediumFormRef" label-width="70px">
                <el-form-item label="介质编号" prop="mediumNum">
                    <el-input v-model="addMediumForm.mediumNum" style="width: 180px"></el-input>
                </el-form-item>
				<el-form-item label="导出报告" prop="report">
                    <el-select v-model="addMediumForm.report" style="width: 180px">
                        <el-option v-for="(report, index) in reportOptions" :key="index" :label="report" :value="report">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="介质名称" prop="medium">
                    <el-input v-model="addMediumForm.medium" style="width: 180px"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addMediumDialog = false">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </span>
        </el-dialog>

		<el-dialog
            title="介质状态"
            :visible.sync="editMediumDialog"
            width="30%" @close="dialogClose('editMediumForm')">
            <el-form :model="editMediumForm" ref="editMediumFormRef" label-width="70px">
                <el-form-item label="介质编号" prop="mediumNum">
                    <el-input v-model="editMediumForm.mediumNum" style="width: 180px"></el-input>
                </el-form-item>
				<el-form-item label="导出报告" prop="report">
                    <el-select v-model="editMediumForm.report" style="width: 180px">
                        <el-option v-for="(report, index) in reportOptions" :key="index" :label="report" :value="report">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="介质名称" prop="medium">
                    <el-input v-model="editMediumForm.medium" style="width: 180px"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editMediumDialog = false">取 消</el-button>
                <el-button type="primary" @click="submitEdit">确 定</el-button>
            </span>
        </el-dialog>
	</div>
</template>

<script>
export default {
    data() {
		return {
			tableData: [],
			mediumForm: {
				mediumNum: '',
				medium: '',
			},
			addMediumForm: {
				mediumNum: '',
				medium: '',
				report: ''
			},
			editMediumForm: {
				_id: '',
				mediumNum: '',
				medium: '',
				report: ''
			},
			reportOptions: [
				'Gas/Vapor',
				'Heavy Liquid',
				'Light Liquid'
			],
            multipleSelection: [],
			currentPage: 1,
            total: 0,
            pageSize: 10,
			addMediumDialog: false,
			editMediumDialog: false
		}
    },
    methods: {
		async queryMedium() {
			const { data: result } = await this.$http.get('/medium/queryMedium', { params: this.mediumForm })

			const tableData = result.data.map(v => {
				v.createDate = this.$moment(v.createDate).format("YYYY-MM-DD HH:mm:ss")
				v.editDate = this.$moment(v.editDate).format("YYYY-MM-DD HH:mm:ss")
				return v
			})
			this.tableData = tableData
		},
		async submit() {
			const { data: result } = await this.$http.post('/medium/addMedium', this.addMediumForm)

			if (+result.code === 0) {
				this.$message.success('介质添加成功')
			} else {
				this.$message.error('介质添加失败')
			}
			this.queryMedium()
			this.addMediumDialog = false
		},
		editMedium() {
			if (this.multipleSelection.length !== 1 ) {
				this.$message.error('请一次勾选一条数据')
				return
			}
			this.editMediumDialog = true
			this.editMediumForm._id = this.multipleSelection[0]._id
			this.editMediumForm.mediumNum = this.multipleSelection[0].mediumNum
			this.editMediumForm.medium = this.multipleSelection[0].medium
			this.editMediumForm.report = this.multipleSelection[0].report
		},
		async submitEdit() {
			const { data: result } = await this.$http.post('/medium/editMedium', this.editMediumForm)

			if (+result.code === 0) {
				this.$message.success('介质编辑成功')
			} else {
				this.$message.error('介质编辑失败')
			}
			this.queryMedium()
			this.editMediumDialog = false
		},
		async deleteMedium() {
			if (this.multipleSelection.length === 0 ) {
				this.$message.error('请勾选数据')
				return
			}
			const { data: result } = await this.$http.post('/medium/deleteMedium', { deleteData: this.multipleSelection })

			if (+result.code === 0) {
				this.$message.success('介质删除成功')
			} else {
				this.$message.error('介质删除失败')
			}

			this.queryMedium()
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
		this.queryMedium()
    }
}
</script>

<style lang="less" scoped>
</style>
