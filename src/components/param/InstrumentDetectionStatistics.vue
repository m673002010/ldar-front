<template>
    <div>
		<el-card>
			<el-form ref="form" :model="form" label-width="50px" :inline="true">
				<el-form-item label="年份">
					<el-select v-model="form.year" placeholder="请选择">
						<el-option
							v-for="item in yearOption"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="季度">
					<el-select v-model="form.quarter" placeholder="请选择">
						<el-option
							v-for="item in quarterOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
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

			<el-table ref="table" :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" border style="width: 100%"
			@selection-change="handleSelectionChange">
				<el-table-column type="index" align="center"></el-table-column>
				<el-table-column prop="year" label="年份" align="center"></el-table-column>
				<el-table-column prop="quarter" label="检测季度" align="center"></el-table-column>
				<el-table-column prop="area" label="区域名称" align="center"></el-table-column>
				<el-table-column prop="instrumentNum" label="仪器编号" align="center"></el-table-column>
				<el-table-column prop="instrument" label="仪器名称" align="center"></el-table-column>
				<el-table-column prop="model" label="仪器型号" align="center"></el-table-column>
				<el-table-column prop="maintenance" label="维护内容" align="center"></el-table-column>
				<el-table-column prop="quantity" label="检测数量" align="center"></el-table-column>
				<el-table-column prop="calibrationUnit" label="检定/校准单位" align="center"></el-table-column>
				<el-table-column prop="certificateNum" label="检定/校准证书编号" align="center"></el-table-column>
				<el-table-column prop="description" label="描述" align="center"></el-table-column>
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
				{ 
					year: '2022', 
					quarter: '一', 
					area: '2,6-二甲基苯胺', 
					instrumentNum: '', 
					instrument: '', 
					model: '', 
					maintenance: '',
					quantity: '',
					calibrationUnit: '',
					certificateNum: '', 
					description: '' 
				}
			],
			form: {
				year: '',
				quarter: '',
			},
			yearOption: [
				{ label: '2019', value: '2019' },
				{ label: '2020', value: '2020' },
				{ label: '2021', value: '2021' },
				{ label: '2022', value: '2022' },
				{ label: '2023', value: '2023' },
			],
			quarterOptions: [
				{ label: '第一季度', value: '1' },
				{ label: '第二季度', value: '2' },
				{ label: '第三季度', value: '3' },
				{ label: '第四季度', value: '4' }
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
