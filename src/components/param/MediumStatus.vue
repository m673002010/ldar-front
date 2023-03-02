<template>
    <div>
		<el-card>
			<el-form ref="form" :model="form" label-width="80px" :inline="true">
				<el-form-item label="介质编号">
					<el-input v-model="form.mediumNum"></el-input>
				</el-form-item>
				<el-form-item label="设备名称">
					<el-input v-model="form.medium"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="el-icon-search">查询</el-button>
                    <el-button type="success" icon="el-icon-plus">新增</el-button>
					<el-button type="warning" icon="el-icon-edit">编辑</el-button>
					<el-button type="danger" icon="el-icon-delete">删除</el-button>
				</el-form-item>
			</el-form>
            
			<el-table ref="multipleTable" :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" border style="width: 100%"
			@selection-change="handleSelectionChange">
				<el-table-column type="index" align="center"></el-table-column>
				<el-table-column type="selection" align="center"></el-table-column>
				<el-table-column prop="mediumNum" label="介质编号" align="center"></el-table-column>
				<el-table-column prop="medium" label="介质名称" align="center"></el-table-column>
				<el-table-column prop="report" label="导出报告" align="center"></el-table-column>
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
                { mediumNum: 'G', medium: '气体/蒸汽', report: 'Gas/Vapor', createDate: '2022-01-17', createUser: 'admin',editDate: '2022-01-17', editUser: 'admin' },
                { mediumNum: 'H', medium: '重液', report: 'Heavy Liquid', createDate: '2022-01-17', createUser: 'admin',editDate: '2022-01-17', editUser: 'admin' },
                { mediumNum: 'L', medium: '轻液', report: 'Light Liquid', createDate: '2022-01-17', createUser: 'admin',editDate: '2022-01-17', editUser: 'admin' },
			],
			form: {
				mediumNum: '',
				medium: '',
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
