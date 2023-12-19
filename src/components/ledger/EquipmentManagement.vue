<template>
    <div>
		<el-card>
			<el-form ref="equipmentFormRef" :model="equipmentForm" label-width="80px" :inline="true">
				<el-form-item label="设备编号">
					<el-input v-model="equipmentForm.equipmentNum" style="width: 200px" clearable></el-input>
				</el-form-item>
				<el-form-item label="设备名称">
					<el-input v-model="equipmentForm.equipment" style="width: 200px" clearable></el-input>
				</el-form-item>
				<el-form-item label="装置名称">
					<el-select v-model="equipmentForm.deviceNum" placeholder="请选择" @change="queryArea" style="width: 220px" clearable>
						<el-option
							v-for="item in deviceOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="区域名称">
					<el-select v-model="equipmentForm.areaNum" placeholder="请选择" style="width: 220px" clearable>
						<el-option
							v-for="item in areaOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="el-icon-search" @click="queryEquipment">查询</el-button>
                    <el-button type="success" icon="el-icon-plus" @click="addEquipmentDialog = true">新增</el-button>
					<el-button type="warning" icon="el-icon-edit" @click="editEquipment">编辑</el-button>
					<el-button type="danger" icon="el-icon-delete" @click="deleteEquipment">删除</el-button>
				</el-form-item>
			</el-form>

			<el-table ref="multipleTable" :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" border style="width: 100%" @selection-change="handleSelectionChange">
				<el-table-column type="index" align="center"></el-table-column>
				<el-table-column type="selection" align="center"></el-table-column>
				<el-table-column fixed prop="_id" v-if="false" align="center"></el-table-column>
				<el-table-column prop="equipmentNum" label="设备编号" align="center"></el-table-column>
				<el-table-column prop="equipment" label="设备名称" align="center"></el-table-column>
				<el-table-column prop="area" label="区域名称" align="center"></el-table-column>
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
            title="设备状态"
            :visible.sync="addEquipmentDialog"
            width="30%" @close="dialogClose('addEquipmentForm')">
            <el-form :model="addEquipmentForm" ref="addEquipmentFormRef" label-width="70px">
                <el-form-item label="设备编号" prop="equipmentNum">
                    <el-input v-model="addEquipmentForm.equipmentNum" style="width: 180px"></el-input>
                </el-form-item>
				<el-form-item label="设备名称" prop="equipment">
                    <el-input v-model="addEquipmentForm.equipment" style="width: 180px"></el-input>
                </el-form-item>
				<el-form-item label="装置名称" prop="deviceNum">
                    <el-select v-model="addEquipmentForm.deviceNum" style="width: 180px"  @change="addQueryArea">
                        <el-option v-for="item in addEquipmentForm.deviceOptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>	
				<el-form-item label="区域名称" prop="areaNum">
                    <el-select v-model="addEquipmentForm.areaNum" style="width: 180px">
                        <el-option v-for="item in addEquipmentForm.areaOptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addEquipmentDialog = false">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </span>
        </el-dialog>

		<el-dialog
            title="设备状态"
            :visible.sync="editEquipmentDialog"
            width="30%" @close="dialogClose('editEquipmentForm')">
            <el-form :model="editEquipmentForm" ref="editEquipmentFormRef" label-width="70px">
                <el-form-item label="设备编号" prop="equipmentNum">
                    <el-input v-model="editEquipmentForm.equipmentNum" style="width: 180px"></el-input>
                </el-form-item>
                <el-form-item label="设备名称" prop="equipment">
                    <el-input v-model="editEquipmentForm.equipment" style="width: 180px"></el-input>
                </el-form-item>
				<el-form-item label="装置名称" prop="deviceNum">
                    <el-select v-model="editEquipmentForm.deviceNum" style="width: 180px" @change="editQueryArea">
                        <el-option v-for="item in editEquipmentForm.deviceOptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
				<el-form-item label="区域名称" prop="areaNum">
                    <el-select v-model="editEquipmentForm.areaNum" style="width: 180px">
                        <el-option v-for="item in editEquipmentForm.areaOptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>				
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editEquipmentDialog = false">取 消</el-button>
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
			equipmentForm: {
				equipmentNum: '',
				equipment: '',
				areaNum: '',
				deviceNum: '',
			},
			addEquipmentForm: {
				equipmentNum: '',
				equipment: '',
				areaNum:'',
				area: '',
				deviceNum: '',
				device: '',
				deviceOptions: [],
				areaOptions: []
			},
			editEquipmentForm: {
				_id: '',
				equipmentNum: '',
				equipment: '',
				areaNum: '',
				area: '',
				deviceNum: '',
				device: '',
				deviceOptions: [],
				areaOptions: []
			},
			deviceOptions: [],
			areaOptions: [],
			multipleSelection: [],
			currentPage: 1,
            total: 0,
            pageSize: 10,
			addEquipmentDialog: false,
			editEquipmentDialog: false
		}
    },
    methods: {
		async queryEquipment() {
			const { data: result } = await this.$http.get('/equipment/queryEquipment', { params: this.equipmentForm })

			const tableData = result.data.map(v => {
				v.createDate = this.$moment(v.createDate).format("YYYY-MM-DD HH:mm:ss")
				v.editDate = this.$moment(v.editDate).format("YYYY-MM-DD HH:mm:ss")
				return v
			})
			this.tableData = tableData
		},
		async submit() {
			for (const item of this.deviceOptions) {
				if (item.value === this.addEquipmentForm.deviceNum) this.addEquipmentForm.device = item.label
			}
			for (const item of this.addEquipmentForm.areaOptions) {
				if (item.value === this.addEquipmentForm.areaNum) this.addEquipmentForm.area = item.label
			}

			const { data: result } = await this.$http.post('/equipment/addEquipment', this.addEquipmentForm)

			if (+result.code === 0) {
				this.$message.success('设备添加成功')
			} else {
				this.$message.error('设备添加失败')
			}
			this.queryEquipment()
			this.addEquipmentDialog = false
		},
		async editEquipment() {
			if (this.multipleSelection.length !== 1 ) {
				this.$message.error('请一次勾选一条数据')
				return
			}

			const { data: result } = await this.$http.get('/area/queryArea', { params: { deviceNum: this.multipleSelection[0].deviceNum } })
			this.editEquipmentForm.areaOptions = []
			for (const item of result.data) {
				this.editEquipmentForm.areaOptions.push({ label: item.area, value: item.areaNum })
			}

			this.editEquipmentDialog = true
			this.editEquipmentForm.equipmentNum = this.multipleSelection[0].equipmentNum
			this.editEquipmentForm.equipment = this.multipleSelection[0].equipment
			this.editEquipmentForm.deviceNum = this.multipleSelection[0].deviceNum
			this.editEquipmentForm.device = this.multipleSelection[0].device
			this.editEquipmentForm.areaNum = this.multipleSelection[0].areaNum
			this.editEquipmentForm.area = this.multipleSelection[0].area
		},
		async submitEdit() {
			for (const item of this.deviceOptions) {
				if (item.value === this.editEquipmentForm.deviceNum) this.editEquipmentForm.device = item.label
			}
			for (const item of this.editEquipmentForm.areaOptions) {
				if (item.value === this.editEquipmentForm.areaNum) this.editEquipmentForm.area = item.label
			}

			const { data: result } = await this.$http.post('/equipment/editEquipment', this.editEquipmentForm)

			if (+result.code === 0) {
				this.$message.success('设备编辑成功')
			} else {
				this.$message.error('设备编辑失败')
			}
			this.queryEquipment()
			this.editEquipmentDialog = false
		},
		async deleteEquipment() {
			if (this.multipleSelection.length === 0 ) {
				this.$message.error('请勾选数据')
				return
			}

			this.$confirm('此操作将永久删除设备, 是否继续?', '提示', {
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
			const { data: result } = await this.$http.post('/equipment/deleteEquipment', { deleteData: this.multipleSelection })

			if (+result.code === 0) {
				this.$message.success('设备删除成功')
			} else {
				this.$message.error('设备删除失败')
			}

			this.queryEquipment()
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
				this.addEquipmentForm.deviceOptions.push({ label: item.device, value: item.deviceNum })
				this.editEquipmentForm.deviceOptions.push({ label: item.device, value: item.deviceNum })
			}
		},
		async queryArea(deviceNum) {
			this.areaOptions = []
			const { data: result } = await this.$http.get('/area/queryArea', { params: { deviceNum } })
			for (const item of result.data) {
				this.areaOptions.push({ label: item.area, value: item.areaNum })
			}
		},
		async addQueryArea(deviceNum) {
			const { data: result } = await this.$http.get('/area/queryArea', { params: { deviceNum } })
			this.addEquipmentForm.areaOptions = []
			for (const item of result.data) {
				this.addEquipmentForm.areaOptions.push({ label: item.area, value: item.areaNum })
			}
		},
		async editQueryArea(deviceNum) {
			const { data: result } = await this.$http.get('/area/queryArea', { params: { deviceNum } })
			this.editEquipmentForm.areaOptions = []
			for (const item of result.data) {
				this.editEquipmentForm.areaOptions.push({ label: item.area, value: item.areaNum })
			}
		},
    },
    created() {
		this.queryEquipment()
		this.queryDevice()
    }
}
</script>

<style lang="less" scoped>
</style>
