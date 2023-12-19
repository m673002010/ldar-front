<template>
    <div>
		<el-card>
			<el-form ref="calculationTypeFormRef" :model="calculationTypeForm" label-width="100px" :inline="true">
				<el-form-item label="计算类别编号">
					<el-input v-model="calculationTypeForm.calculationTypeNum" clearable></el-input>
				</el-form-item>
				<el-form-item label="计算类别名称">
					<el-input v-model="calculationTypeForm.calculationType" clearable></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="el-icon-search" @click="queryCalculationType">查询</el-button>
                    <el-button type="success" icon="el-icon-plus" @click="addCalculationTypeDialog = true">新增</el-button>
					<el-button type="warning" icon="el-icon-edit" @click="editCalculationType">编辑</el-button>
					<el-button type="danger" icon="el-icon-delete" @click="deleteCalculationType">删除</el-button>
				</el-form-item>
			</el-form>

			<el-table ref="multipleTable" :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" border style="width: 100%"
			@selection-change="handleSelectionChange">
				<el-table-column type="index" align="center"></el-table-column>
				<el-table-column type="selection" align="center"></el-table-column>
				<el-table-column prop="_id" v-if="false" align="center"></el-table-column>
				<el-table-column prop="calculationTypeNum" label="计算类别编号" align="center"></el-table-column>
				<el-table-column prop="calculationType" label="计算类别名称" align="center"></el-table-column>
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

			<el-dialog
				title="计算类型"
				:visible.sync="addCalculationTypeDialog"
				width="30%" @close="dialogClose('addCalculationTypeForm')">
				<el-form :model="addCalculationTypeForm" ref="addCalculationTypeFormRef" label-width="100px">
					<el-form-item label="计算类型编号" prop="calculationTypeNum">
						<el-input v-model="addCalculationTypeForm.calculationTypeNum" style="width: 180px"></el-input>
					</el-form-item>
					<el-form-item label="计算名称" prop="calculationType">
						<el-input v-model="addCalculationTypeForm.calculationType" style="width: 180px"></el-input>
					</el-form-item>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="addCalculationTypeDialog = false">取 消</el-button>
					<el-button type="primary" @click="submit">确 定</el-button>
				</span>
			</el-dialog>

			<el-dialog
				title="计算类型"
				:visible.sync="editCalculationTypeDialog"
				width="30%" @close="dialogClose('editCalculationTypeForm')">
				<el-form :model="editCalculationTypeForm" ref="editCalculationTypeFormRef" label-width="100px">
					<el-form-item label="计算类型编号" prop="calculationTypeNum">
						<el-input v-model="editCalculationTypeForm.calculationTypeNum" style="width: 180px"></el-input>
					</el-form-item>
					<el-form-item label="计算类别" prop="calculationType">
						<el-input v-model="editCalculationTypeForm.calculationType" style="width: 180px"></el-input>
					</el-form-item>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="editCalculationTypeDialog = false">取 消</el-button>
					<el-button type="primary" @click="submitEdit">确 定</el-button>
				</span>
			</el-dialog>
		</el-card>
	</div>
</template>

<script>
export default {
    data() {
		return {
			tableData: [],
			calculationTypeForm: {
				calculationTypeNum: '',
                calculationType: '',
			},
			addCalculationTypeForm: {
				calculationTypeNum: '',
				calculationType: '',
			},
			editCalculationTypeForm: {
				_id: '',
				calculationTypeNum: '',
				calculationType: '',
			},
            multipleSelection: [],
			addCalculationTypeDialog: false,
			editCalculationTypeDialog: false,
			currentPage: 1,
            total: 0,
            pageSize: 10
		}
    },
    methods: {
		async queryCalculationType() {
			const { data: result } = await this.$http.get('/calculationType/queryCalculationType', { params: this.calculationTypeForm })
			const tableData = result.data.map(v => {
				v.createDate = this.$moment(v.createDate).format("YYYY-MM-DD HH:mm:ss")
				v.editDate = this.$moment(v.editDate).format("YYYY-MM-DD HH:mm:ss")
				return v
			})
			this.tableData = tableData
		},
		async submit() {
			const { data: result } = await this.$http.post('/calculationType/addCalculationType', this.addCalculationTypeForm)

			if (+result.code === 0) {
				this.$message.success('组件类型添加成功')
			} else {
				this.$message.error('组件类型添加失败')
			}
			this.queryCalculationType()
			this.addCalculationTypeDialog = false
		},
		editCalculationType() {
			if (this.multipleSelection.length !== 1 ) {
				this.$message.error('请一次勾选一条数据')
				return
			}
			this.editCalculationTypeDialog = true
			this.editCalculationTypeForm._id = this.multipleSelection[0]._id
			this.editCalculationTypeForm.calculationTypeNum = this.multipleSelection[0].calculationTypeNum
			this.editCalculationTypeForm.calculationType = this.multipleSelection[0].calculationType
		},
		async submitEdit() {
			const { data: result } = await this.$http.post('/calculationType/editCalculationType', this.editCalculationTypeForm)

			if (+result.code === 0) {
				this.$message.success('组件类型编辑成功')
			} else {
				this.$message.error('组件类型编辑失败')
			}
			this.queryCalculationType()
			this.editCalculationTypeDialog = false
		},
		async deleteCalculationType() {
			if (this.multipleSelection.length === 0 ) {
				this.$message.error('请勾选数据')
				return
			}
			const { data: result } = await this.$http.post('/calculationType/deleteCalculationType', { deleteData: this.multipleSelection })

			if (+result.code === 0) {
				this.$message.success('组件类型删除成功')
			} else {
				this.$message.error('组件类型删除失败')
			}

			this.queryCalculationType()
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
		this.queryCalculationType()
    }
}
</script>

<style lang="less" scoped>
</style>
