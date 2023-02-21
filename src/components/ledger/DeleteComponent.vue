<template>
    <div>
		<el-card>
			<el-form ref="form" :model="form" :inline="true" label-width="80px">
				<el-form-item label="装置">
					<el-select v-model="form.device" placeholder="请选择">
						<el-option
							v-for="item in deviceOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="区域">
					<el-select v-model="form.area" placeholder="请选择">
						<el-option
							v-for="item in areaOption"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
                <el-form-item label="设备">
					<el-select v-model="form.equipment" placeholder="请选择">
						<el-option
							v-for="item in equipmentOption"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary">查询</el-button>
				</el-form-item>
			</el-form>
		
			<el-table :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" border style="width: 100%">
				<el-table-column type="index" width="50"></el-table-column>
				<el-table-column type="selection" width="50"></el-table-column>
				<el-table-column prop="picture" label="图片名称"></el-table-column>
				<el-table-column prop="uploadTime" label="上传时间"></el-table-column>
				<el-table-column prop="createUser" label="上传人"></el-table-column>
				<el-table-column prop="updateTime" label="更新时间"></el-table-column>
				<el-table-column prop="updateUser" label="更新人"></el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button type="primary" icon="el-icon-search" size="mini" @click="showPicture(scope.row)">查看</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteData(scope.row)">删除</el-button>
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
	</div>
</template>

<script>
export default {
    data() {
		return {
			tableData: [
				{ picture: 'EJJBA1-01-01-0001', uploadTime: '2022-10-18 12:08:06', createUser: 'admin', updateTime: '2022-10-18 12:08:06', updateUser: 'admin' },
				{ picture: 'EJJBA1-01-01-0001', uploadTime: '2022-10-18 12:08:06', createUser: 'admin', updateTime: '2022-10-18 12:08:06', updateUser: 'admin' },
				{ picture: 'EJJBA1-01-01-0001', uploadTime: '2022-10-18 12:08:06', createUser: 'admin', updateTime: '2022-10-18 12:08:06', updateUser: 'admin' },
				{ picture: 'EJJBA1-01-01-0001', uploadTime: '2022-10-18 12:08:06', createUser: 'admin', updateTime: '2022-10-18 12:08:06', updateUser: 'admin' },
				{ picture: 'EJJBA1-01-01-0001', uploadTime: '2022-10-18 12:08:06', createUser: 'admin', updateTime: '2022-10-18 12:08:06', updateUser: 'admin' },
				{ picture: 'EJJBA1-01-01-0001', uploadTime: '2022-10-18 12:08:06', createUser: 'admin', updateTime: '2022-10-18 12:08:06', updateUser: 'admin' },
				{ picture: 'EJJBA1-01-01-0001', uploadTime: '2022-10-18 12:08:06', createUser: 'admin', updateTime: '2022-10-18 12:08:06', updateUser: 'admin' },
				{ picture: 'EJJBA1-01-01-0001', uploadTime: '2022-10-18 12:08:06', createUser: 'admin', updateTime: '2022-10-18 12:08:06', updateUser: 'admin' }
			],
			form: {
				device: '',
				department: '',
				isClear: true
			},
			deviceOptions: [
				{ label: '化工', value: '1' },
				{ label: '炼油', value: '2' },
			],
			areaOption: [
				{ label: '化工', value: '1' },
				{ label: '炼油', value: '2' },
			],
			equipmentOption: [
				{ label: '检测组', value: '1' },
				{ label: '技术组', value: '2' },
				{ label: '企业用户', value: '3' },
			],
			currentPage: 1, // 当前页码
            total: 0, // 总条数
            pageSize: 10 // 每页的数据条数
		}
    },
    methods: {
		handleSizeChange(val){
            this.currentPage = 1
            this.pageSize = val
        },
        handleCurrentChange(val){
            this.currentPage = val
        },
		deleteData(row) {
		}
    },
    created() {
    }
}
</script>

<style lang="less" scoped>
</style>
