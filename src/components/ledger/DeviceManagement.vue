<template>
    <div>
		<el-card>
			<el-form ref="form" :model="form" label-width="100px" :inline="true">
				<el-form-item label="装置编号">
					<el-input form.deviceNum></el-input>
				</el-form-item>
				<el-form-item label="装置名称">
					<el-input v-model="form.device"></el-input>
				</el-form-item>
				<el-form-item label="装置类型名称">
					<el-select v-model="form.deviceType" placeholder="请选择">
						<el-option
							v-for="item in deviceTypeOptions"
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
		
			<el-table :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" border style="width: 100%">
				<el-table-column type="index"></el-table-column>
				<el-table-column type="selection"></el-table-column>
				<el-table-column prop="deviceNum" label="装置编号"></el-table-column>
				<el-table-column prop="device" label="装置名称"></el-table-column>
				<el-table-column prop="deviceType" label="装置类型"></el-table-column>
				<el-table-column prop="department" label="部门名称"></el-table-column>
				<el-table-column prop="createDate" label="创建时间"></el-table-column>
				<el-table-column prop="createUser" label="创建人"></el-table-column>
				<el-table-column prop="editDate" label="修改时间"></el-table-column>
				<el-table-column prop="editUser" label="修改人"></el-table-column>
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
				{ deviceNum: 'D002', device: '丙溴磷装置', deviceType: '化工', department: '检测组', createDate: '2022-01-17', createUser: 'admin',editDate: '2022-01-17', editUser: 'admin' },
				{ deviceNum: 'D003', device: '罐区', deviceType: '化工', department: '检测组', createDate: '2022-01-17', createUser: 'admin',editDate: '2022-01-17', editUser: 'admin' },
				{ deviceNum: 'D004', device: '霜霉威装置', deviceType: '化工', department: '检测组', createDate: '2022-01-17', createUser: 'admin',editDate: '2022-01-17', editUser: 'admin' },
				{ deviceNum: 'D005', device: '二甲基苯胺A车间', deviceType: '化工', department: '检测组', createDate: '2022-01-17', createUser: 'admin',editDate: '2022-01-17', editUser: 'admin' },
				{ deviceNum: 'D006', device: '二甲基苯胺B车间', deviceType: '化工', department: '检测组', createDate: '2022-01-17', createUser: 'admin',editDate: '2022-01-17', editUser: 'admin' },
				{ deviceNum: 'D007', device: '甲霜灵车间', deviceType: '化工', department: '检测组', createDate: '2022-01-17', createUser: 'admin',editDate: '2022-01-17', editUser: 'admin' },
				{ deviceNum: 'D008', device: '乳油车间', deviceType: '化工', department: '检测组', createDate: '2022-01-17', createUser: 'admin',editDate: '2022-01-17', editUser: 'admin' },
			],
			form: {
				deviceNum: '',
				device: '',
				deviceType: ''
			},
			deviceTypeOptions: [
				{ label: '化工', value: '1' },
				{ label: '炼油', value: '2' },
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
        }
    },
    created() {
    }
}
</script>

<style lang="less" scoped>
</style>
