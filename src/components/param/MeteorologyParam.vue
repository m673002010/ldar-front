<template>
    <div>
		<el-card>
			<el-form ref="meteorologyParamFormRef" :model="meteorologyParamForm" label-width="80px" :inline="true">
                <el-form-item>
                    <el-date-picker
                        v-model="meteorologyParamForm.date"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
					<el-button type="primary" icon="el-icon-search" @click="queryMeteorologyParam">查询</el-button>
                    <el-button type="success" icon="el-icon-plus" @click="addMeteorologyParamDialog = true">新增</el-button>
					<el-button type="warning" icon="el-icon-edit" @click="editMeteorologyParam">编辑</el-button>
					<el-button type="danger" icon="el-icon-delete" @click="deleteMeteorologyParam">删除</el-button>
				</el-form-item>
			</el-form>

			<el-table ref="multipleTable" :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" border style="width: 100%"
			@selection-change="handleSelectionChange">
				<el-table-column type="index" align="center"></el-table-column>
                <el-table-column type="selection" align="center"></el-table-column>
                <el-table-column prop="_id" align="center" v-if="false"></el-table-column>
				<!-- <el-table-column prop="companyNum" label="公司编号" align="center"></el-table-column> -->
				<el-table-column prop="date" label="日期" align="center"></el-table-column>
                <el-table-column prop="temperature" label="温度（°C）" align="center"></el-table-column>
                <el-table-column prop="humidity" label="湿度（%RH）" align="center"></el-table-column>
                <el-table-column prop="barometricPressure" label="气压（hPa）" align="center"></el-table-column>
                <el-table-column prop="windDirection" label="风向" align="center"></el-table-column>
                <el-table-column prop="windSpeed" label="风速" align="center"></el-table-column>
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
            title="气象参数"
            :visible.sync="addMeteorologyParamDialog"
            width="30%" @close="dialogClose('addMeteorologyParamForm')">
            <el-form :model="addMeteorologyParamForm" ref="addMeteorologyParamFormRef" label-width="120px">
                <el-form-item label="日期" prop="date">
                    <el-date-picker v-model="addMeteorologyParamForm.date" type="datetime" placeholder="选择日期时间" style="width: 200px"></el-date-picker>
                </el-form-item>
                <el-form-item label="温度（°C）" prop="temperature">
                    <el-input v-model="addMeteorologyParamForm.temperature" style="width: 200px"></el-input>
                </el-form-item>
                <el-form-item label="湿度（%RH）" prop="humidity">
                    <el-input v-model="addMeteorologyParamForm.humidity" style="width: 200px"></el-input>
                </el-form-item>
                <el-form-item label="气压（hPa）" prop="barometricPressure">
                    <el-input v-model="addMeteorologyParamForm.barometricPressure" style="width: 200px"></el-input>
                </el-form-item>
                <el-form-item label="风向" prop="windDirection">
                    <el-input v-model="addMeteorologyParamForm.windDirection" style="width: 200px"></el-input>
                </el-form-item>
                <el-form-item label="风速" prop="windSpeed">
                    <el-input v-model="addMeteorologyParamForm.windSpeed" style="width: 200px"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addMeteorologyParamDialog = false">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </span>
        </el-dialog>

		<el-dialog
            title="气象参数"
            :visible.sync="editMeteorologyParamDialog"
            width="30%" @close="dialogClose('editMeteorologyParamForm')">
            <el-form :model="editMeteorologyParamForm" ref="editMeteorologyParamFormRef" label-width="120px">
                <el-form-item label="日期" prop="date">
                    <el-date-picker v-model="editMeteorologyParamForm.date" type="datetime" placeholder="选择日期时间" style="width: 200px"></el-date-picker>
                </el-form-item>
                <el-form-item label="温度（°C）" prop="temperature">
                    <el-input v-model="editMeteorologyParamForm.temperature" style="width: 200px"></el-input>
                </el-form-item>
                <el-form-item label="湿度（%RH）" prop="humidity">
                    <el-input v-model="editMeteorologyParamForm.humidity" style="width: 200px"></el-input>
                </el-form-item>
                <el-form-item label="气压（hPa）" prop="barometricPressure">
                    <el-input v-model="editMeteorologyParamForm.barometricPressure" style="width: 200px"></el-input>
                </el-form-item>
                <el-form-item label="风向" prop="windDirection">
                    <el-input v-model="editMeteorologyParamForm.windDirection" style="width: 200px"></el-input>
                </el-form-item>
                <el-form-item label="风速" prop="windSpeed">
                    <el-input v-model="editMeteorologyParamForm.windSpeed" style="width: 200px"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editMeteorologyParamDialog = false">取 消</el-button>
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
			meteorologyParamForm: {
				date: null,
			},
            addMeteorologyParamForm: {
                date: '',
                temperature: '',
                humidity: '',
                barometricPressure: '',
                windDirection: '',
                windSpeed: '',
            },
            editMeteorologyParamForm: {
                _id: '',
                date: '',
                temperature: '',
                humidity: '',
                barometricPressure: '',
                windDirection: '',
                windSpeed: '',
            },
            multipleSelection: [],
			currentPage: 1,
            total: 0,
            pageSize: 10,
            addMeteorologyParamDialog: false,
			editMeteorologyParamDialog: false
		}
    },
    methods: {
		async queryMeteorologyParam() {
			const { data: result } = await this.$http.post('/meteorologyParam/queryMeteorologyParam', this.meteorologyParamForm)

			const tableData = result.data.map(v => {
                v.date = this.$moment(v.date).format("YYYY-MM-DD HH:mm:ss")
				v.createDate = this.$moment(v.createDate).format("YYYY-MM-DD HH:mm:ss")
				v.editDate = this.$moment(v.editDate).format("YYYY-MM-DD HH:mm:ss")
				return v
			})
			this.tableData = tableData
		},
		async submit() {
			const { data: result } = await this.$http.post('/meteorologyParam/addMeteorologyParam', this.addMeteorologyParamForm)

			if (+result.code === 0) {
				this.$message.success('气象参数添加成功')
			} else {
				this.$message.error('气象参数添加失败')
			}
			this.queryMeteorologyParam()
			this.addMeteorologyParamDialog = false
		},
		editMeteorologyParam() {
			if (this.multipleSelection.length !== 1 ) {
				this.$message.error('请一次勾选一条数据')
				return
			}
			this.editMeteorologyParamDialog = true
            this.editMeteorologyParamForm._id = this.multipleSelection[0]._id
			this.editMeteorologyParamForm.date = this.multipleSelection[0].date
			this.editMeteorologyParamForm.temperature = this.multipleSelection[0].temperature
			this.editMeteorologyParamForm.humidity = this.multipleSelection[0].humidity
            this.editMeteorologyParamForm.barometricPressure = this.multipleSelection[0].barometricPressure
            this.editMeteorologyParamForm.windDirection = this.multipleSelection[0].windDirection
            this.editMeteorologyParamForm.windSpeed = this.multipleSelection[0].windSpeed
		},
		async submitEdit() {
			const { data: result } = await this.$http.post('/meteorologyParam/editMeteorologyParam', this.editMeteorologyParamForm)

			if (+result.code === 0) {
				this.$message.success('气象参数编辑成功')
			} else {
				this.$message.error('气象参数编辑失败')
			}
			this.queryMeteorologyParam()
			this.editMeteorologyParamDialog = false
		},
		async deleteMeteorologyParam() {
			if (this.multipleSelection.length === 0 ) {
				this.$message.error('请勾选数据')
				return
			}
			const { data: result } = await this.$http.post('/meteorologyParam/deleteMeteorologyParam', { deleteData: this.multipleSelection })

			if (+result.code === 0) {
				this.$message.success('气象参数删除成功')
			} else {
				this.$message.error('气象参数删除失败')
			}

			this.queryMeteorologyParam()
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
        this.queryMeteorologyParam()
    }
}
</script>

<style lang="less" scoped>
</style>
