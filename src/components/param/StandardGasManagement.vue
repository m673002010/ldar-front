<template>
    <div>
		<el-card>
			<el-form ref="form" :model="form" label-width="100px" :inline="true">
				<el-form-item label="标准气编号:">
					<el-input v-model="form.standardGasNum"></el-input>
				</el-form-item>
				<el-form-item label="标准气名称:">
					<el-input v-model="form.standardGas"></el-input>
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
				<el-table-column prop="standardGasNum" label="标准气编号" align="center"></el-table-column>
				<el-table-column prop="standardGas" label="标准气名称" align="center"></el-table-column>
                <el-table-column prop="dailyCalibration" label="需要日常校准" align="center"></el-table-column>
                <el-table-column prop="needDriftCalibration" label="需要漂移校准" align="center"></el-table-column>
				<el-table-column prop="type" label="类型" align="center"></el-table-column>
                <el-table-column prop="standardGasActual" label="标准气实际浓度" align="center"></el-table-column>
                <el-table-column prop="standardGasTheory" label="标准气理论浓度" align="center"></el-table-column>
                <el-table-column prop="validTime" label="有效日期" align="center"></el-table-column>
                <el-table-column prop="stopUse" label="停用" align="center"></el-table-column>
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
			],
			form: {
				standardGasNum: '',
                standardGas: '',
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
