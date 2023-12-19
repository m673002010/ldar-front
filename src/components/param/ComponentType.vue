<template>
    <div>
		<el-card>
			<el-form ref="componentTypeForm" :model="componentTypeForm" label-width="100px" :inline="true">
				<el-form-item label="组件类型编号">
					<el-input v-model="componentTypeForm.componentTypeNum" clearable></el-input>
				</el-form-item>
				<el-form-item label="组件类型名称">
					<el-input v-model="componentTypeForm.componentType" clearable></el-input>
				</el-form-item>
                <el-form-item label="计算类别名称">
					<el-select v-model="componentTypeForm.calculationType" placeholder="请选择" clearable>
						<el-option
							v-for="(calculationType, index) in calculationTypeOptions"
							:key="index"
							:label="calculationType"
							:value="calculationType">
						</el-option>
					</el-select>
				</el-form-item>
                <el-form-item label="密封类型">
					<el-select v-model="componentTypeForm.sealPointType" placeholder="请选择" clearable>
						<el-option
							v-for="(sealPointType, index) in sealPointTypeOptions"
							:key="index"
							:label="sealPointType"
							:value="sealPointType">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="el-icon-search" @click="queryComponentType">查询</el-button>
                    <el-button type="success" icon="el-icon-plus" @click="addComponentTypeDialog = true">新增</el-button>
					<el-button type="warning" icon="el-icon-edit" @click="editComponentType">编辑</el-button>
					<el-button type="danger" icon="el-icon-delete" @click="deleteComponentType">删除</el-button>
				</el-form-item>
			</el-form>

			<el-table ref="multipleTable" :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" border style="width: 100%"
			@selection-change="handleSelectionChange">
				<el-table-column type="index" align="center"></el-table-column>
				<el-table-column type="selection" align="center"></el-table-column>
				<el-table-column prop="_id" align="center" v-if="false"></el-table-column>
				<el-table-column prop="componentTypeNum" label="组件类型编号" align="center"></el-table-column>
				<el-table-column prop="componentType" label="组件类型名称" align="center"></el-table-column>
				<el-table-column prop="calculationType" label="计算类别" align="center"></el-table-column>
				<el-table-column prop="sealPointType" label="密封点类型" align="center"></el-table-column>
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
            title="组件类型"
            :visible.sync="addComponentTypeDialog"
            width="30%" @close="dialogClose('addComponentTypeForm')">
            <el-form :model="addComponentTypeForm" ref="addComponentTypeFormRef" label-width="100px">
                <el-form-item label="组件类型编号" prop="componentTypeNum">
                    <el-input v-model="addComponentTypeForm.componentTypeNum" style="width: 180px"></el-input>
                </el-form-item>
                <el-form-item label="组件类型名称" prop="componentType">
                    <el-input v-model="addComponentTypeForm.componentType" style="width: 180px"></el-input>
                </el-form-item>
				<el-form-item label="计算类别" prop="calculationType">
                    <el-select v-model="addComponentTypeForm.calculationType" style="width: 180px">
                        <el-option v-for="(calculationType, index) in calculationTypeOptions" :key="index" :label="calculationType" :value="calculationType">
                        </el-option>
                    </el-select>
                </el-form-item>
				<el-form-item label="密封点类型" prop="sealPointType">
                    <el-select v-model="addComponentTypeForm.sealPointType" style="width: 180px">
                        <el-option v-for="(sealPointType, index) in sealPointTypeOptions" :key="index" :label="sealPointType" :value="sealPointType">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addComponentTypeDialog = false">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </span>
        </el-dialog>

		<el-dialog
            title="组件类型"
            :visible.sync="editComponentTypeDialog"
            width="30%" @close="dialogClose('editComponentTypeForm')">
            <el-form :model="editComponentTypeForm" ref="editComponentTypeFormRef" label-width="100px">
                <el-form-item label="组件类型编号" prop="componentTypeNum">
                    <el-input v-model="editComponentTypeForm.componentTypeNum" style="width: 180px"></el-input>
                </el-form-item>
                <el-form-item label="组件类型名称" prop="componentType">
                    <el-input v-model="editComponentTypeForm.componentType" style="width: 180px"></el-input>
                </el-form-item>
				<el-form-item label="计算类别" prop="calculationType">
                    <el-select v-model="editComponentTypeForm.calculationType" style="width: 180px">
                        <el-option v-for="(calculationType, index) in calculationTypeOptions" :key="index" :label="calculationType" :value="calculationType">
                        </el-option>
                    </el-select>
                </el-form-item>
				<el-form-item label="密封点类型" prop="sealPointType">
                    <el-select v-model="editComponentTypeForm.sealPointType" style="width: 180px">
                        <el-option v-for="(sealPointType, index) in sealPointTypeOptions" :key="index" :label="sealPointType" :value="sealPointType">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editComponentTypeDialog = false">取 消</el-button>
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
			componentTypeForm: {
				componentTypeNum: '',
				componentType: '',
                calculationType: '',
				sealPointType: ''
			},
			addComponentTypeForm: {
				componentTypeNum: '',
				componentType: '',
                calculationType: '',
				sealPointType: ''
			},
			editComponentTypeForm: {
				_id: '',
				componentTypeNum: '',
				componentType: '',
                calculationType: '',
				sealPointType: ''
			},
            calculationTypeOptions: [
				'搅拌器',
				'连接件',
				'压缩机',
				'法兰',
				'其他',
				'开口阀或开口管线',
				'泵及轴封',
				'泄压设备',
				'取样连接系统',
				'阀门',
			],
			sealPointTypeOptions: [
				'动密封',
				'静密封'
			],
            multipleSelection: [],
			addComponentTypeDialog: false,
			editComponentTypeDialog: false,
			currentPage: 1,
            total: 0,
            pageSize: 10
		}
    },
    methods: {
		async queryComponentType() {
			const { data: result } = await this.$http.get('/componentType/queryComponentType', { params: this.componentTypeForm })
			const tableData = result.data.map(v => {
				v.createDate = this.$moment(v.createDate).format("YYYY-MM-DD HH:mm:ss")
				v.editDate = this.$moment(v.editDate).format("YYYY-MM-DD HH:mm:ss")
				return v
			})
			this.tableData = tableData
		},
		async submit() {
			const { data: result } = await this.$http.post('/componentType/addComponentType', this.addComponentTypeForm)

			if (+result.code === 0) {
				this.$message.success('组件类型添加成功')
			} else {
				this.$message.error('组件类型添加失败')
			}
			this.queryComponentType()
			this.addComponentTypeDialog = false
		},
		editComponentType() {
			if (this.multipleSelection.length !== 1 ) {
				this.$message.error('请一次勾选一条数据')
				return
			}
			this.editComponentTypeDialog = true
			this.editComponentTypeForm._id = this.multipleSelection[0]._id
			this.editComponentTypeForm.componentTypeNum = this.multipleSelection[0].componentTypeNum
			this.editComponentTypeForm.componentType = this.multipleSelection[0].componentType
			this.editComponentTypeForm.calculationType = this.multipleSelection[0].calculationType
		},
		async submitEdit() {
			const { data: result } = await this.$http.post('/componentType/editComponentType', this.editComponentTypeForm)

			if (+result.code === 0) {
				this.$message.success('组件类型编辑成功')
			} else {
				this.$message.error('组件类型编辑失败')
			}
			this.queryComponentType()
			this.editComponentTypeDialog = false
		},
		async deleteComponentType() {
			if (this.multipleSelection.length === 0 ) {
				this.$message.error('请勾选数据')
				return
			}
			const { data: result } = await this.$http.post('/componentType/deleteComponentType', { deleteData: this.multipleSelection })

			if (+result.code === 0) {
				this.$message.success('组件类型删除成功')
			} else {
				this.$message.error('组件类型删除失败')
			}

			this.queryComponentType()
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
		this.queryComponentType()
    }
}
</script>

<style lang="less" scoped>
</style>
