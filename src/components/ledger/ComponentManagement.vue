<template>
    <div>
		<el-card>
			<el-form ref="componentFormRef" :model="componentForm" :inline="true" label-width="50px">
				<el-form-item label="装置">
					<el-select v-model="componentForm.device" placeholder="请选择" clearable>
						<el-option
							v-for="item in deviceOptions"
							:key="item.value"
							:label="item.label"
							:value="item.label">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="区域">
					<el-select v-model="componentForm.area" placeholder="请选择" clearable>
						<el-option
							v-for="item in areaOptions"
							:key="item.value"
							:label="item.label"
							:value="item.label">
						</el-option>
					</el-select>
				</el-form-item>
                <el-form-item label="设备">
					<el-select v-model="componentForm.equipment" placeholder="请选择" clearable>
						<el-option
							v-for="item in equipmentOptions"
							:key="item.value"
							:label="item.label"
							:value="item.label">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="el-icon-search" @click="queryComponent">查询</el-button>
					<el-button type="primary" icon="el-icon-edit" @click="editComponent">编辑</el-button>
					<el-button type="danger" icon="el-icon-delete" @click="deleteComponent">删除</el-button>
				</el-form-item>
			</el-form>
		
			<el-table ref="multipleTable" :data="tableData" border style="width: 100%" @selection-change="handleSelectionChange">
				<el-table-column fixed type="index" align="center"></el-table-column>
				<el-table-column fixed type="selection" align="center"></el-table-column>
				<el-table-column fixed prop="_id" v-if="false" align="center"></el-table-column>
				<el-table-column fixed prop="deviceNum" label="装置编号" v-if="false" align="center"></el-table-column>
				<el-table-column fixed prop="device" label="装置名称" align="center"></el-table-column>
				<el-table-column fixed prop="areaNum" label="区域编号" v-if="false" align="center"></el-table-column>
				<el-table-column fixed prop="area" label="区域名称" align="center"></el-table-column>
				<el-table-column fixed prop="equipmentNum" label="设备编号" v-if="false" align="center"></el-table-column>
				<el-table-column fixed prop="equipment" label="设备名称" align="center"></el-table-column>
				<el-table-column fixed prop="label" label="标签号" align="center"></el-table-column>
				<el-table-column fixed prop="expand" label="扩展号" align="center"></el-table-column>
				<el-table-column fixed prop="componentType" label="组件类型" align="center"></el-table-column>
				<el-table-column fixed prop="medium" label="主要介质" align="center"></el-table-column>
				<el-table-column fixed prop="mediumStatus" label="介质状态" align="center"></el-table-column>
				<el-table-column prop="pid" label="PID图号" align="center"></el-table-column>
				<el-table-column prop="reference" label="参考物" align="center"></el-table-column>
				<el-table-column prop="location" label="位置" align="center"></el-table-column>
				<el-table-column prop="distance" label="距离(米)" align="center"></el-table-column>
				<el-table-column prop="floor" label="楼层" align="center"></el-table-column>
				<el-table-column prop="high" label="高度(米)" align="center"></el-table-column>
				<el-table-column prop="description" label="附加描述" align="center"></el-table-column>
				<el-table-column prop="size" label="尺寸(mm)" align="center"></el-table-column>
				<el-table-column prop="unreachable" label="是否不可达" align="center"></el-table-column>
				<el-table-column prop="reason" label="不可达原因" align="center"></el-table-column>
				<el-table-column prop="quantity" label="数量" align="center"></el-table-column>
			</el-table>

            <el-pagination align='center' @size-change="handleSizeChange" @current-change="handleCurrentChange" 
                :current-page="currentPage" 
                :page-sizes="[1, 10, 50, 100]" 
                :page-size="pageSize" 
                layout="total, sizes, prev, pager, next, jumper" 
                :total="total">
            </el-pagination>
		</el-card>

		<el-dialog
            title="组件"
            :visible.sync="editComponentDialog"
            width="30%" @close="dialogClose('editComponentForm')">
            <el-form :model="editComponentForm" ref="editComponentFormRef" label-width="100px">
                <el-form-item label="装置名称" prop="device">
                    <el-input v-model="editComponentForm.device" style="width: 180px"></el-input>
                </el-form-item>
                <el-form-item label="区域名称" prop="area">
                    <el-input v-model="editComponentForm.area" style="width: 180px"></el-input>
                </el-form-item>
                <el-form-item label="设备名称" prop="equipment">
                    <el-input v-model="editComponentForm.equipment" style="width: 180px"></el-input>
                </el-form-item>
                <el-form-item label="标签号" prop="label">
                    <el-input v-model="editComponentForm.label" style="width: 180px"></el-input>
                </el-form-item>
                <el-form-item label="扩展号" prop="expand">
                    <el-input v-model="editComponentForm.expand" style="width: 180px"></el-input>
                </el-form-item>
                <el-form-item label="组件类型" prop="componentType">
                    <el-input v-model="editComponentForm.componentType" style="width: 180px"></el-input>
                </el-form-item>
                <el-form-item label="PID图号" prop="pid">
                    <el-input v-model="editComponentForm.pid" style="width: 180px"></el-input>
                </el-form-item>
                <el-form-item label="参考物" prop="reference">
                    <el-input v-model="editComponentForm.reference" style="width: 180px"></el-input>
                </el-form-item>
                <el-form-item label="位置" prop="location">
                    <el-input v-model="editComponentForm.location" style="width: 180px"></el-input>
                </el-form-item>
                <el-form-item label="距离(米)" prop="distance">
                    <el-input v-model="editComponentForm.distance" style="width: 180px"></el-input>
                </el-form-item>
                <el-form-item label="楼层" prop="floor">
                    <el-input v-model="editComponentForm.floor" style="width: 180px"></el-input>
                </el-form-item>
                <el-form-item label="高度(米)" prop="high">
                    <el-input v-model="editComponentForm.high" style="width: 180px"></el-input>
                </el-form-item>
				<el-form-item label="附加描述" prop="description">
                    <el-input v-model="editComponentForm.description" style="width: 180px"></el-input>
                </el-form-item>
				<el-form-item label="尺寸(mm)" prop="size">
                    <el-input v-model="editComponentForm.size" style="width: 180px"></el-input>
                </el-form-item>
				<el-form-item label="是否不可达" prop="unreachable">
                    <el-input v-model="editComponentForm.unreachable" style="width: 180px"></el-input>
                </el-form-item>
				<el-form-item label="不可达原因" prop="reason">
                    <el-input v-model="editComponentForm.reason" style="width: 180px"></el-input>
                </el-form-item>
				<el-form-item label="主要介质" prop="medium">
                    <el-input v-model="editComponentForm.medium" style="width: 180px"></el-input>
                </el-form-item>
				<el-form-item label="介质状态" prop="mediumStatus">
                    <el-input v-model="editComponentForm.mediumStatus" style="width: 180px"></el-input>
                </el-form-item>
				<el-form-item label="数量" prop="quantity">
                    <el-input v-model="editComponentForm.quantity" style="width: 180px"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editComponentDialog = false">取 消</el-button>
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
			componentForm: {
				device: '',
				area: '',
				equipment: '',
				currentPage: 1,
				pageSize: 10
			},
			editComponentForm: {
				_id: '',
				deviceNum: '',
				device: '',
				areaNum: '',
				area: '',
				equipmentNum: '',
				equipment: '',
				label: '',
				expand: '',
				pid: '',
				reference: '',
				location: '',
				distance: '',
				floor: '',
				high: '',
				description: '',
				componentType: '',
				mediumStatus: '',
				unreachable: '',
				reason: '',
				size: '',
				ifWarm: '',
				medium: '',
				FLAGNum: '',
				FLAG: '',
				barCode: '',
				quantity: '',
				picture: '',
				markPicture: '',
				markPosition: '',
				timestamp: ''
			},
			deviceOptions: [],
			areaOptions: [],
			equipmentOptions: [],
			multipleSelection: [],
			currentPage: 1,
            total: 0,
            pageSize: 10,
			editComponentDialog: false
		}
    },
    methods: {
		async queryComponent(query) {
			if (query) {
				Object.assign(this.componentForm, query)
			}
			const { data: result } = await this.$http.get('/component/queryComponent', { params: this.componentForm })
			this.tableData = result.data.componentData
			this.total = result.data.total
		},
		async editComponent() {
			if (this.multipleSelection.length !== 1 ) {
				this.$message.error('请一次勾选一条数据')
				return
			}
			this.editComponentDialog = true

			this.editComponentDialog = true
			this.editComponentForm._id = this.multipleSelection[0]._id
			this.editComponentForm.device = this.multipleSelection[0].device
			this.editComponentForm.area = this.multipleSelection[0].area
			this.editComponentForm.equipment = this.multipleSelection[0].equipment
			this.editComponentForm.label = this.multipleSelection[0].label
			this.editComponentForm.expand = this.multipleSelection[0].expand
			this.editComponentForm.componentType = this.multipleSelection[0].componentType
			this.editComponentForm.pid = this.multipleSelection[0].pid
			this.editComponentForm.reference = this.multipleSelection[0].reference
			this.editComponentForm.location = this.multipleSelection[0].location
			this.editComponentForm.distance = this.multipleSelection[0].distance
			this.editComponentForm.floor = this.multipleSelection[0].floor
			this.editComponentForm.high = this.multipleSelection[0].high
			this.editComponentForm.description = this.multipleSelection[0].description
			this.editComponentForm.size = this.multipleSelection[0].size
			this.editComponentForm.unreachable = this.multipleSelection[0].unreachable
			this.editComponentForm.medium = this.multipleSelection[0].medium
			this.editComponentForm.mediumStatus = this.multipleSelection[0].mediumStatus
			this.editComponentForm.quantity = this.multipleSelection[0].quantity
		},
		async submitEdit() {
			const { data: result } = await this.$http.post('/component/editComponent', { editParams: this.editComponentForm })

			if (+result.code === 0) {
				this.$message.success('组件编辑成功')
			} else {
				this.$message.error('组件编辑失败')
			}

			this.queryComponent()
			this.editComponentDialog = false
		},
		async deleteComponent() {
			if (this.multipleSelection.length === 0 ) {
				this.$message.error('请勾选数据')
				return
			}
			const { data: result } = await this.$http.post('/component/deleteComponent', { deleteData: this.multipleSelection })

			if (+result.code === 0) {
				this.$message.success('组件删除成功')
			} else {
				this.$message.error('组件删除失败')
			}

			this.queryComponent()
		},
		async queryDevice() {
			const { data: result } = await this.$http.get('/device/queryDevice')

			for (const item of result.data) {
				this.deviceOptions.push({ label: item.device, value: item.deviceNum })
			}
		},
		async queryArea() {
			const { data: result } = await this.$http.get('/area/queryArea')

			const areaOptions = []
			for (const item of result.data) {
				areaOptions.push({ label: item.area, value: item.areaNum })
				// 区域去重避免键冲突
				this.areaOptions = [...new Set(areaOptions.map(item => JSON.stringify(item)))].map(item => JSON.parse(item))
			}
		},
		async queryEquipment() {
			const { data: result } = await this.$http.get('/equipment/queryEquipment')

			const equipmentOptions = []
			for (const item of result.data) {
				equipmentOptions.push({ label: item.equipment, value: item.equipmentNum })
				// 设备去重避免键冲突
				this.equipmentOptions = [...new Set(equipmentOptions.map(item => JSON.stringify(item)))].map(item => JSON.parse(item))
			}
		},
		handleSizeChange(val){
            this.currentPage = 1
            this.pageSize = val
			this.queryComponent({ currentPage: this.currentPage, pageSize: this.pageSize })
        },
        handleCurrentChange(val){
            this.currentPage = val
			this.queryComponent({ currentPage: this.currentPage, pageSize: this.pageSize })
        },
		handleSelectionChange(val) {
        	this.multipleSelection = val
      	},
		dialogClose (form) { // 关闭对话框
            this.$refs[`${form}Ref`].resetFields()
        },
    },
    created() {
		this.queryComponent()
		this.queryDevice()
		this.queryArea()
		this.queryEquipment()
    }
}
</script>

<style lang="less" scoped>
</style>
