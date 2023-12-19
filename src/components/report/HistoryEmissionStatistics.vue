<template>
    <div>
		<el-card>
			<el-form ref="hesFormRef" :model="hesForm" label-width="50px" :inline="true">
				<el-form-item label="年份">
					<el-select v-model="hesForm.year" placeholder="请选择" clearable>
						<el-option
							v-for="item in yearOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="el-icon-search" @click="queryHes">查询</el-button>
				</el-form-item>
                <el-form-item>
					<el-button type="primary" icon="el-icon-plus" @click="addHesDialog = true">新增</el-button>
				</el-form-item>
                <el-form-item>
					<el-button type="primary" icon="el-icon-edit" @click="editHes">编辑</el-button>
				</el-form-item>
                <el-form-item>
					<el-button type="danger" icon="el-icon-delete" @click="deleteHes">删除</el-button>
				</el-form-item>
                <el-form-item>
					<el-button type="primary" icon="el-icon-folder-remove" @click="exportHes">导出数据</el-button>
				</el-form-item>
			</el-form>

			<el-table ref="multipleTable" :data="tableData" border style="width: 100%" @selection-change="handleSelectionChange">
				<el-table-column type="index" align="center"></el-table-column>
				<el-table-column type="selection" align="center"></el-table-column>
				<el-table-column prop="_id" v-if="false" align="center"></el-table-column>
				<el-table-column prop="detectionCycle" label="检测周期" align="center"></el-table-column>
				<el-table-column prop="sealPoints" label="密封点数(个)" align="center"></el-table-column>
				<el-table-column prop="emissionBeforeRepair" label="维修前排放总量(千克)" align="center"></el-table-column>
				<el-table-column prop="emissionAfterRepair" label="维修后排放总量(千克)" align="center"></el-table-column>
                <el-table-column prop="decreaseAfterRepair" label="维修后减排量(千克)" align="center"></el-table-column>
				<el-table-column prop="decreaseRateAfterRepair" label="维修后减排率" align="center"></el-table-column>
				<el-table-column prop="startTime" label="开始检测时间" align="center"></el-table-column>
				<el-table-column prop="endTime" label="结束检测时间" align="center"></el-table-column>
				<el-table-column label="上传验证过程" align="center">
					<template slot-scope="scope" >
						<a v-if="scope.row.proof" :href="['https://www.mmldar.com/api' + scope.row.proof]"  style="text-decoration:none">{{ (scope.row.proof.split('/')[(scope.row.proof.split('/')).length-1]).split('.')[0] }}</a>
						<el-button v-else type="primary" icon="el-icon-upload" size="mini" @click="openUploadDialog(scope.row)">上传</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>

		<el-dialog
            title="添加"
            :visible.sync="addHesDialog"
            width="30%" @close="dialogClose('addHesForm')">
            <el-form :model="addHesForm" ref="addHesFormRef" label-width="150px">
                <el-form-item label="检测周期" prop="detectionCycle">
                    <el-input v-model="addHesForm.detectionCycle" style="width: 250px"></el-input>
                </el-form-item>
                <el-form-item label="密封点数(个)" prop="sealPoints">
                    <el-input v-model="addHesForm.sealPoints" style="width: 250px"></el-input>
                </el-form-item>
                <el-form-item label="维修前排放总量(千克)" prop="emissionBeforeRepair">
                    <el-input v-model="addHesForm.emissionBeforeRepair" style="width: 250px"></el-input>
                </el-form-item>
                <el-form-item label="维修后排放总量(千克)" prop="emissionAfterRepair">
                    <el-input v-model="addHesForm.emissionAfterRepair" style="width: 250px"></el-input>
                </el-form-item>
                <el-form-item label="维修后减排量(千克)" prop="decreaseAfterRepair">
                    <el-input v-model="addHesForm.decreaseAfterRepair" style="width: 250px"></el-input>
                </el-form-item>
                <el-form-item label="维修后减排率" prop="decreaseRateAfterRepair">
                    <el-input v-model="addHesForm.decreaseRateAfterRepair" style="width: 250px"></el-input>
                </el-form-item>
                <el-form-item label="开始检测时间" prop="startTime">
                    <el-input v-model="addHesForm.startTime" style="width: 250px"></el-input>
                </el-form-item>
                <el-form-item label="结束检测时间" prop="endTime">
                    <el-input v-model="addHesForm.endTime" style="width: 250px"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addHesDialog = false">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </span>
        </el-dialog>

		<el-dialog
            title="编辑"
            :visible.sync="editHesDialog"
            width="30%" @close="dialogClose('editHesForm')">
            <el-form :model="editHesForm" ref="editHesFormRef" label-width="150px">
                <el-form-item label="检测周期" prop="detectionCycle">
                    <el-input v-model="editHesForm.detectionCycle" style="width: 250px"></el-input>
                </el-form-item>
                <el-form-item label="密封点数(个)" prop="sealPoints">
                    <el-input v-model="editHesForm.sealPoints" style="width: 250px"></el-input>
                </el-form-item>
                <el-form-item label="维修前排放总量(千克)" prop="emissionBeforeRepair">
                    <el-input v-model="editHesForm.emissionBeforeRepair" style="width: 250px"></el-input>
                </el-form-item>
                <el-form-item label="维修后排放总量(千克)" prop="emissionAfterRepair">
                    <el-input v-model="editHesForm.emissionAfterRepair" style="width: 250px"></el-input>
                </el-form-item>
                <el-form-item label="维修后减排量(千克)" prop="decreaseAfterRepair">
                    <el-input v-model="editHesForm.decreaseAfterRepair" style="width: 250px"></el-input>
                </el-form-item>
                <el-form-item label="维修后减排率" prop="decreaseRateAfterRepair">
                    <el-input v-model="editHesForm.decreaseRateAfterRepair" style="width: 250px"></el-input>
                </el-form-item>
                <el-form-item label="开始检测时间" prop="startTime">
                    <el-input v-model="editHesForm.startTime" style="width: 250px"></el-input>
                </el-form-item>
                <el-form-item label="结束检测时间" prop="endTime">
                    <el-input v-model="editHesForm.endTime" style="width: 250px"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editHesDialog = false">取 消</el-button>
                <el-button type="primary" @click="submitEdit">确 定</el-button>
            </span>
        </el-dialog>

		<el-dialog
			title="上传检测文件"
			:visible.sync="uploadDialog"
			width="30%" @close="dialogClose">
			<el-form :model="uploadForm" ref="uploadFormRef" label-width="70px">
				<el-form-item>
					<el-upload action="/" :on-change="uploadFile" :auto-upload="false" :show-file-list="true" :limit="1">
						<el-button type="primary">选择文件</el-button>
					</el-upload>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="uploadDialog = false">取 消</el-button>
				<el-button type="primary" @click="submitProof">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import ExcelJs from "exceljs"
