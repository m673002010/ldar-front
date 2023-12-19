<template>
    <div>
		<el-card>
			<el-form ref="noAssignFormRef" :model="noAssignForm" label-width="100px" :inline="true">
				<el-form-item label="检测周期编码">
					<el-input v-model="noAssignForm.quarterCode" style="width: 180px" disabled></el-input>
				</el-form-item>
				<el-form-item label="装置">
					<el-select v-model="noAssignForm.device" placeholder="请选择" clearable>
						<el-option
							v-for="item in deviceOptions"
							:key="item.value"
							:label="item.label"
							:value="item.label">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="区域">
					<el-select v-model="noAssignForm.area" placeholder="请选择" clearable>
						<el-option
							v-for="item in areaOptions"
							:key="item.value"
							:label="item.label"
							:value="item.label">
						</el-option>
					</el-select>
				</el-form-item>
                <el-form-item label="设备">
					<el-select v-model="noAssignForm.equipment" placeholder="请选择" clearable>
						<el-option
							v-for="item in equipmentOptions"
							:key="item.value"
							:label="item.label"
							:value="item.label">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="动静密封">
                    <el-select v-model="noAssignForm.sealPointType" placeholder="请选择" clearable>
						<el-option
							v-for="item in sealPointTypeOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
                <el-form-item label="是否不可达">
                    <el-select v-model="noAssignForm.unreachable" placeholder="请选择" clearable>
						<el-option
							v-for="item in unreachableOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="el-icon-search" @click="queryNoAssign">查询</el-button>
                    <el-button type="primary" icon="el-icon-plus" @click="assignDialog = true">分配</el-button>
					<el-button type="primary" icon="el-icon-plus" @click="pick">挑选分配</el-button>
				</el-form-item>
			</el-form>

			<el-table ref="multipleTable" :data="tableData" border style="width: 100%" @selection-change="handleSelectionChange">
				<el-table-column type="index" align="center"></el-table-column>
				<el-table-column type="selection" align="center"></el-table-column>
				<el-table-column prop="_id" align="center" v-if="false"></el-table-column>
				<el-table-column prop="device" label="装置" align="center" width="220"></el-table-column>
				<el-table-column prop="area" label="区域" align="center"></el-table-column>
                <el-table-column prop="equipment" label="设备" align="center"></el-table-column>
                <el-table-column prop="label" label="标签号" align="center"></el-table-column>
				<el-table-column prop="expand" label="扩展号" align="center"></el-table-column>
				<el-table-column prop="location" label="位置描述" align="center"></el-table-column>
                <el-table-column prop="assignStatus" label="状态" align="center"></el-table-column>
			</el-table>

            <el-pagination align='center' @size-change="handleSizeChange" @current-change="handleCurrentChange" 
                :current-page="currentPage" 
                :page-sizes="[1, 5, 10, 20]" 
                :page-size="pageSize" 
                layout="total, sizes, prev, pager, next, jumper" 
                :total="total">
            </el-pagination>
		</el-card>

		<el-dialog
            title="任务分配"
            :visible.sync="assignDialog"
            width="30%" @close="dialogClose('assignForm')">
            <el-form :model="assignForm" ref="assignFormRef" label-width="70px">
				<el-form-item label="任务编号">
					<el-input v-model="assignForm.assignNum"></el-input>
				</el-form-item>
				<el-form-item label="任务负责人">
					<el-input v-model="assignForm.detectPeople"></el-input>
				</el-form-item>
				<el-form-item label="分配点数">
					<el-input v-model="assignForm.assignPoint"></el-input>
				</el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="assignDialog = false">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </span>
        </el-dialog>

		<el-dialog
            title="挑选分配"
            :visible.sync="pickDialog"
            width="30%" @close="dialogClose('pickForm')">
            <el-form :model="pickForm" ref="pickFormRef" label-width="70px">
				<el-form-item label="任务编号">
					<el-input v-model="pickForm.assignNum"></el-input>
				</el-form-item>
				<el-form-item label="任务负责人">
					<el-input v-model="pickForm.detectPeople"></el-input>
				</el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="pickDialog = false">取 消</el-button>
                <el-button type="primary" @click="confirmPick">确 定</el-button>
            </span>
        </el-dialog>
	</div>
