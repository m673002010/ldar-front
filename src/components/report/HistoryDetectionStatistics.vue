<template>
    <div>
		<el-card>
			<el-form ref="hdsFormRef" :model="hdsForm" label-width="50px" :inline="true">
				<el-form-item label="年份">
					<el-select v-model="hdsForm.year" placeholder="请选择" clearable>
						<el-option
							v-for="item in yearOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="el-icon-search" @click="queryHds">查询</el-button>
				</el-form-item>
                <el-form-item>
					<el-button type="primary" icon="el-icon-plus" @click="addHdsDialog = true">新增</el-button>
				</el-form-item>
                <el-form-item>
					<el-button type="primary" icon="el-icon-edit" @click="editHds">编辑</el-button>
				</el-form-item>
                <el-form-item>
					<el-button type="danger" icon="el-icon-delete" @click="deleteHds">删除</el-button>
				</el-form-item>
			</el-form>

			<el-table ref="multipleTable" :data="tableData" border style="width: 100%" @selection-change="handleSelectionChange">
				<el-table-column type="index" align="center"></el-table-column>
				<el-table-column type="selection" align="center"></el-table-column>
				<el-table-column prop="_id" v-if="false" align="center"></el-table-column>
				<el-table-column prop="detectionCycle" label="检测周期" align="center"></el-table-column>
				<el-table-column prop="shouldDetect" label="应测点数" align="center"></el-table-column>
				<el-table-column prop="hasDetect" label="实测点数" align="center"></el-table-column>
				<el-table-column prop="leakPoint" label="泄漏点数" align="center"></el-table-column>
				<el-table-column prop="finishRatio" label="完成率" align="center"></el-table-column>
				<el-table-column prop="leakRatio" label="泄漏率" align="center"></el-table-column>
				<el-table-column prop="emissionBeforeRepair" label="维修前排放量(千克)" align="center"></el-table-column>
                <el-table-column prop="emissionAfterRepair" label="维修后排放量(千克)" align="center"></el-table-column>
				<el-table-column prop="emissionDecrease" label="减排量(千克)" align="center"></el-table-column>
			</el-table>
		</el-card>

		<el-dialog
            title="添加"
            :visible.sync="addHdsDialog"
            width="30%" @close="dialogClose('addHdsForm')">
            <el-form :model="addHdsForm" ref="addHdsFormRef" label-width="150px">
                <el-form-item label="检测周期" prop="detectionCycle">
                    <el-input v-model="addHdsForm.detectionCycle" style="width: 250px"></el-input>
                </el-form-item>
                <el-form-item label="应测点数" prop="shouldDetect">
                    <el-input v-model="addHdsForm.shouldDetect" style="width: 250px"></el-input>
                </el-form-item>
				<el-form-item label="实测点数" prop="hasDetect">
                    <el-input v-model="addHdsForm.hasDetect" style="width: 250px"></el-input>
                </el-form-item>
				<el-form-item label="泄漏点数" prop="leakPoint">
                    <el-input v-model="addHdsForm.leakPoint" style="width: 250px"></el-input>
                </el-form-item>
                <el-form-item label="维修前排放量(千克)" prop="emissionBeforeRepair">
                    <el-input v-model="addHdsForm.emissionBeforeRepair" style="width: 250px"></el-input>
                </el-form-item>
                <el-form-item label="维修后排放量(千克)" prop="emissionAfterRepair">
                    <el-input v-model="addHdsForm.emissionAfterRepair" style="width: 250px"></el-input>
                </el-form-item>
                <el-form-item label="减排量(千克)" prop="emissionDecrease">
                    <el-input v-model="addHdsForm.emissionDecrease" style="width: 250px"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addHdsDialog = false">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </span>
        </el-dialog>

		<el-dialog
            title="编辑"
            :visible.sync="editHdsDialog"
            width="30%" @close="dialogClose('editHdsForm')">
            <el-form :model="editHdsForm" ref="editHdsFormRef" label-width="150px">
                <el-form-item label="检测周期" prop="detectionCycle">
                    <el-input v-model="editHdsForm.detectionCycle" style="width: 250px"></el-input>
                </el-form-item>
                <el-form-item label="应测点数" prop="shouldDetect">
                    <el-input v-model="editHdsForm.shouldDetect" style="width: 250px"></el-input>
                </el-form-item>
				<el-form-item label="实测点数" prop="hasDetect">
                    <el-input v-model="editHdsForm.hasDetect" style="width: 250px"></el-input>
                </el-form-item>
				<el-form-item label="泄漏点数" prop="leakPoint">
                    <el-input v-model="editHdsForm.leakPoint" style="width: 250px"></el-input>
                </el-form-item>
                <el-form-item label="维修前排放量(千克)" prop="emissionBeforeRepair">
                    <el-input v-model="editHdsForm.emissionBeforeRepair" style="width: 250px"></el-input>
                </el-form-item>
                <el-form-item label="维修后排放量(千克)" prop="emissionAfterRepair">
                    <el-input v-model="editHdsForm.emissionAfterRepair" style="width: 250px"></el-input>
                </el-form-item>
                <el-form-item label="减排量(千克)" prop="emissionDecrease">
                    <el-input v-model="editHdsForm.emissionDecrease" style="width: 250px"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editHdsDialog = false">取 消</el-button>
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
			hdsForm: {
				year: '2023',
			},
			addHdsForm: {
				detectionCycle: '',
				shouldDetect: '',
				hasDetect: '',
				leakPoint: '',
				emissionBeforeRepair: '',
				emissionAfterRepair: '',
				emissionDecrease: '',
			},
			editHdsForm: {
				_id: '',
				detectionCycle: '',
				shouldDetect: '',
				hasDetect: '',
				leakPoint: '',
				emissionBeforeRepair: '',
				emissionAfterRepair: '',
				emissionDecrease: '',
			},
			yearOptions: [
				{ label: '2023', value: '2023' }
			],
			multipleSelection: [],
			addHdsDialog: false,
			editHdsDialog: false,
		}
    },
    methods: {
		async queryHds() {
			const { data: result } = await this.$http.get('/hds/historyDetectionStatistics', { params: this.hdsForm })
			this.tableData = result.data
			this.tableData = this.tableData.map(item => {
				item.finishRatio = (item.hasDetect / item.shouldDetect * 100).toFixed(2) + '%'
				item.leakRatio = (item.leakPoint / item.shouldDetect * 100).toFixed(2) + '%'
				return item
			})
		},
		async submit() {
			const { data: result } = await this.$http.post('/hds/addHds', this.addHdsForm)

			if (+result.code === 0) {
				this.$message.success('历史排放统计添加成功')
			} else {
				this.$message.error('历史排放统计添加失败')
			}
			this.queryHds()
			this.addHdsDialog = false
		},
		editHds() {
			if (this.multipleSelection.length !== 1 ) {
				this.$message.error('请一次勾选一条数据')
				return
			}
			this.editHdsDialog = true
			this.editHdsForm._id = this.multipleSelection[0]._id
			this.editHdsForm.detectionCycle = this.multipleSelection[0].detectionCycle
			this.editHdsForm.shouldDetect = this.multipleSelection[0].shouldDetect
			this.editHdsForm.hasDetect = this.multipleSelection[0].hasDetect
			this.editHdsForm.leakPoint = this.multipleSelection[0].leakPoint
			this.editHdsForm.emissionBeforeRepair = this.multipleSelection[0].emissionBeforeRepair
			this.editHdsForm.emissionAfterRepair = this.multipleSelection[0].emissionAfterRepair
			this.editHdsForm.emissionDecrease = this.multipleSelection[0].emissionDecrease
		},
		async submitEdit() {
			const { data: result } = await this.$http.post('/hds/editHds', { editParams: this.editHdsForm })

			if (+result.code === 0) {
				this.$message.success('历史排放统计编辑成功')
			} else {
				this.$message.error('历史排放统计编辑失败')
			}
			this.queryHds()
			this.editHdsDialog = false
		},
		async deleteHds() {
			if (this.multipleSelection.length === 0 ) {
				this.$message.error('请勾选数据')
				return
			}
			const { data: result } = await this.$http.post('/hds/deleteHds', { deleteData: this.multipleSelection })

			if (+result.code === 0) {
				this.$message.success('历史排放统计删除成功')
			} else {
				this.$message.error('历史排放统计删除失败')
			}

			this.queryHds()
		},
      	handleSelectionChange(val) {
        	this.multipleSelection = val
      	},
		dialogClose (form) { // 关闭对话框
            this.$refs[`${form}Ref`].resetFields()
        },
    },
    created() {
		this.queryHds()
    }
}
</script>

<style lang="less" scoped>
</style>
