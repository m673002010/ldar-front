<template>
    <div>
		<el-card>
			<el-form ref="instrumentManagementFormRef" :model="instrumentManagementForm" label-width="100px" :inline="true">
				<el-form-item label="序列号:">
					<el-input v-model="instrumentManagementForm.instrumentNum" clearable></el-input>
				</el-form-item>
				<el-form-item label="检测仪器名称:">
					<el-input v-model="instrumentManagementForm.instrument" clearable></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="el-icon-search" @click="queryInstrument">查询</el-button>
                    <el-button type="success" icon="el-icon-plus" @click="addInstrumentDialog = true">新增</el-button>
					<el-button type="warning" icon="el-icon-edit" @click="editInstrument">编辑</el-button>
					<el-button type="danger" icon="el-icon-delete" @click="deleteInstrument">删除</el-button>
				</el-form-item>
			</el-form>

			<el-table ref="multipleTable" :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" border style="width: 100%"
			@selection-change="handleSelectionChange">
				<el-table-column type="index" align="center"></el-table-column>
				<el-table-column type="selection" align="center"></el-table-column>
				<el-table-column prop="_id" v-if="false" align="center"></el-table-column>
				<el-table-column prop="instrumentNum" label="序列号" align="center"></el-table-column>
				<el-table-column prop="instrument" label="检测仪器名称" align="center"></el-table-column>
                <el-table-column prop="finalPrecisionTime" label="最后精密校准时间" align="center"></el-table-column>
				<el-table-column prop="invalidTime" label="失效时间" align="center"></el-table-column>
				<el-table-column prop="responseTime" label="响应时间" align="center"></el-table-column>
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
            title="检测仪器"
            :visible.sync="addInstrumentDialog"
            width="30%" @close="dialogClose('addInstrumentForm')">
            <el-form :model="addInstrumentForm" ref="addInstrumentFormRef" label-width="150px">
                <el-form-item label="序列号" prop="instrumentNum">
                    <el-input v-model="addInstrumentForm.instrumentNum" style="width: 200px"></el-input>
                </el-form-item>
                <el-form-item label="检测仪器名称" prop="instrument">
                    <el-input v-model="addInstrumentForm.instrument" style="width: 200px"></el-input>
                </el-form-item>
				<el-form-item label="最后精密校准时间" prop="finalPrecisionTime" >
					<el-date-picker v-model="addInstrumentForm.finalPrecisionTime" type="datetime" placeholder="选择日期时间" style="width: 200px"></el-date-picker>
                </el-form-item>
				<el-form-item label="失效日期" prop="invalidTime" >
					<el-date-picker v-model="addInstrumentForm.invalidTime" type="datetime" placeholder="选择日期时间" style="width: 200px"></el-date-picker>
                </el-form-item>
				<el-form-item label="响应时间" prop="responseTime">
                    <el-input v-model="addInstrumentForm.responseTime" style="width: 200px"></el-input>
					秒
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addInstrumentDialog = false">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </span>
        </el-dialog>

		<el-dialog
            title="检测仪器"
            :visible.sync="editInstrumentDialog"
            width="30%" @close="dialogClose('editInstrumentForm')">
            <el-form :model="editInstrumentForm" ref="editInstrumentFormRef" label-width="150px">
                <el-form-item label="序列号" prop="instrumentNum">
                    <el-input v-model="editInstrumentForm.instrumentNum" style="width: 200px"></el-input>
                </el-form-item>
                <el-form-item label="检测仪器名称" prop="instrument">
                    <el-input v-model="editInstrumentForm.instrument" style="width: 200px"></el-input>
                </el-form-item>
				<el-form-item label="最后精密校准时间" prop="finalPrecisionTime" >
					<el-date-picker v-model="editInstrumentForm.finalPrecisionTime" type="datetime" placeholder="选择日期时间" style="width: 200px"></el-date-picker>
                </el-form-item>
				<el-form-item label="失效日期" prop="invalidTime" >
					<el-date-picker v-model="editInstrumentForm.invalidTime" type="datetime" placeholder="选择日期时间" style="width: 200px"></el-date-picker>
                </el-form-item>
				<el-form-item label="响应时间" prop="responseTime">
                    <el-input v-model="editInstrumentForm.responseTime" style="width: 200px"></el-input>
					秒
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editInstrumentDialog = false">取 消</el-button>
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
			instrumentManagementForm: {
				instrumentNum: '',
                instrument: '',
			},
			addInstrumentForm: {
				instrumentNum: '',
				instrument: '',
				finalPrecisionTime: '',
				responseTime: '',
				invalidTime: '',
			},
			editInstrumentForm: {
				_id: '',
				instrumentNum: '',
				instrument: '',
				finalPrecisionTime: '',
				responseTime: '',
				invalidTime: '',
			},
            multipleSelection: [],
			currentPage: 1,
            total: 0,
            pageSize: 10,
			addInstrumentDialog: false,
			editInstrumentDialog: false
		}
    },
    methods: {
		async queryInstrument() {
			const { data: result } = await this.$http.get('/instrument/queryInstrument', { params: this.instrumentManagementForm })
			const tableData = result.data.map(v => {
				v.finalPrecisionTime = this.$moment(v.finalPrecisionTime).format("YYYY-MM-DD HH:mm:ss")
				v.invalidTime = this.$moment(v.invalidTime).format("YYYY-MM-DD HH:mm:ss")
				v.createDate = this.$moment(v.createDate).format("YYYY-MM-DD HH:mm:ss")
				v.editDate = this.$moment(v.editDate).format("YYYY-MM-DD HH:mm:ss")
				return v
			})
			this.tableData = tableData
		},
		async submit() {
			const { data: result } = await this.$http.post('/instrument/addInstrument', this.addInstrumentForm)

			if (+result.code === 0) {
				this.$message.success('介质添加成功')
			} else {
				this.$message.error('介质添加失败')
			}
			this.queryInstrument()
			this.addInstrumentDialog = false
		},
		editInstrument() {
			if (this.multipleSelection.length !== 1 ) {
				this.$message.error('请一次勾选一条数据')
				return
			}
			this.editInstrumentDialog = true
			this.editInstrumentForm._id = this.multipleSelection[0]._id
			this.editInstrumentForm.instrumentNum = this.multipleSelection[0].instrumentNum
			this.editInstrumentForm.instrument = this.multipleSelection[0].instrument
			this.editInstrumentForm.finalPrecisionTime = this.multipleSelection[0].finalPrecisionTime
			this.editInstrumentForm.responseTime = this.multipleSelection[0].responseTime
			this.editInstrumentForm.invalidTime = this.multipleSelection[0].invalidTime
		},
		async submitEdit() {
			const { data: result } = await this.$http.post('/instrument/editInstrument', this.editInstrumentForm)

			if (+result.code === 0) {
				this.$message.success('介质编辑成功')
			} else {
				this.$message.error('介质编辑失败')
			}
			this.queryInstrument()
			this.editInstrumentDialog = false
		},
		async deleteInstrument() {
			if (this.multipleSelection.length === 0 ) {
				this.$message.error('请勾选数据')
				return
			}
			const { data: result } = await this.$http.post('/instrument/deleteInstrument', { deleteData: this.multipleSelection })

			if (+result.code === 0) {
				this.$message.success('介质删除成功')
			} else {
				this.$message.error('介质删除失败')
			}

			this.queryInstrument()
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
		this.queryInstrument()
    }
}
</script>

<style lang="less" scoped>
</style>
