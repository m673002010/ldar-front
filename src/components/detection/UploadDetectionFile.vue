<template>
    <div>
		<el-card>
			<el-form ref="udfFormRef" :model="udfForm" label-width="60px" :inline="true">
				<el-form-item label="年份">
					<el-select v-model="udfForm.year" placeholder="请选择" clearable>
						<el-option
							v-for="(item, index) in yearOptions"
							:key="index"
							:label="item"
							:value="item">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="季度">
					<el-select v-model="udfForm.quarter" placeholder="请选择" clearable>
						<el-option
							v-for="(item, index) in quarterOptions"
							:key="index"
							:label="item"
							:value="item">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="文件名">
					<el-input v-model="udfForm.fileName" clearable></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="el-icon-search" @click="queryDetectFile">查询</el-button>
				</el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-upload" @click="uploadDialog = true">上传</el-button>
				</el-form-item>
                <el-form-item>
                    <el-button type="danger" icon="el-icon-delete" @click="deleteFile">删除</el-button>
				</el-form-item>
			</el-form>

			<el-table ref="multipleTable" :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" border style="width: 100%" @selection-change="handleSelectionChange">
				<el-table-column type="index" align="center"></el-table-column>
				<el-table-column type="selection" align="center"></el-table-column>
				<el-table-column prop="year" label="年份" align="center"></el-table-column>
				<el-table-column prop="quarter" label="季度" align="center" width="120"></el-table-column>
                <el-table-column prop="fileName" label="文件名" align="center"></el-table-column>
				<el-table-column prop="fileType" label="文件类型" align="center"></el-table-column>
				<el-table-column prop="createDate" label="上传时间" align="center"></el-table-column>
				<el-table-column prop="createUser" label="上传人" align="center"></el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<el-button type="primary" icon="el-icon-download" size="mini" @click="download(scope.row)">下载</el-button>
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
			title="上传检测文件"
			:visible.sync="uploadDialog"
			width="30%" @close="dialogClose">
			<el-form :model="uploadForm" ref="uploadFormRef" label-width="70px">
				<el-form-item label="年度">
					<el-select v-model="uploadForm.year" placeholder="请选择" clearable>
						<el-option
							v-for="(item, index) in yearOptions"
							:key="index"
							:label="item"
							:value="item">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="检测时间">
					<el-select v-model="uploadForm.quarter" placeholder="请选择" clearable>
						<el-option
							v-for="(item, index) in quarterOptions"
							:key="index"
							:label="item"
							:value="item">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-upload action="/" :on-change="uploadFile" :auto-upload="false" :show-file-list="true" :limit="1">
						<el-button type="primary">选择文件</el-button>
					</el-upload>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="uploadDialog = false">取 消</el-button>
				<el-button type="primary" @click="submit">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import axios from 'axios'
export default {
    data() {
		return {
			tableData: [],
			multipleSelection: [],
            yearOptions: [
                '2023'
            ],
            quarterOptions: [
                '第1季度',
                '第2季度',
                '第3季度',
                '第4季度'
            ],
			udfForm: {
				year: '',
                quarter: '',
                fileName: '',
			},
			uploadForm: {
				year: '',
                quarter: '',
                formData: null,
			},
			currentPage: 1,
            total: 0,
            pageSize: 10,
            uploadDialog: false,
		}
    },
    methods: {
		async queryDetectFile() {
			const { data: result } = await this.$http.get('/uploadDetectionLedger/queryDetectFile', { params: this.udfForm })
			this.tableData = result.data.map(v => {
				v.createDate = this.$moment(v.createDate).format("YYYY-MM-DD HH:mm:ss")
				return v
			})
		},
        async submit() {
            this.uploadForm.formData.append('year', this.uploadForm.year)
            this.uploadForm.formData.append('quarter', this.uploadForm.quarter)

			try {
				const { data: result } = await axios({
					method: 'post',
					url: 'https://www.mmldar.com/api/uploadDetectionLedger/uploadDetectFile',
					data: this.uploadForm.formData,
					headers: {
						'Content-Type': 'multipart/form-data',
						'Authorization': this.token
					}
				})

				if (+result.code === 0) {
					this.$message.success('上传检测文件成功')
				} else {
					this.$message.error('上传检测文件失败')
				}

				this.queryDetectFile()
			} catch (error) {
				this.$message.error('上传检测文件失败' + error)
			}

            this.uploadDialog = false
            this.dialogClose()
        },
        async uploadFile(file, fileList) {
			const formData = new FormData()
			formData.append('file', file.raw)
            this.uploadForm.formData = formData
        },
        async deleteFile(){
			if (this.multipleSelection.length === 0 ) {
				this.$message.error('请勾选数据')
				return
			}

			this.$confirm('此操作将永久删除检测文件, 是否继续?', '提示', {
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
			const { data: result } = await this.$http.post('/uploadDetectionLedger/deleteDetectFile', { deleteData: this.multipleSelection })

			if (+result.code === 0) {
				this.$message.success('文件删除成功')
			} else {
				this.$message.error('文件删除失败')
			}

			this.queryDetectFile()
		},
		async download(row){
			window.open('https://www.mmldar.com/api' + row.filePath, 'self')
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
		dialogClose () {
            this.uploadForm.year = ''
			this.uploadForm.quarter = ''
        },
    },
    created() {
        this.queryDetectFile()
    }
}
</script>

<style lang="less" scoped>
</style>
