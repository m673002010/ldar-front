<template>
    <div>
		<el-card>
			<el-form ref="form" :model="form" label-width="80px" :inline="true">
                <el-form-item label="活动时间">
                    <el-date-picker
                    v-model="form.value"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
					<el-button type="primary" icon="el-icon-search">查询</el-button>
					<el-button type="primary" icon="el-icon-download">下载模板</el-button>
					<el-button type="primary" icon="el-icon-folder-add">导入数据</el-button>
					<el-button type="primary" icon="el-icon-folder-remove">导入数据</el-button>
					<el-button type="primary" icon="el-icon-refresh">重置</el-button>
					<el-button type="danger" icon="el-icon-delete">清除</el-button>
				</el-form-item>
			</el-form>

			<el-table ref="multipleTable" :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" border style="width: 100%"
			@selection-change="handleSelectionChange">
				<el-table-column type="index" align="center"></el-table-column>
                <el-table-column fixed type="selection" align="center"></el-table-column>
				<el-table-column fixed prop="calibrationDate" label="校准日期" align="center"></el-table-column>
				<el-table-column fixed prop="calibrationPeople" label="日期" align="center"></el-table-column>
                <el-table-column fixed prop="instrumentNum" label="仪器编号" align="center"></el-table-column>
                <el-table-column prop="zeroAirReading_1" label="零气读数（1）" align="center"></el-table-column>
                <el-table-column prop="zeroAirReading_2" label="零气读数（2）" align="center"></el-table-column>
				<el-table-column prop="calibrationGasReading_1" label="标气读数（1）" align="center"></el-table-column>
				<el-table-column prop="calibrationGasReading_2" label="标气读数（2）" align="center"></el-table-column>
				<el-table-column prop="calibrationGasReading_3" label="标气读数（3）" align="center"></el-table-column>
				<el-table-column prop="ResponseTime_1" label="响应时间（1）" align="center"></el-table-column>
                <el-table-column prop="ResponseTime_2" label="响应时间（2）" align="center"></el-table-column>
                <el-table-column prop="ResponseTime_3" label="响应时间（3）" align="center"></el-table-column>
                <el-table-column prop="zeroGasIndicationError" label="零气示值误差" align="center"></el-table-column>
                <el-table-column prop="calibrationGasIndicationError" label="标气示值误差" align="center"></el-table-column>
                <el-table-column prop="calibrationGasReadingAfterTest_1" label="测试后标气读数（1）" align="center"></el-table-column>
                <el-table-column prop="calibrationGasReadingAfterTest_2" label="测试后标气读数（2）" align="center"></el-table-column>
                <el-table-column prop="calibrationGasReadingAfterTest_3" label="测试后标气读数（3）" align="center"></el-table-column>
                <el-table-column prop="calibrationGasStandardValue" label="标气标准值" align="center"></el-table-column>
                <el-table-column prop="responseTimeAfterTest_1" label="测试后响应时间（1）" align="center"></el-table-column>
                <el-table-column prop="responseTimeAfterTest_2" label="测试后响应时间（2）" align="center"></el-table-column>
                <el-table-column prop="responseTimeAfterTest_3" label="测试后响应时间（3）" align="center"></el-table-column>
                <el-table-column prop="indicationDrift" label="示值漂移" align="center"></el-table-column>
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
			tableData: [],
			form: {
				value: '',
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
