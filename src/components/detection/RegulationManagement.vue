<template>
    <div>
		<el-card>
			<el-form label-width="140px" :inline="true">
				<el-form-item>
					<el-button type="primary" @click="bindRegulation">绑定法规</el-button>
                    <el-button type="success" icon="el-icon-plus" @click="addRegulationDialog = true">新增</el-button>
					<el-button type="warning" icon="el-icon-edit" @click="editRegulation">编辑</el-button>
					<el-button type="danger" icon="el-icon-delete" @click="deleteRegulation">删除</el-button>
				</el-form-item>
			</el-form>

			<el-table ref="multipleTable" :key="tableKey" :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" border style="width: 100%" @selection-change="handleSelectionChange">
				<el-table-column type="index" align="center"></el-table-column>
				<el-table-column type="selection" align="center"></el-table-column>
				<el-table-column prop="_id" align="center" v-if="false"></el-table-column>
                <el-table-column label="计算公式" align="center">
					<template>
						<el-button type="primary" size="mini" icon="el-icon-search" @click="showPicture">查看</el-button>
                    </template>
				</el-table-column>
				<el-table-column prop="regulationCode" label="法规编号" align="center"></el-table-column>
				<el-table-column prop="regulation" label="法规名称" align="center"></el-table-column>
				<el-table-column prop="currentBind" label="当前绑定法规" align="center"></el-table-column>
				<el-table-column prop="reachableCalculation" label="可达点计算方式" align="center"></el-table-column>
				<el-table-column prop="unreachableCalculation" label="不可达点计算方式" align="center"></el-table-column>
                <!-- <el-table-column prop="createDate" label="创建时间" align="center"></el-table-column>
				<el-table-column prop="createUser" label="创建人" align="center"></el-table-column>
				<el-table-column prop="editDate" label="修改时间" align="center"></el-table-column> -->
				<el-table-column prop="editUser" label="修改人" align="center"></el-table-column>
                <el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<el-button type="primary" size="mini" icon="el-icon-edit" @click="showRegulationComponent(scope.row)">修改</el-button>
                    </template>
				</el-table-column>
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
            title="法规绑定"
            :visible.sync="bindRegulationDialog"
            width="30%" @close="dialogClose('bindRegulationForm')">
            <el-form :model="bindRegulationForm" ref="bindRegulationFormRef" label-width="140px">
                <el-form-item label="法规编号" prop="regulationCode">
                    <el-input v-model="bindRegulationForm.regulationCode" disabled style="width: 180px"></el-input>
                </el-form-item>
				<el-form-item label="法规名称" prop="regulation">
                    <el-input v-model="bindRegulationForm.regulation" disabled style="width: 180px"></el-input>
                </el-form-item>
				<el-form-item label="不可达点计算方式:">
					<el-select v-model="bindRegulationForm.unreachableCalculation" placeholder="请选择" clearable>
						<el-option
							v-for="(item, index) in unreachableCalculationOptions"
							:key="index"
							:label="item"
							:value="item">
						</el-option>
					</el-select>
				</el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="bindRegulationDialog = false">取 消</el-button>
                <el-button type="primary" @click="submitBind">确 定</el-button>
            </span>
        </el-dialog>

		<el-dialog
            title="法规添加"
            :visible.sync="addRegulationDialog"
            width="30%" @close="dialogClose('addRegulationForm')">
            <el-form :model="addRegulationForm" ref="addRegulationFormRef" label-width="70px">
                <el-form-item label="法规编号" prop="regulationCode">
                    <el-input v-model="addRegulationForm.regulationCode" style="width: 180px"></el-input>
                </el-form-item>
				<el-form-item label="法规名称" prop="regulation">
                    <el-input v-model="addRegulationForm.regulation" style="width: 180px"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addRegulationDialog = false">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </span>
        </el-dialog>

		<el-dialog
            title="法规编辑"
            :visible.sync="editRegulationDialog"
            width="30%" @close="dialogClose('editRegulationForm')">
            <el-form :model="editRegulationForm" ref="editRegulationFormRef" label-width="70px">
                <el-form-item label="法规编号" prop="regulationCode">
                    <el-input v-model="editRegulationForm.regulationCode" style="width: 180px"></el-input>
                </el-form-item>
                <el-form-item label="法规名称" prop="regulation">
                    <el-input v-model="editRegulationForm.regulation" style="width: 180px"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editRegulationDialog = false">取 消</el-button>
                <el-button type="primary" @click="submitEdit">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="图片" :visible.sync="showPictureDialog">
            <div style="text-align: center;">
                <img :src="pictureUrl" style="width: 400px; height: 600px;">
            </div>
        </el-dialog>

        <el-dialog title="法规修改" :visible.sync="regulationComponentDialog" width="80%">
            <el-form label-width="140px" :inline="true">
				<el-form-item>
                    <el-button type="success" icon="el-icon-plus" @click="addRegulationComponentDialog = true">新增</el-button>
					<el-button type="warning" icon="el-icon-edit" @click="editRegulationComponent">编辑</el-button>
					<el-button type="danger" icon="el-icon-delete" @click="deleteRegulationComponent">删除</el-button>
				</el-form-item>
			</el-form>

            <el-table :key="regulationComponentTableKey" ref="multipleTable_2" :data="regulationComponentTableData" border style="width: 100%" @selection-change="handleSelectionChange_2">
				<el-table-column type="index" align="center"></el-table-column>
				<el-table-column type="selection" align="center"></el-table-column>
				<el-table-column prop="_id" align="center" v-if="false"></el-table-column>
				<el-table-column prop="regulationCode" label="法规代码" align="center"></el-table-column>
				<el-table-column prop="detailNum" label="详情编号" align="center"></el-table-column>
				<el-table-column prop="componentType" label="组件名称" align="center"></el-table-column>
				<el-table-column prop="mediumStatus" label="介质类型" align="center"></el-table-column>
				<el-table-column prop="quarter" label="检测频率" align="center"></el-table-column>
				<el-table-column prop="threshold" label="泄漏阈值" align="center"></el-table-column>
                <!-- <el-table-column prop="createDate" label="创建时间" align="center"></el-table-column>
				<el-table-column prop="createUser" label="创建人" align="center"></el-table-column>
				<el-table-column prop="editDate" label="修改时间" align="center"></el-table-column> -->
				<el-table-column prop="editUser" label="修改人" align="center"></el-table-column>
			</el-table>
        </el-dialog>

        <el-dialog
            title="新增"
            :visible.sync="addRegulationComponentDialog"
            width="30%" @close="dialogClose('addRegulationComponentForm')">
            <el-form :model="addRegulationComponentForm" ref="addRegulationComponentFormRef" label-width="70px">
                <el-form-item label="法规编号" prop="regulationCode">
                    <el-input v-model="addRegulationComponentForm.regulationCode" disabled style="width: 180px"></el-input>
                </el-form-item>
                <el-form-item label="详情编号" prop="detailNum">
                    <el-input v-model="addRegulationComponentForm.detailNum" style="width: 180px"></el-input>
                </el-form-item>
                <el-form-item label="组件类型">
					<el-select v-model="addRegulationComponentForm.componentType" placeholder="请选择">
						<el-option
							v-for="item in componentTypeOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
                <el-form-item label="介质状态">
					<el-select v-model="addRegulationComponentForm.mediumStatus" placeholder="请选择">
						<el-option
							v-for="item in mediumStatusOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
                <el-form-item label="检测周期">
					<el-select v-model="addRegulationComponentForm.quarter" placeholder="请选择">
						<el-option
							v-for="item in quarterOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
                <el-form-item label="阈值" prop="threshold">
                    <el-input v-model="addRegulationComponentForm.threshold" style="width: 180px"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addRegulationComponentDialog = false">取 消</el-button>
                <el-button type="primary" @click="submitAdd">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog
            title="编辑"
            :visible.sync="editRegulationComponentDialog"
            width="30%" @close="dialogClose('editRegulationComponentForm')">
            <el-form :model="editRegulationComponentForm" ref="editRegulationComponentFormRef" label-width="70px">
                <el-form-item label="法规代号" prop="regulationCode">
                    <el-input v-model="editRegulationComponentForm.regulationCode" disabled style="width: 180px"></el-input>
                </el-form-item>
                <el-form-item label="详情编号" prop="detailNum">
                    <el-input v-model="editRegulationComponentForm.detailNum" disabled style="width: 180px"></el-input>
                </el-form-item>
                <el-form-item label="组件类型">
					<el-select v-model="editRegulationComponentForm.componentType" placeholder="请选择">
						<el-option
							v-for="item in componentTypeOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
                <el-form-item label="介质状态">
					<el-select v-model="editRegulationComponentForm.mediumStatus" placeholder="请选择">
						<el-option
							v-for="item in mediumStatusOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
                <el-form-item label="检测周期">
					<el-select v-model="editRegulationComponentForm.quarter" placeholder="请选择">
						<el-option
							v-for="item in quarterOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
                <el-form-item label="阈值" prop="threshold">
                    <el-input v-model="editRegulationComponentForm.threshold" style="width: 180px"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editRegulationComponentDialog = false">取 消</el-button>
                <el-button type="primary" @click="submitModify">确 定</el-button>
            </span>
        </el-dialog>
	</div>
