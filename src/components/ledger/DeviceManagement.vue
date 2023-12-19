<template>
    <div>
		<el-card>
			<el-form ref="deviceFormRef" :model="deviceForm" label-width="100px" :inline="true">
				<el-form-item label="装置编号">
					<el-input v-model="deviceForm.deviceNum" clearable></el-input>
				</el-form-item>
				<el-form-item label="装置名称">
					<el-input v-model="deviceForm.device" clearable></el-input>
				</el-form-item>
				<el-form-item label="装置类型名称">
					<el-select v-model="deviceForm.deviceType" placeholder="请选择" clearable>
						<el-option
							v-for="item in deviceTypeOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="el-icon-search" @click="queryDevice">查询</el-button>
                    <el-button type="success" icon="el-icon-plus" @click="addDeviceDialog = true">新增</el-button>
					<el-button type="warning" icon="el-icon-edit" @click="editDevice">编辑</el-button>
					<el-button type="danger" icon="el-icon-delete" @click="deleteDevice">删除</el-button>
				</el-form-item>
			</el-form>

			<el-table ref="multipleTable" :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" border style="width: 100%" @selection-change="handleSelectionChange">
				<el-table-column type="index" align="center"></el-table-column>
				<el-table-column type="selection" align="center"></el-table-column>
				<el-table-column fixed prop="_id" v-if="false" align="center"></el-table-column>
				<el-table-column prop="deviceNum" label="装置编号" align="center"></el-table-column>
				<el-table-column prop="device" label="装置名称" align="center"></el-table-column>
				<el-table-column prop="deviceType" label="装置类型" align="center"></el-table-column>
				<el-table-column prop="department" label="部门名称" align="center"></el-table-column>
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
            title="装置状态"
            :visible.sync="addDeviceDialog"
            width="30%" @close="dialogClose('addDeviceForm')">
            <el-form :model="addDeviceForm" ref="addDeviceFormRef" label-width="70px">
                <el-form-item label="装置编号" prop="deviceNum">
                    <el-input v-model="addDeviceForm.deviceNum" style="width: 180px"></el-input>
                </el-form-item>
				<el-form-item label="装置名称" prop="device">
                    <el-input v-model="addDeviceForm.device" style="width: 180px"></el-input>
                </el-form-item>
				<el-form-item label="装置类型" prop="deviceType">
                    <el-select v-model="addDeviceForm.deviceType" style="width: 180px">
                        <el-option v-for="item in deviceTypeOptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
				<el-form-item label="部门名称" prop="department">
                    <el-select v-model="addDeviceForm.department" style="width: 180px">
                        <el-option v-for="item in departmentOptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDeviceDialog = false">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </span>
        </el-dialog>

		<el-dialog
            title="装置状态"
            :visible.sync="editDeviceDialog"
            width="30%" @close="dialogClose('editDeviceForm')">
            <el-form :model="editDeviceForm" ref="editDeviceFormRef" label-width="70px">
                <el-form-item label="装置编号" prop="deviceNum">
                    <el-input v-model="editDeviceForm.deviceNum" style="width: 180px"></el-input>
                </el-form-item>
                <el-form-item label="装置名称" prop="device">
                    <el-input v-model="editDeviceForm.device" style="width: 180px"></el-input>
                </el-form-item>
				<el-form-item label="装置类型" prop="deviceType">
                    <el-select v-model="editDeviceForm.deviceType" style="width: 180px">
                        <el-option v-for="item in deviceTypeOptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
				<el-form-item label="部门名称" prop="department">
                    <el-select v-model="editDeviceForm.department" style="width: 180px">
                        <el-option v-for="item in departmentOptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDeviceDialog = false">取 消</el-button>
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
			deviceForm: {
				deviceNum: '',
				device: '',
				deviceType: ''
			},
			addDeviceForm: {
				deviceNum: '',
				device: '',
				deviceType: '',
				department: ''
			},
			editDeviceForm: {
				_id: '',
				deviceNum: '',
				device: '',
				deviceType: '',
				department: ''
			},
			deviceTypeOptions: [
				{ label: '化工', value: 'CE' },
				{ label: '炼油', value: 'OIL' },
			],
			departmentOptions: [
				{ label: '检测组', value: '检测组' },
				{ label: '技术组', value: '技术组' },
				{ label: '企业用户', value: '企业用户' },
			],
			multipleSelection: [],
			currentPage: 1,
            total: 0,
            pageSize: 10,
			addDeviceDialog: false,
			editDeviceDialog: false
		}
    },
    methods: {
		async queryDevice() {
			const { data: result } = await this.$http.get('/device/queryDevice', { params: this.deviceForm })

			const tableData = result.data.map(v => {
				v.createDate = this.$moment(v.createDate).format("YYYY-MM-DD HH:mm:ss")
				v.editDate = this.$moment(v.editDate).format("YYYY-MM-DD HH:mm:ss")
				for (const item of this.deviceTypeOptions) {
					if (item.value === v.deviceType) v.deviceType = item.label
				}
				return v
			})
			this.tableData = tableData
		},
		async submit() {
			const { data: result } = await this.$http.post('/device/addDevice', this.addDeviceForm)

			if (+result.code === 0) {
				this.$message.success('装置添加成功')
			} else {
				this.$message.error('装置添加失败')
			}
			this.queryDevice()
			this.addDeviceDialog = false
		},
		editDevice() {
			if (this.multipleSelection.length !== 1 ) {
				this.$message.error('请一次勾选一条数据')
				return
			}
			this.editDeviceDialog = true
			this.editDeviceForm.deviceNum = this.multipleSelection[0].deviceNum
			this.editDeviceForm.device = this.multipleSelection[0].device
			this.editDeviceForm.deviceType = this.multipleSelection[0].deviceType
			this.editDeviceForm.department = this.multipleSelection[0].department
		},
		async submitEdit() {
			const { data: result } = await this.$http.post('/device/editDevice', this.editDeviceForm)

			if (+result.code === 0) {
				this.$message.success('装置编辑成功')
			} else {
				this.$message.error('装置编辑失败')
			}
			this.queryDevice()
			this.editDeviceDialog = false
		},
		async deleteDevice() {
			if (this.multipleSelection.length === 0 ) {
				this.$message.error('请勾选数据')
				return
			}

			this.$confirm('此操作将永久删除装置, 是否继续?', '提示', {
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
			const { data: result } = await this.$http.post('/device/deleteDevice', { deleteData: this.multipleSelection })

			if (+result.code === 0) {
				this.$message.success('装置删除成功')
			} else {
				this.$message.error('装置删除失败')
			}

			this.queryDevice()
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
		this.queryDevice()
    }
}
</script>

<style lang="less" scoped>
</style>
