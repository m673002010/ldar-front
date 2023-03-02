<template>
    <div>
		<el-card>
			<el-form ref="form" :model="form" label-width="80px" :inline="true">
				<el-form-item label="区域编号">
					<el-input form.areaNum></el-input>
				</el-form-item>
				<el-form-item label="区域名称">
					<el-input v-model="form.area"></el-input>
				</el-form-item>
				<el-form-item label="装置名称">
					<el-select v-model="form.device" placeholder="请选择">
						<el-option
							v-for="item in deviceOptions"
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
				<el-table-column prop="areaNum" label="区域编号" align="center"></el-table-column>
				<el-table-column prop="area" label="区域名称" align="center"></el-table-column>
				<el-table-column prop="deviceNum" label="装置编号" align="center"></el-table-column>
				<el-table-column prop="device" label="装置名称" align="center"></el-table-column>
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
				{ areaNum: 'A001', area: '2,6-二甲基苯胺', deviceNum: 'D001', device: '2,6-二甲基苯胺装置A', createDate: '2022-01-17', createUser: 'admin',editDate: '2022-01-17', editUser: 'admin' },
				{ areaNum: 'A002', area: '公共区域', deviceNum: 'D001', device: '2,6-二甲基苯胺装置A', createDate: '2022-01-17', createUser: 'admin',editDate: '2022-01-17', editUser: 'admin' },
				{ areaNum: 'A003', area: '丙溴磷', deviceNum: 'D001', device: '2,6-二甲基苯胺装置A', createDate: '2022-01-17', createUser: 'admin',editDate: '2022-01-17', editUser: 'admin' },
				{ areaNum: 'A004', area: '二层', deviceNum: 'D001', device: '2,6-二甲基苯胺装置A', createDate: '2022-01-17', createUser: 'admin',editDate: '2022-01-17', editUser: 'admin' },
				{ areaNum: 'A005', area: '一层', deviceNum: 'D001', device: '2,6-二甲基苯胺装置A', createDate: '2022-01-17', createUser: 'admin',editDate: '2022-01-17', editUser: 'admin' },
				{ areaNum: 'A006', area: '罐区', deviceNum: 'D001', device: '2,6-二甲基苯胺装置A', createDate: '2022-01-17', createUser: 'admin',editDate: '2022-01-17', editUser: 'admin' },
				{ areaNum: 'A007', area: '罐区', deviceNum: 'D001', device: '2,6-二甲基苯胺装置A', createDate: '2022-01-17', createUser: 'admin',editDate: '2022-01-17', editUser: 'admin' },
				{ areaNum: 'A008', area: '甲霜灵', deviceNum: 'D001', device: '2,6-二甲基苯胺装置A', createDate: '2022-01-17', createUser: 'admin',editDate: '2022-01-17', editUser: 'admin' }
			],
			form: {
				areaNum: '',
				area: '',
				device: ''
			},
			deviceOptions: [
				{ label: '丙溴磷装置', value: '1' },
				{ label: '罐区', value: '2' },
				{ label: '霜霉威装置', value: '3' },
				{ label: '二甲基苯胺A车间', value: '4' },
				{ label: '二甲基苯胺B车间', value: '5' },
				{ label: '甲霜灵车间', value: '6' },
				{ label: '乳油车间', value: '7' },
			],
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
