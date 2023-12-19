<template>
    <div>
		<el-card>
			<el-form ref="pictureLedgerFormRef" :model="pictureLedgerForm" :inline="true" label-width="80px">
				<el-form-item label="企业简称">
					<el-input disabled v-model="pictureLedgerForm.shortName"></el-input>
				</el-form-item>
				<el-form-item label="图片名称">
					<el-input v-model="pictureLedgerForm.picture" clearable></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="queryPicture">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-upload
						action="#"
						:limit="1"
						:file-list="fileList"
						:http-request="uploadPicture"
						:on-change="handleChange"
						:show-file-list="false"
						accept="image/jpeg,image/png"
					>
						<el-button type="primary">上传图片</el-button>
					</el-upload>
				</el-form-item>
				<el-form-item>
					<el-upload 
						action="#"
						:limit="1"
						:file-list="archiveList"
						:http-request="uploadPicArchive"
						:on-change="handleArchiveChange"
						:show-file-list="false" 
					>
						<el-button type="primary">上传图片压缩包</el-button>
					</el-upload>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="el-icon-edit" @click="updatePicture">编辑</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="danger" icon="el-icon-delete" @click="deletePicture">删除</el-button>
				</el-form-item>
			</el-form>

			<el-table ref="multipleTable" :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" v-loading="loading" element-loading-text="图片上传中..." border style="width: 100%" @selection-change="handleSelectionChange">
				<el-table-column type="index" width="50" align="center"></el-table-column>
				<el-table-column type="selection" align="center"></el-table-column>
				<el-table-column prop="_id" align="center" v-if="false"></el-table-column>
				<el-table-column prop="picture" label="图片名称" align="center"></el-table-column>
				<el-table-column prop="createDate" label="上传时间" align="center"></el-table-column>
				<el-table-column prop="createUser" label="上传人" align="center"></el-table-column>
				<el-table-column label="缩略图" align="center">
					<template slot-scope="scope">
						<img :src="scope.row.imageUrl" alt="Image" style="max-width: 100px; max-height: 100px;" />
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<el-button type="primary" size="mini" icon="el-icon-search" @click="showPicture(scope.row)">查看图片</el-button>
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

			<el-dialog title="图片" :visible.sync="showPictureDialog" width="30%">
				<div style="text-align: center" >
					<img :src="pictureUrl" style="width: 400px; height: 400px;">
				</div>
        	</el-dialog>

			<el-dialog title="图片" :visible.sync="showUpdateDialog" width="30%">
				<el-form ref="updateFormRef" :model="updateForm" :inline="true">
					<el-form-item v-if="false">
						<el-input v-model="updateForm._id"></el-input>
					</el-form-item>
					<el-form-item>
						<el-upload
							action="#"
							:limit="1"
							:file-list="fileList"
							:http-request="submitUpdate"
							:on-change="handleChange"
							:show-file-list="false"
							accept="image/jpeg,image/png"
						>
							<el-button type="primary">上传图片</el-button>
						</el-upload>
					</el-form-item>
				</el-form>
        	</el-dialog>
		</el-card>
	</div>
</template>

<script>
import axios from 'axios'

export default {
    data() {
		return {
			token: '',
			tableData: [],
			fileList: [],
			archiveList: [],
			pictureUrl: '',
			pictureLedgerForm: {
				shortName: '',
				picture: ''
			},
			multipleSelection: [],
			updateForm: {
				_id: '',
				formData: null,
			},
			currentPage: 1,
            total: 0,
            pageSize: 10,
			showPictureDialog: false,
			showUpdateDialog: false,
			loading: false
		}
    },
    methods: {
		async queryPicture() {
			const { data: result } = await this.$http.get('/pictureLedger/queryPicture', { params: this.pictureLedgerForm })
			const tableData = result.data.map(v => {
				v.createDate = this.$moment(v.createDate).format("YYYY-MM-DD HH:mm:ss")
				v.imageUrl = "https://www.mmldar.com/api" + v.picturePath
				return v
			})
			this.tableData = tableData
		},
		async uploadPicture(file) {
			const formData = new FormData()
			formData.append('file', file.file)

			try {
				const { data: result } = await axios({
					method: 'post',
					url: 'https://www.mmldar.com/api/pictureLedger/uploadPicture',
					data: formData,
					headers: {
						'Content-Type': 'multipart/form-data',
						'Authorization': this.token
					}
				})

				if (+result.code === 0) {
					this.$message.success('上传图片成功')
				} else {
					this.$message.error('上传图片失败')
				}

				this.queryPicture()
			} catch (error) {
				this.$message.error('上传图片失败' + error)
			}
		},
		showPicture(row) {
			this.showPictureDialog = true
			this.pictureUrl = "https://www.mmldar.com/api" + row.picturePath
		},
		deletePicture(row) {
			if (this.multipleSelection.length === 0 ) {
				this.$message.error('请勾选数据')
				return
			}

			this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
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
			const { data: result } = await this.$http.post('/pictureLedger/deletePicture', { deleteData: this.multipleSelection })

			if (+result.code === 0) {
				this.$message.success('图片删除成功')
			} else {
				this.$message.error('图片删除失败')
			}

			this.queryPicture()
		},
		async uploadPicArchive(file) {
			this.loading = true

			const formData = new FormData()
			formData.append('file', file.file)

            try {
				const { data: result } = await axios({
					method: 'post',
					url: 'https://www.mmldar.com/api/pictureLedger/uploadPicArchive',
					data: formData,
					headers: {
						'Content-Type': 'multipart/form-data',
						'Authorization': this.token
					}
				})

				if (+result.code === 0) {
					this.$message.success('上传图片压缩包成功')
				} else {
					this.$message.error('上传图片压缩包失败')
				}

				this.queryPicture()
			} catch (error) {
				this.$message.error('上传图片压缩包失败' + error)
			}

			this.loading = false
        },
		updatePicture() {
			if (this.multipleSelection.length !== 1 ) {
				this.$message.error('请一次勾选一条数据')
				return
			}

			this.showUpdateDialog = true
			this.updateForm._id = this.multipleSelection[0]._id
		},
		async submitUpdate(file) {
			this.updateForm.formData = new FormData()
			this.updateForm.formData.append('_id', this.updateForm._id)
			this.updateForm.formData.append('file', file.file)

			try {
				const { data: result } = await axios({
					method: 'post',
					url: 'https://www.mmldar.com/api/pictureLedger/updatePicture',
					data: this.updateForm.formData,
					headers: {
						'Content-Type': 'multipart/form-data',
						'Authorization': this.token
					}
				})

				if (+result.code === 0) {
					this.$message.success('修改图片成功')
				} else {
					this.$message.error('修改图片失败')
				}

			} catch (error) {
				this.$message.error('上传图片失败' + error)
			}

			this.showUpdateDialog = false
			this.queryPicture()
		},
		handleChange(file, fileList) {
			if (fileList.length > 0) {
        		this.fileList = []
      		}
		},
		handleArchiveChange(file, fileList) {
			if (fileList.length > 0) {
        		this.archiveList = []
      		}
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
		getShortName() {
			this.pictureLedgerForm.shortName =  this.$store.state.userInfo.shortName
		},
		getToken() {
			this.token = window.sessionStorage.getItem("token")
		}
    },
    created() {
		this.queryPicture()
		this.getShortName()
		this.getToken()
    }
}
</script>

<style lang="less" scoped>
</style>
