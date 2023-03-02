<template>
    <div>
		<el-card>
			<el-form ref="form" :model="form" label-width="100px" :inline="true">
				<el-form-item label="组件类型编号">
					<el-input v-model="form.componentTypeNum"></el-input>
				</el-form-item>
				<el-form-item label="组件类型名称">
					<el-input v-model="form.componentType"></el-input>
				</el-form-item>
                <el-form-item label="计算类别名称">
					<el-select v-model="form.calculationType" placeholder="请选择">
						<el-option
							v-for="item in calculationTypeOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
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
				<el-table-column prop="componentTypeNum" label="组件类型编号" align="center"></el-table-column>
				<el-table-column prop="componentType" label="组件类型名称" align="center"></el-table-column>
				<el-table-column prop="calculationType" label="计算类别" align="center"></el-table-column>
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
                { componentTypeNum: 'A', componentType: '搅拌器', calculationType: '搅拌器', createDate: '2022-01-17', createUser: 'admin',editDate: '2022-01-17', editUser: 'admin' },
                { componentTypeNum: 'C', componentType: '连接件', calculationType: '连接件', createDate: '2022-01-17', createUser: 'admin',editDate: '2022-01-17', editUser: 'admin' },
                { componentTypeNum: 'F', componentType: '法兰', calculationType: '法兰', createDate: '2022-01-17', createUser: 'admin',editDate: '2022-01-17', editUser: 'admin' },
			],
			form: {
				componentTypeNum: '',
				componentType: '',
                calculationType: '',
			},
            calculationTypeOptions: [],
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
