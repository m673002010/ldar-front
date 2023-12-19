<template>
    <div>
		<el-card>
			<el-form ref="companyFormRef" :model="companyForm" label-width="100px" :inline="true">
				<el-form-item label="公司编号">
					<el-input v-model="companyForm.companyNum" clearable></el-input>
				</el-form-item>
				<el-form-item label="公司名称">
					<el-input v-model="companyForm.fullName" clearable></el-input>
				</el-form-item>
                <el-form-item label="公司简称">
					<el-input v-model="companyForm.shortName" clearable></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="el-icon-search" @click="queryCompany">查询</el-button>
                    <el-button type="success" icon="el-icon-plus" @click="addCompanyDialog = true">新增</el-button>
					<el-button type="warning" icon="el-icon-edit" @click="editCompany">编辑</el-button>
					<el-button type="danger" icon="el-icon-delete" @click="deleteCompany">删除</el-button>
				</el-form-item>
			</el-form>

			<el-table ref="multipleTable" :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" border style="width: 100%" @selection-change="handleSelectionChange">
				<el-table-column type="index" align="center"></el-table-column>
				<el-table-column type="selection" align="center"></el-table-column>
                <el-table-column prop="_id" v-if="false" align="center"></el-table-column>
				<el-table-column prop="companyNum" label="公司编号" align="center"></el-table-column>
				<el-table-column prop="fullName" label="公司名称" align="center"></el-table-column>
				<el-table-column prop="shortName" label="公司简称" align="center"></el-table-column>
				<el-table-column prop="province" label="省份" align="center"></el-table-column>
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
            title="添加公司"
            :visible.sync="addCompanyDialog"
            width="30%" @close="dialogClose('addCompanyForm')">
            <el-form :model="addCompanyForm" ref="addCompanyFormRef" label-width="70px">
                <el-form-item label="公司编号" prop="companyNum">
                    <el-input v-model="addCompanyForm.companyNum" style="width: 180px"></el-input>
                </el-form-item>
				<el-form-item label="公司名称" prop="fullName">
                    <el-input v-model="addCompanyForm.fullName" style="width: 180px"></el-input>
                </el-form-item>
				<el-form-item label="公司简称" prop="shortName">
                    <el-input v-model="addCompanyForm.shortName" style="width: 180px"></el-input>
                </el-form-item>
                <el-form-item label="省份" prop="province">
                    <el-input v-model="addCompanyForm.province" style="width: 180px"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCompanyDialog = false">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </span>
        </el-dialog>

		<el-dialog
            title="公司状态"
            :visible.sync="editCompanyDialog"
            width="30%" @close="dialogClose('editCompanyForm')">
            <el-form :model="editCompanyForm" ref="editCompanyFormRef" label-width="70px">
                <el-form-item label="公司编号" prop="companyNum">
                    <el-input v-model="editCompanyForm.companyNum" disabled style="width: 180px"></el-input>
                </el-form-item>
                <el-form-item label="公司名称" prop="fullName">
                    <el-input v-model="editCompanyForm.fullName" style="width: 180px"></el-input>
                </el-form-item>
				<el-form-item label="公司简称" prop="shortName">
                    <el-input v-model="editCompanyForm.shortName" style="width: 180px"></el-input>
                </el-form-item>
                <el-form-item label="省份" prop="province">
                    <el-input v-model="editCompanyForm.province" style="width: 180px"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editCompanyDialog = false">取 消</el-button>
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
			companyForm: {
				companyNum: '',
				fullName: '',
				shortName: ''
			},
			addCompanyForm: {
				companyNum: '',
				fullName: '',
				shortName: '',
				province: ''
			},
			editCompanyForm: {
                _id: '',
				companyNum: '',
				fullName: '',
				shortName: '',
				province: ''
			},
			multipleSelection: [],
			currentPage: 1,
            total: 0,
            pageSize: 10,
			addCompanyDialog: false,
			editCompanyDialog: false
		}
    },
    methods: {
		async queryCompany() {
			const { data: result } = await this.$http.get('/company/queryCompany', { params: this.companyForm })

			const tableData = result.data.map(v => {
				v.createDate = this.$moment(v.createDate).format("YYYY-MM-DD HH:mm:ss")
				v.editDate = this.$moment(v.editDate).format("YYYY-MM-DD HH:mm:ss")
				return v
			})
			this.tableData = tableData
		},
		async submit() {
			const { data: result } = await this.$http.post('/company/addCompany', this.addCompanyForm)

			if (+result.code === 0) {
				this.$message.success('公司添加成功')
			} else {
				this.$message.error('公司添加失败')
			}
			this.queryCompany()
			this.addCompanyDialog = false
		},
		editCompany() {
			if (this.multipleSelection.length !== 1 ) {
				this.$message.error('请一次勾选一条数据')
				return
			}
			this.editCompanyDialog = true
            this.editCompanyForm._id = this.multipleSelection[0]._id
			this.editCompanyForm.companyNum = this.multipleSelection[0].companyNum
			this.editCompanyForm.fullName = this.multipleSelection[0].fullName
			this.editCompanyForm.shortName = this.multipleSelection[0].shortName
			this.editCompanyForm.province = this.multipleSelection[0].province
		},
		async submitEdit() {
			const { data: result } = await this.$http.post('/company/editCompany', { editParams: this.editCompanyForm })

			if (+result.code === 0) {
				this.$message.success('公司编辑成功')
			} else {
				this.$message.error('公司编辑失败')
			}
			this.queryCompany()
			this.editCompanyDialog = false
		},
		async deleteCompany() {
			if (this.multipleSelection.length === 0 ) {
				this.$message.error('请勾选数据')
				return
			}
			const { data: result } = await this.$http.post('/company/deleteCompany', { deleteData: this.multipleSelection })

			if (+result.code === 0) {
				this.$message.success('公司删除成功')
			} else {
				this.$message.error('公司删除失败')
			}

			this.queryCompany()
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
		this.queryCompany()
    }
}
</script>

<style lang="less" scoped>
</style>