</template>

<script>
export default {
    data() {
		return {
			tableData: [],
            regulationComponentTableData: [],
            tableKey: '',
            regulationComponentTableKey: '',
            addRegulationComponentForm:{
                regulationCode: '',
                detailNum: '',
                componentType: '',
                mediumStatus: '',
                quarter: '',
                threshold: '',
            },
            editRegulationComponentForm:{
				_id: '',
                regulationCode: '',
                detailNum: '',
                componentType: '',
                mediumStatus: '',
                quarter: '',
                threshold: '',
            },
			bindRegulationForm: {
                regulationCode: '',
                regulation: '',
                unreachableCalculation: '',
			},
			addRegulationForm: {
				regulationCode: '',
				regulation: '',
			},
			editRegulationForm: {
				_id: '',
				regulationCode: '',
				regulation: '',
			},
            unreachableCalculationOptions: [
                '不可达点相关方程法',
                '不可达点平均系数法',
            ],
			multipleSelection: [],
            multipleSelection_2: [],
            componentTypeOptions: [],
            mediumStatusOptions: [],
			quarterOptions: [
				{ label: '季度检测', value: '季度检测' },
				{ label: '半年度检测', value: '半年度检测' },
				{ label: '年度检测', value: '年度检测' },
			],
			currentPage: 1,
            total: 0,
            pageSize: 10,
            bindRegulationDialog: false,
			addRegulationDialog: false,
			editRegulationDialog: false,
            showPictureDialog: false,
            regulationComponentDialog: false,
            addRegulationComponentDialog: false,
            editRegulationComponentDialog: false,
            pictureUrl: '',
		}
    },
    methods: {
        async editRegulationComponent() {
			if (this.multipleSelection_2.length !== 1 ) {
				this.$message.error('请一次勾选一条数据')
				return
			}
			this.editRegulationComponentDialog = true
			this.editRegulationComponentForm._id = this.multipleSelection_2[0]._id
			this.editRegulationComponentForm.regulationCode = this.multipleSelection_2[0].regulationCode
            this.editRegulationComponentForm.detailNum = this.multipleSelection_2[0].detailNum
			this.editRegulationComponentForm.componentType = this.multipleSelection_2[0].componentType
            this.editRegulationComponentForm.mediumStatus = this.multipleSelection_2[0].mediumStatus
            this.editRegulationComponentForm.quarter = this.multipleSelection_2[0].quarter
            this.editRegulationComponentForm.threshold = this.multipleSelection_2[0].threshold
        },
        async submitModify() {
            const { data: result } = await this.$http.post('/regulation/editRegulationComponent', this.editRegulationComponentForm)

            if (+result.code === 0) {
				this.$message.success('法规组件修改成功')
			} else {
				this.$message.error('法规组件修改失败')
			}

            await this.queryRegulationComponent({ regulationCode: this.editRegulationComponentForm.regulationCode })
            this.editRegulationComponentDialog = false
        },
        async submitAdd() {
            const { data: result } = await this.$http.post('/regulation/addRegulationComponent', this.addRegulationComponentForm)

            if (+result.code === 0) {
				this.$message.success('法规组件新增成功')
			} else {
				this.$message.error('法规组件新增失败')
			}

            await this.queryRegulationComponent({ regulationCode: this.addRegulationComponentForm.regulationCode })
            this.addRegulationComponentDialog = false
        },
        async showRegulationComponent(row) {
            await this.queryRegulationComponent(row)
            this.regulationComponentDialog = true
            this.addRegulationComponentForm.regulationCode = row.regulationCode
            this.editRegulationComponentForm.regulationCode = row.regulationCode
        },
        async queryRegulationComponent(row) {
            const params = {}
            if (!row) params.regulationCode = ''
            else params.regulationCode = row.regulationCode

            const { data: result } = await this.$http.get('/regulation/getRegulationComponent', { params })
            const tableData = result.data.map(v => {
				v.createDate = this.$moment(v.createDate).format("YYYY-MM-DD HH:mm:ss")
				v.editDate = this.$moment(v.editDate).format("YYYY-MM-DD HH:mm:ss")
				return v
			})
			this.regulationComponentTableData = tableData
            this.regulationComponentTableKey = Math.random()
        },
        async deleteRegulationComponent() {
            if (this.multipleSelection_2.length === 0 ) {
				this.$message.error('请勾选数据')
				return
			}

			this.$confirm('此操作将永久删除法规组件, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.confirmDeleteRegulationComponent()
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消删除'
				})        
			})
        },
		async confirmDeleteRegulationComponent() {
			const { data: result } = await this.$http.post('/regulation/deleteRegulationComponent', { deleteData: this.multipleSelection_2 })

			if (+result.code === 0) {
				this.$message.success('法规组件删除成功')
			} else {
				this.$message.error('法规组件删除失败')
			}

			await this.queryRegulationComponent({ regulationCode: this.multipleSelection_2[0].regulationCode })
		},
        async getBindRegulation () {
            const { data: result } = await this.$http.get('/regulation/getBindRegulation')
            const { regulationCode = '', unreachableCalculation = '' } = result.data

            for (let i = 0; i < this.tableData.length; i++) {
                if (this.tableData[i].regulationCode === regulationCode) {
                    this.tableData[i].currentBind = '已绑定'
                    this.tableData[i].unreachableCalculation = unreachableCalculation
                    this.tableKey = Math.random()
                } else {
                    this.tableData[i].currentBind = ''
                    this.tableData[i].unreachableCalculation = ''
                }
            }
        },
        async bindRegulation () {
            if (this.multipleSelection.length !== 1 ) {
				this.$message.error('请一次勾选一条数据')
				return
			}

            this.bindRegulationDialog = true

            this.bindRegulationForm.regulationCode = this.multipleSelection[0].regulationCode
            this.bindRegulationForm.regulation = this.multipleSelection[0].regulation
        },
        async submitBind() {
            const { data: result } = await this.$http.post('/regulation/bindRegulation', this.bindRegulationForm)

			if (+result.code === 0) {
				this.$message.success('法规绑定成功')
			} else {
				this.$message.error('法规绑定失败')
			}

            this.bindRegulationDialog = false
            await this.getBindRegulation()
        },
		async queryRegulation () {
			const { data: result } = await this.$http.get('/regulation/queryRegulation', { params: this.regulationForm })

			const tableData = result.data.map(v => {
				v.createDate = this.$moment(v.createDate).format("YYYY-MM-DD HH:mm:ss")
				v.editDate = this.$moment(v.editDate).format("YYYY-MM-DD HH:mm:ss")
                v.reachableCalculation = '相关方程法'
				return v
			})
			this.tableData = tableData

            await this.getBindRegulation()
		},
		async submit() {
			const { data: result } = await this.$http.post('/regulation/addRegulation', this.addRegulationForm)

			if (+result.code === 0) {
				this.$message.success('法规添加成功')
			} else {
				this.$message.error('法规添加失败')
			}
			this.queryRegulation()
			this.addRegulationDialog = false
		},
		editRegulation() {
			if (this.multipleSelection.length !== 1 ) {
				this.$message.error('请一次勾选一条数据')
				return
			}
			this.editRegulationDialog = true
			this.editRegulationForm._id = this.multipleSelection[0]._id
			this.editRegulationForm.regulationCode = this.multipleSelection[0].regulationCode
			this.editRegulationForm.regulation = this.multipleSelection[0].regulation
		},
		async submitEdit() {
			const { data: result } = await this.$http.post('/regulation/editRegulation', this.editRegulationForm)

			if (+result.code === 0) {
				this.$message.success('法规编辑成功')
			} else {
				this.$message.error('法规编辑失败')
			}
			this.queryRegulation()
			this.editRegulationDialog = false
		},
		async deleteRegulation() {
			if (this.multipleSelection.length === 0 ) {
				this.$message.error('请勾选数据')
				return
			}

			this.$confirm('此操作将永久删除法规, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.confirmDeleteRegulation()
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消删除'
				})        
			})
		},
		async confirmDeleteRegulation() {
			const { data: result } = await this.$http.post('/regulation/deleteRegulation', { deleteData: this.multipleSelection })

			if (+result.code === 0) {
				this.$message.success('法规删除成功')
			} else {
				this.$message.error('法规删除失败')
			}

			this.queryRegulation()
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
        handleSelectionChange_2(val) {
        	this.multipleSelection_2 = val
      	},
		dialogClose (form) { // 关闭对话框
            this.$refs[`${form}Ref`].resetFields()
        },
        showPicture(row) {
			this.showPictureDialog = true
			this.pictureUrl = "https://www.mmldar.com/api" + '/law/formula.png'
			console.log(this.pictureUrl)
		},
        async queryComponentType() {
			const { data: result } = await this.$http.get('/componentType/queryComponentType')

			for (const item of result.data) {
				this.componentTypeOptions.push({ label: item.componentType, value: item.componentType })
			}
		},
		async queryMediumStatus() {
			const { data: result } = await this.$http.get('/medium/queryMedium')

			for (const item of result.data) {
				this.mediumStatusOptions.push({ label: item.medium, value: item.medium })
			}
		},
    },
    created() {
		this.queryRegulation()
        this.queryComponentType()
        this.queryMediumStatus()
    }
}
</script>

<style lang="less" scoped>
</style>