import axios from 'axios'
export default {
    data() {
		return {
			tableData: [],
			hesForm: {
				year: '2023',
			},
			addHesForm: {
				detectionCycle: '',
				sealPoints: '',
				emissionBeforeRepair: '',
				emissionAfterRepair: '',
				decreaseAfterRepair: '',
				decreaseRateAfterRepair: '',
				startTime: '',
				endTime: ''
			},
			editHesForm: {
				_id: '',
				detectionCycle: '',
				sealPoints: '',
				emissionBeforeRepair: '',
				emissionAfterRepair: '',
				decreaseAfterRepair: '',
				decreaseRateAfterRepair: '',
				startTime: '',
				endTime: ''
			},
			uploadForm: {
				_id: '',
                formData: null,
			},
			yearOptions: [
				{ label: '2023', value: '2023' }
			],
			multipleSelection: [],
			addHesDialog: false,
			editHesDialog: false,
			uploadDialog: false
		}
    },
    methods: {
		async queryHes() {
			const { data: result } = await this.$http.get('/hes/historyEmissionStatistics', { params: this.hesForm })
			this.tableData = result.data
		},
        async exportHes() {
			const { data: result } = await this.$http.get('/hes/historyEmissionStatistics', { params: this.hesForm })
			const exportHes = result.data

			const workbook = new ExcelJs.Workbook()
			const worksheet = workbook.addWorksheet('sheet1')
			worksheet.columns = [
				{ header: '检测周期', key: 'detectionCycle' },
				{ header: '密封点数(个)', key: 'sealPoints' },
				{ header: '维修前排放总量(千克)', key: 'emissionBeforeRepair' },
				{ header: '维修后排放总量(千克)', key: 'emissionAfterRepair' },
				{ header: '维修后减排量(千克)', key: 'decreaseAfterRepair' },
				{ header: '维修后减排率', key: 'decreaseRateAfterRepair' },
				{ header: '开始检测时间', key: 'startTime' },
                { header: '结束检测时间', key: 'endTime' },
			]
			worksheet.addRows(exportHes)
			const buffer = await workbook.xlsx.writeBuffer()
			const link = document.createElement("a")
			const blobHes = new Blob([buffer], { type: "application/vnd.ms-excel;charset=utf-8;" })
			link.download = '泄漏汇总历史报告.xlsx'
			link.href = URL.createObjectURL(blobHes)
			link.click()
		},
		async submit() {
			const { data: result } = await this.$http.post('/hes/addHes', this.addHesForm)

			if (+result.code === 0) {
				this.$message.success('历史排放统计添加成功')
			} else {
				this.$message.error('历史排放统计添加失败')
			}
			this.queryHes()
			this.addHesDialog = false
		},
		editHes() {
			if (this.multipleSelection.length !== 1 ) {
				this.$message.error('请一次勾选一条数据')
				return
			}
			this.editHesDialog = true
			this.editHesForm._id = this.multipleSelection[0]._id
			this.editHesForm.detectionCycle = this.multipleSelection[0].detectionCycle
			this.editHesForm.sealPoints = this.multipleSelection[0].sealPoints
			this.editHesForm.emissionBeforeRepair = this.multipleSelection[0].emissionBeforeRepair
			this.editHesForm.emissionAfterRepair = this.multipleSelection[0].emissionAfterRepair
			this.editHesForm.decreaseAfterRepair = this.multipleSelection[0].decreaseAfterRepair
			this.editHesForm.decreaseRateAfterRepair = this.multipleSelection[0].decreaseRateAfterRepair
			this.editHesForm.startTime = this.multipleSelection[0].startTime
			this.editHesForm.endTime = this.multipleSelection[0].endTime
		},
		async submitEdit() {
			const { data: result } = await this.$http.post('/hes/editHes', { editParams: this.editHesForm })

			if (+result.code === 0) {
				this.$message.success('历史排放统计编辑成功')
			} else {
				this.$message.error('历史排放统计编辑失败')
			}
			this.queryHes()
			this.editHesDialog = false
		},
		async deleteHes() {
			if (this.multipleSelection.length === 0 ) {
				this.$message.error('请勾选数据')
				return
			}
			const { data: result } = await this.$http.post('/hes/deleteHes', { deleteData: this.multipleSelection })

			if (+result.code === 0) {
				this.$message.success('历史排放统计删除成功')
			} else {
				this.$message.error('历史排放统计删除失败')
			}

			this.queryHes()
		},
		openUploadDialog (row) {
			this.uploadDialog = true
			this.uploadForm._id = row._id
			console.log(this.uploadForm._id)
		},
        async uploadFile(file, fileList) {
			const formData = new FormData()
			formData.append('file', file.raw)
            this.uploadForm.formData = formData
        },
        async submitProof() {
			try {
            	this.uploadForm.formData.append('_id', this.uploadForm._id)
				const { data: result } = await axios({
					method: 'post',
					url: 'https://www.mmldar.com/api/hes/uploadProof',
					data: this.uploadForm.formData,
					headers: {
						'Content-Type': 'multipart/form-data',
						'Authorization': this.token
					}
				})

				if (+result.code === 0) {
					this.$message.success('上传验证过程成功')
				} else {
					this.$message.error('上传验证过程失败')
				}

				await this.queryHes()
			} catch (error) {
				this.$message.error('上传验证过程失败' + error)
			}

            this.uploadDialog = false
            this.dialogClose()
        },
      	handleSelectionChange(val) {
        	this.multipleSelection = val
      	},
		dialogClose () { // 关闭对话框
            this.uploadForm._id = ''
        },
    },
    created() {
		this.queryHes()
    }
}
</script>

<style scoped>
	a:link {color: #4a5064}     /* 未访问的链接 */
	a:visited {color: #4a5064}  /* 已访问的链接 */
	a:hover {color: #4a5064}    /* 当有鼠标悬停在链接上 */
	a:active {color: #4a5064}   /* 被选择的链接 */
</style>
