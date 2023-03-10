<template>
    <div>
		<el-card>
			<el-form ref="form" :model="form" label-width="100px" :inline="true">
				<el-form-item label="装置类型编号">
					<el-input v-model="form.deviceTypeNum"></el-input>
				</el-form-item>
				<el-form-item label="装置类型名称">
					<el-input v-model="form.deviceTypeName"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="el-icon-search">查询</el-button>
				</el-form-item>
			</el-form>

			<el-table ref="multipleTable" :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" border style="width: 100%"
			@selection-change="handleSelectionChange">
				<el-table-column type="index" align="center"></el-table-column>
				<el-table-column prop="deviceTypeNum" label="装置类型编号" align="center"></el-table-column>
				<el-table-column prop="type" label="类型" align="center"></el-table-column>
                <el-table-column prop="deviceTypeName" label="装置类型名称" align="center"></el-table-column>
				<el-table-column prop="createDate" label="创建时间" align="center"></el-table-column>
				<el-table-column prop="createUser" label="创建人" align="center"></el-table-column>
				<el-table-column prop="editDate" label="修改时间" align="center"></el-table-column>
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
	</div>
</template>

<script>
export default {
    data() {
		return {
			tableData: [
                { deviceTypeNum: 'CE', type: "化工", deviceTypeName: '化工', createDate: '2022-01-17', createUser: 'admin', editDate: '2022-01-17', editUser: 'admin' },
                { deviceTypeNum: 'OIL', type: "炼油", deviceTypeName: '炼油', createDate: '2022-01-17', createUser: 'admin', editDate: '2022-01-17', editUser: 'admin' },
			],
			form: {
				deviceTypeNum: '',
                deviceTypeName: '',
			},
            multipleSelection: [],
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
      	handleSelectionChange(val) {
        	this.multipleSelection = val
      	}
    },
    created() {
    }
}
</script>

<style lang="less" scoped>
</style>
