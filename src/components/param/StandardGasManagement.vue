<template>
    <div>
		<el-card>
			<el-form ref="standardGasRef" :model="standardGasForm" label-width="100px" :inline="true">
				<el-form-item label="标准气编号:">
					<el-input v-model="standardGasForm.standardGasNum" clearable></el-input>
				</el-form-item>
				<el-form-item label="标准气名称:">
					<el-input v-model="standardGasForm.standardGas" clearable></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="el-icon-search" @click="queryStandardGas">查询</el-button>
                    <el-button type="success" icon="el-icon-plus" @click="addStandardGasDialog = true">新增</el-button>
					<el-button type="warning" icon="el-icon-edit" @click="editStandardGas">编辑</el-button>
					<el-button type="danger" icon="el-icon-delete" @click="deleteStandardGas">删除</el-button>
				</el-form-item>
			</el-form>

			<el-table ref="multipleTable" :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" border style="width: 100%"
			@selection-change="handleSelectionChange">
				<el-table-column type="index" align="center"></el-table-column>
				<el-table-column type="selection" align="center"></el-table-column>
				<el-table-column prop="_id" v-if="false" align="center"></el-table-column>
				<el-table-column prop="standardGasNum" label="标准气编号" align="center"></el-table-column>
				<el-table-column prop="standardGas" label="标准气名称" align="center"></el-table-column>
				<el-table-column prop="type" label="类型" align="center"></el-table-column>
                <el-table-column prop="standardGasTheory" label="标准气理论浓度" align="center"></el-table-column>
                <el-table-column prop="standardGasActual" label="标准气实际浓度" align="center"></el-table-column>
                <el-table-column prop="dailyCalibration" label="需要日常校准" align="center">
					<template slot-scope="scope">{{scope.row.dailyCalibration ? "是" : "否"}}</template>
				</el-table-column>
                <el-table-column prop="needDriftCalibration" label="需要漂移校准" align="center">
					<template slot-scope="scope">{{scope.row.needDriftCalibration ? "是" : "否"}}</template>
				</el-table-column>
                <el-table-column prop="validTime" label="有效日期" align="center"></el-table-column>
                <el-table-column prop="stopUse" label="停用" align="center">
					<template slot-scope="scope">{{scope.row.stopUse ? "是" : "否"}}</template>
				</el-table-column>
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
            title="标准气管理"
            :visible.sync="addStandardGasDialog"
            width="30%" @close="dialogClose('addStandardGasForm')">
            <el-form :model="addStandardGasForm" ref="addStandardGasFormRef" label-width="150px">
                <el-form-item label="标准气编号" prop="standardGasNum">
                    <el-input v-model="addStandardGasForm.standardGasNum" style="width: 200px"></el-input>
                </el-form-item>
                <el-form-item label="标准气名称" prop="standardGas">
                    <el-input v-model="addStandardGasForm.standardGas" style="width: 200px"></el-input>
                </el-form-item>
                <el-form-item label="标准气理论浓度" prop="standardGasTheory">
                    <el-input v-model="addStandardGasForm.standardGasTheory" style="width: 200px"></el-input>
                </el-form-item>
				<el-form-item label="标准气实际浓度" prop="standardGasActual">
                    <el-input v-model="addStandardGasForm.standardGasActual" style="width: 200px"></el-input>
                </el-form-item>
				<el-form-item label="类型" prop="type">
                    <el-select v-model="addStandardGasForm.type" style="width: 200px">
                        <el-option v-for="(type, index) in typeOptions" :key="index" :label="type" :value="type">
                        </el-option>
                    </el-select>
                </el-form-item>
				<el-form-item label="需要日常校准" prop="dailyCalibration">
                    <el-radio v-model="addStandardGasForm.dailyCalibration" label="1">是</el-radio>
  					<el-radio v-model="addStandardGasForm.dailyCalibration" label="0">否</el-radio>
                </el-form-item>
				<el-form-item label="需要漂移校准" prop="needDriftCalibration">
                    <el-radio v-model="addStandardGasForm.needDriftCalibration" label="1">是</el-radio>
  					<el-radio v-model="addStandardGasForm.needDriftCalibration" label="0">否</el-radio>
                </el-form-item>
				<el-form-item label="有效日期" prop="validTime">
					<el-date-picker v-model="addStandardGasForm.validTime" type="datetime" placeholder="选择日期时间" style="width: 200px"></el-date-picker>
                </el-form-item>
				<el-form-item label="停用" prop="stopUse">
					<el-radio v-model="addStandardGasForm.stopUse" label="1">是</el-radio>
  					<el-radio v-model="addStandardGasForm.stopUse" label="0">否</el-radio>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addStandardGasDialog = false">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </span>
        </el-dialog>

		<el-dialog
            title="标准气管理"
            :visible.sync="editStandardGasDialog"
            width="30%" @close="dialogClose('editStandardGasForm')">
            <el-form :model="editStandardGasForm" ref="editStandardGasFormRef" label-width="150px">
                <el-form-item label="标准气编号" prop="standardGasNum">
                    <el-input v-model="editStandardGasForm.standardGasNum" style="width: 200px"></el-input>
                </el-form-item>
                <el-form-item label="标准气名称" prop="standardGas">
                    <el-input v-model="editStandardGasForm.standardGas" style="width: 200px"></el-input>
                </el-form-item>
                <el-form-item label="标准气理论浓度" prop="standardGasTheory">
                    <el-input v-model="editStandardGasForm.standardGasTheory" style="width: 200px"></el-input>
                </el-form-item>
				<el-form-item label="标准气实际浓度" prop="standardGasActual">
                    <el-input v-model="editStandardGasForm.standardGasActual" style="width: 200px"></el-input>
                </el-form-item>
				<el-form-item label="类型" prop="type">
                    <el-select v-model="editStandardGasForm.type" style="width: 200px">
                        <el-option v-for="(type, index) in typeOptions" :key="index" :label="type" :value="type">
                        </el-option>
                    </el-select>
                </el-form-item>
				<el-form-item label="需要日常校准" prop="dailyCalibration">
                    <el-radio v-model="editStandardGasForm.dailyCalibration" label="1">是</el-radio>
  					<el-radio v-model="editStandardGasForm.dailyCalibration" label="0">否</el-radio>
                </el-form-item>
				<el-form-item label="需要漂移校准" prop="needDriftCalibration">
                    <el-radio v-model="editStandardGasForm.needDriftCalibration" label="1">是</el-radio>
  					<el-radio v-model="editStandardGasForm.needDriftCalibration" label="0">否</el-radio>
                </el-form-item>
				<el-form-item label="有效日期" prop="validTime">
					<el-date-picker v-model="editStandardGasForm.validTime" type="datetime" placeholder="选择日期时间" style="width: 200px"></el-date-picker>			
                </el-form-item>
				<el-form-item label="停用" prop="stopUse">
					<el-radio v-model="editStandardGasForm.stopUse" label="1">是</el-radio>
  					<el-radio v-model="editStandardGasForm.stopUse" label="0">否</el-radio>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editStandardGasDialog = false">取 消</el-button>
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
			standardGasForm: {
				standardGasNum: '',
                standardGas: '',
			},
			addStandardGasForm: {
				standardGasNum: '',
                standardGas: '',
				dailyCalibration: '0',
				needDriftCalibration: '0',
				type: '',
				standardGasActual: '',
				standardGasTheory: '',
				validTime: '',
				stopUse: '0',
			},
			editStandardGasForm: {
				_id: '',
				standardGasNum: '',
                standardGas: '',
				dailyCalibration: '0',
				needDriftCalibration: '0',
				type: '',
				standardGasActual: '',
				standardGasTheory: '',
				validTime: '',
				stopUse: '0',
			},
			typeOptions: [
				'零气',
				'校准气'
			],
            multipleSelection: [],
			currentPage: 1,
            total: 0,
            pageSize: 10,
			addStandardGasDialog: false,
			editStandardGasDialog: false
		}
    },
    methods: {
		async queryStandardGas() {
			const { data: result } = await this.$http.get('/standardGas/queryStandardGas', { params: this.standardGasForm })
			const tableData = result.data.map(v => {
				v.validTime = this.$moment(v.validTime).format("YYYY-MM-DD HH:mm:ss")
				v.createDate = this.$moment(v.createDate).format("YYYY-MM-DD HH:mm:ss")
				v.editDate = this.$moment(v.editDate).format("YYYY-MM-DD HH:mm:ss")
				return v
			})
			this.tableData = tableData
		},
		async submit() {
			const { data: result } = await this.$http.post('/standardGas/addStandardGas', this.addStandardGasForm)

			if (+result.code === 0) {
				this.$message.success('标准气添加成功')
			} else {
				this.$message.error('标准气添加失败')
			}
			this.queryStandardGas()
			this.addStandardGasDialog = false
		},
		editStandardGas() {
			if (this.multipleSelection.length !== 1 ) {
				this.$message.error('请一次勾选一条数据')
				return
			}
			this.editStandardGasDialog = true

			this.editStandardGasForm._id = this.multipleSelection[0]._id
			this.editStandardGasForm.standardGasNum = this.multipleSelection[0].standardGasNum
			this.editStandardGasForm.standardGas = this.multipleSelection[0].standardGas
			this.editStandardGasForm.dailyCalibration = this.multipleSelection[0].dailyCalibration
			this.editStandardGasForm.needDriftCalibration = this.multipleSelection[0].needDriftCalibration
			this.editStandardGasForm.type = this.multipleSelection[0].type
			this.editStandardGasForm.standardGasActual = this.multipleSelection[0].standardGasActual
			this.editStandardGasForm.standardGasTheory = this.multipleSelection[0].standardGasTheory
			this.editStandardGasForm.validTime = this.multipleSelection[0].validTime
			this.editStandardGasForm.stopUse = this.multipleSelection[0].stopUse
		},
		async submitEdit() {
			const { data: result } = await this.$http.post('/standardGas/editStandardGas', this.editStandardGasForm)

			if (+result.code === 0) {
				this.$message.success('标准气编辑成功')
			} else {
				this.$message.error('标准气编辑失败')
			}
			this.queryStandardGas()
			this.editStandardGasDialog = false
		},
		async deleteStandardGas() {
			if (this.multipleSelection.length === 0 ) {
				this.$message.error('请勾选数据')
				return
			}
			const { data: result } = await this.$http.post('/standardGas/deleteStandardGas', { deleteData: this.multipleSelection })

			if (+result.code === 0) {
				this.$message.success('标准气删除成功')
			} else {
				this.$message.error('标准气删除失败')
			}

			this.queryStandardGas()
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
        }
    },
    created() {
		this.queryStandardGas()
    }
}
</script>

<style lang="less" scoped>
</style>
