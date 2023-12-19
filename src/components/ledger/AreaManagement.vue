<template>
    <div>
		<el-card>
			<el-form ref="areaFormRef" :model="areaForm" label-width="100px" :inline="true">
				<el-form-item label="区域编号">
					<el-input v-model="areaForm.areaNum" clearable></el-input>
				</el-form-item>
				<el-form-item label="区域名称">
					<el-input v-model="areaForm.area" clearable></el-input>
				</el-form-item>
				<el-form-item label="装置名称">
					<el-select v-model="areaForm.deviceNum" placeholder="请选择" clearable>
						<el-option
							v-for="item in deviceOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="el-icon-search" @click="queryArea">查询</el-button>
                    <el-button type="success" icon="el-icon-plus" @click="addAreaDialog = true">新增</el-button>
					<el-button type="warning" icon="el-icon-edit" @click="editArea">编辑</el-button>
					<el-button type="danger" icon="el-icon-delete" @click="deleteArea">删除</el-button>
				</el-form-item>
			</el-form>

			<el-table ref="multipleTable" :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" border style="width: 100%" @selection-change="handleSelectionChange">
				<el-table-column type="index" align="center"></el-table-column>
				<el-table-column type="selection" align="center"></el-table-column>
				<el-table-column fixed prop="_id" v-if="false" align="center"></el-table-column>
				<el-table-column prop="areaNum" label="区域编号" align="center"></el-table-column>
				<el-table-column prop="area" label="区域名称" align="center"></el-table-column>
				<el-table-column prop="deviceNum" label="装置编号" align="center"></el-table-column>
				<el-table-column prop="device" label="装置名称" align="center"></el-table-column>
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
            title="区域状态"
            :visible.sync="addAreaDialog"
            width="30%" @close="dialogClose('addAreaForm')">
            <el-form :model="addAreaForm" ref="addAreaFormRef" label-width="70px">
                <el-form-item label="区域编号" prop="areaNum">
                    <el-input v-model="addAreaForm.areaNum" style="width: 180px"></el-input>
                </el-form-item>
				<el-form-item label="区域名称" prop="area">
                    <el-input v-model="addAreaForm.area" style="width: 180px"></el-input>
                </el-form-item>
				<el-form-item label="装置名称" prop="deviceNum">
                    <el-select v-model="addAreaForm.deviceNum" style="width: 180px">
                        <el-option v-for="item in deviceOptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addAreaDialog = false">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </span>
        </el-dialog>

		<el-dialog
            title="区域状态"
            :visible.sync="editAreaDialog"
            width="30%" @close="dialogClose('editAreaForm')">
            <el-form :model="editAreaForm" ref="editAreaFormRef" label-width="70px">
                <el-form-item label="区域编号" prop="areaNum">
                    <el-input v-model="editAreaForm.areaNum" style="width: 180px"></el-input>
                </el-form-item>
                <el-form-item label="区域名称" prop="area">
                    <el-input v-model="editAreaForm.area" style="width: 180px"></el-input>
                </el-form-item>
				<el-form-item label="装置名称" prop="deviceNum">
                    <el-select v-model="editAreaForm.deviceNum" style="width: 180px">
                        <el-option v-for="item in deviceOptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editAreaDialog = false">取 消</el-button>
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
			areaForm: {
				areaNum: '',
				area: '',
				deviceNum: ''
			},
			addAreaForm: {
				areaNum: '',
				area: '',
				deviceNum: '',
				device:''
			},
			editAreaForm: {
				_id: '',
				areaNum: '',
				area: '',
				deviceNum: '',
				device: ''
			},
			deviceOptions: [],
			multipleSelection: [],
			currentPage: 1,
            total: 0,
            pageSize: 10,
			addAreaDialog: false,
			editAreaDialog: false
		}
    },
    methods: {
		async queryArea() {
			const { data: result } = await this.$http.get('/area/queryArea', { params: this.areaForm })

			const tableData = result.data.map(v => {
				v.createDate = this.$moment(v.createDate).format("YYYY-MM-DD HH:mm:ss")
				v.editDate = this.$moment(v.editDate).format("YYYY-MM-DD HH:mm:ss")
				return v
			})
			this.tableData = tableData
		},
		async submit() {
			for (const item of this.deviceOptions) {
				if (item.value === this.addAreaForm.deviceNum) this.addAreaForm.device = item.label
			}

			const { data: result } = await this.$http.post('/area/addArea', this.addAreaForm)

			if (+result.code === 0) {
				this.$message.success('区域添加成功')
			} else {
				this.$message.error('区域添加失败')
			}
			this.queryArea()
			this.addAreaDialog = false
		},
		editArea() {
			if (this.multipleSelection.length !== 1 ) {
				this.$message.error('请一次勾选一条数据')
				return
			}
			this.editAreaDialog = true
			this.editAreaForm._id = this.multipleSelection[0]._id
			this.editAreaForm.areaNum = this.multipleSelection[0].areaNum
			this.editAreaForm.area = this.multipleSelection[0].area
			this.editAreaForm.device = this.multipleSelection[0].device
			this.editAreaForm.deviceNum = this.multipleSelection[0].deviceNum
		},
		async submitEdit() {
			for (const item of this.deviceOptions) {
				if (item.value === this.editAreaForm.deviceNum) this.editAreaForm.device = item.label
			}

			const { data: result } = await this.$http.post('/area/editArea', this.editAreaForm)

			if (+result.code === 0) {
				this.$message.success('区域编辑成功')
			} else {
				this.$message.error('区域编辑失败')
			}
			this.queryArea()
			this.editAreaDialog = false
		},
		async deleteArea() {
			if (this.multipleSelection.length === 0 ) {
				this.$message.error('请勾选数据')
				return
			}

			this.$confirm('此操作将永久删除该区域, 是否继续?', '提示', {
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
			const { data: result } = await this.$http.post('/area/deleteArea', { deleteData: this.multipleSelection })

			if (+result.code === 0) {
				this.$message.success('区域删除成功')
			} else {
				this.$message.error('区域删除失败')
			}

			this.queryArea()
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
		async queryDevice() {
			const { data: result } = await this.$http.get('/device/queryDevice')

			for (const item of result.data) {
				this.deviceOptions.push({ label: item.device, value: item.deviceNum })
			}
		},
    },
    created() {
		this.queryArea()
		this.queryDevice()
    }
}
</script>

<style lang="less" scoped>
</style>
