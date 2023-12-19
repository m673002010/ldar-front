<template>
    <div>
		<el-card>
			<el-form ref="deviceTypeFormRef" :model="deviceTypeForm" label-width="100px" :inline="true">
				<el-form-item label="装置类型编号">
					<el-input v-model="deviceTypeForm.deviceTypeNum" clearable></el-input>
				</el-form-item>
				<el-form-item label="装置类型名称">
					<el-input v-model="deviceTypeForm.deviceType" clearable></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="el-icon-search" @click="queryDeviceType">查询</el-button>
                    <el-button type="success" icon="el-icon-plus" @click="addDeviceTypeDialog = true">新增</el-button>
					<el-button type="warning" icon="el-icon-edit" @click="editDeviceType">编辑</el-button>
					<el-button type="danger" icon="el-icon-delete" @click="deleteDeviceType">删除</el-button>
				</el-form-item>
			</el-form>

			<el-table ref="multipleTable" :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" border style="width: 100%"
			@selection-change="handleSelectionChange">
				<el-table-column type="index" align="center"></el-table-column>
				<el-table-column type="selection" align="center"></el-table-column>
				<el-table-column prop="_id" align="center" v-if="false"></el-table-column>
				<el-table-column prop="deviceTypeNum" label="装置类型编号" align="center"></el-table-column>
				<el-table-column prop="type" label="类型" align="center"></el-table-column>
                <el-table-column prop="deviceType" label="装置类型名称" align="center"></el-table-column>
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
				title="装置类型"
				:visible.sync="addDeviceTypeDialog"
				width="30%" @close="dialogClose('addDeviceTypeForm')">
				<el-form :model="addDeviceTypeForm" ref="addDeviceTypeFormRef" label-width="100px">
					<el-form-item label="装置类型编号" prop="deviceTypeNum">
						<el-input v-model="addDeviceTypeForm.deviceTypeNum" style="width: 180px"></el-input>
					</el-form-item>
					<el-form-item label="装置名称" prop="deviceType">
						<el-input v-model="addDeviceTypeForm.deviceType" style="width: 180px"></el-input>
					</el-form-item>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="addDeviceTypeDialog = false">取 消</el-button>
					<el-button type="primary" @click="submit">确 定</el-button>
				</span>
			</el-dialog>

			<el-dialog
				title="装置类型"
				:visible.sync="editDeviceTypeDialog"
				width="30%" @close="dialogClose('editDeviceTypeForm')">
				<el-form :model="editDeviceTypeForm" ref="editDeviceTypeFormRef" label-width="100px">
					<el-form-item label="装置类型编号" prop="deviceTypeNum">
						<el-input v-model="editDeviceTypeForm.deviceTypeNum" style="width: 180px"></el-input>
					</el-form-item>
					<el-form-item label="装置类别" prop="deviceType">
						<el-input v-model="editDeviceTypeForm.deviceType" style="width: 180px"></el-input>
					</el-form-item>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="editDeviceTypeDialog = false">取 消</el-button>
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
			deviceTypeForm: {
				deviceTypeNum: '',
                deviceType: '',
			},
			addDeviceTypeForm: {
				deviceTypeNum: '',
                deviceType: '',
			},
			editDeviceTypeForm: {
				_id: '',
				deviceTypeNum: '',
                deviceType: '',
			},
            multipleSelection: [],
			addDeviceTypeDialog: false,
			editDeviceTypeDialog: false,
			currentPage: 1,
            total: 0,
            pageSize: 10
		}
    },
    methods: {
		async queryDeviceType() {
			const { data: result } = await this.$http.get('/deviceType/queryDeviceType', { params: this.deviceTypeForm })
			const tableData = result.data.map(v => {
				v.createDate = this.$moment(v.createDate).format("YYYY-MM-DD HH:mm:ss")
				v.editDate = this.$moment(v.editDate).format("YYYY-MM-DD HH:mm:ss")
				return v
			})
			this.tableData = tableData
		},
		async submit() {
			const { data: result } = await this.$http.post('/deviceType/addDeviceType', this.addDeviceTypeForm)

			if (+result.code === 0) {
				this.$message.success('组件类型添加成功')
			} else {
				this.$message.error('组件类型添加失败')
			}
			this.queryDeviceType()
			this.addDeviceTypeDialog = false
		},
		editDeviceType() {
			if (this.multipleSelection.length !== 1 ) {
				this.$message.error('请一次勾选一条数据')
				return
			}
			this.editDeviceTypeDialog = true
			this.editDeviceTypeForm._id = this.multipleSelection[0]._id
			this.editDeviceTypeForm.deviceTypeNum = this.multipleSelection[0].deviceTypeNum
			this.editDeviceTypeForm.deviceType = this.multipleSelection[0].deviceType
		},
		async submitEdit() {
			const { data: result } = await this.$http.post('/deviceType/editDeviceType', this.editDeviceTypeForm)

			if (+result.code === 0) {
				this.$message.success('组件类型编辑成功')
			} else {
				this.$message.error('组件类型编辑失败')
			}
			this.queryDeviceType()
			this.editDeviceTypeDialog = false
		},
		async deleteDeviceType() {
			if (this.multipleSelection.length === 0 ) {
				this.$message.error('请勾选数据')
				return
			}
			const { data: result } = await this.$http.post('/deviceType/deleteDeviceType', { deleteData: this.multipleSelection })

			if (+result.code === 0) {
				this.$message.success('组件类型删除成功')
			} else {
				this.$message.error('组件类型删除失败')
			}

			this.queryDeviceType()
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
		this.queryDeviceType()
    }
}
</script>

<style lang="less" scoped>
</style>