</template>

<script>
export default {
	name: "assign",
	props:{
		quarterCode: {
			type: String,
			default: ''
		},
	},
    data() {
		return {
			tableData: [],
			noAssignForm: {
				quarterCode: '',
				device: '',
				area: '',
				equipment: '',
				sealPointType: '',
				unreachable: '',
				currentPage: 1,
				pageSize: 10,
			},
			assignForm: {
				assignNum: '',
				detectPeople: '',
				assignPoint: 0,
			},
			pickForm: {
				assignNum: '',
				detectPeople: '',
			},
			deviceOptions: [],
			areaOptions: [],
			equipmentOptions: [],
			sealPointTypeOptions: [
                { label: '静密封', value: '静密封' },
                { label: '动密封', value: '动密封' },
            ],
			unreachableOptions: [
				{ label: '是', value: '是' },
                { label: '否', value: '否' },
			],
			multipleSelection: [],
			currentPage: 1,
            total: 0,
            pageSize: 10,
			assignDialog: false,
			pickDialog: false,
		}
    },
    methods: {
		async queryNoAssign(query) {
			if (query) {
				Object.assign(this.noAssignForm, query)
			}

			Object.assign(this.noAssignForm, { currentPage: this.currentPage, pageSize: this.pageSize })
			const { data: result } = await this.$http.get('/assignment/queryNoAssign', { params: this.noAssignForm })
			this.tableData = result.data.componentData
			this.total = result.data.total
			this.noAssignForm.currentPage = 1
		},
		async submit() {
			Object.assign(this.assignForm, { quarterCode: this.quarterCode })
			const { data: result } = await this.$http.post('/assignment/assign', this.assignForm)

			if (+result.code === 0) {
				this.$message.success('任务分配成功')
			} else {
				this.$message.error('任务分配失败')
			}
			this.queryNoAssign()
			this.assignDialog = false
		},
		pick() {
			if (this.multipleSelection.length === 0 ) {
				this.$message.error('请勾选数据')
				return
			}

			this.pickDialog = true
		},
		confirmPick() {
			this.$confirm('确认分配勾选的任务吗, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.submitPick()
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消分配'
				})        
			})
		},
		async submitPick(){
			this.pickDialog = false

			const { data: result } = await this.$http.post('/assignment/pick', Object.assign({ pickData: this.multipleSelection, quarterCode: this.quarterCode }, this.pickForm))

			if (+result.code === 0) {
				this.$message.success('挑选分配成功')
			} else {
				this.$message.error('挑选分配失败')
			}

			this.queryNoAssign()
		},
		handleSizeChange(val){
            this.currentPage = 1
            this.pageSize = val
			this.queryNoAssign({ currentPage: this.currentPage, pageSize: this.pageSize })
        },
        handleCurrentChange(val){
            this.currentPage = val
			this.queryNoAssign({ currentPage: this.currentPage, pageSize: this.pageSize })
        },
		dialogClose (form) { // 关闭对话框
            this.$refs[`${form}Ref`].resetFields()
        },
		handleSelectionChange(val) {
        	this.multipleSelection = val
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
    },
	watch: { // 监听，父组件quarterCode变化，子组件也变化
		quarterCode(newVal, oldVal) {
			this.noAssignForm.quarterCode = newVal
		}
	},
	mounted() {
    	this.noAssignForm.quarterCode = this.quarterCode
		this.queryNoAssign()
  	},
    created() {
		this.queryDevice()
		this.queryArea()
		this.queryEquipment()
    }
}
</script>

<style lang="less" scoped>
</style>
