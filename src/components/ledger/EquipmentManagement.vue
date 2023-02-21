<template>
    <div>
		<el-card>
			<el-form ref="form" :model="form" label-width="80px">
				<el-form-item label="装置类型">
					<el-select v-model="form.device" placeholder="请选择">
						<el-option
							v-for="item in deviceOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="部门">
					<el-select v-model="form.department" placeholder="请选择">
						<el-option
							v-for="item in departmentOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-radio-group>
						<el-radio label="不清除原有数据"></el-radio>
						<el-radio label="清除原有数据"></el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item>
					<el-button type="primary">下载模板</el-button>
					<el-button type="primary">上传文件</el-button>
					<el-button type="primary">导入数据</el-button>
				</el-form-item>
			</el-form>
		
			<el-table :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" border style="width: 100%">
				<el-table-column type="index" width="50"></el-table-column>
				<el-table-column prop="import" label="导入文件名"></el-table-column>
				<el-table-column prop="new" label="新增数据量"></el-table-column>
				<el-table-column prop="edit" label="修改数据量"></el-table-column>
				<el-table-column prop="drop" label="丢弃数据量"></el-table-column>
				<el-table-column prop="createDate" label="创建时间"></el-table-column>
				<el-table-column prop="user" label="创建人"></el-table-column>
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
				{ import: 'component.xls', new: 11181, edit: 3974, drop: 0, createDate: '2022-01-17', user: 'admin' },
				{ import: 'component.xls', new: 11181, edit: 3974, drop: 0, createDate: '2022-01-17', user: 'admin' },
				{ import: 'component.xls', new: 11181, edit: 3974, drop: 0, createDate: '2022-01-17', user: 'admin' },
				{ import: 'component.xls', new: 11181, edit: 3974, drop: 0, createDate: '2022-01-17', user: 'admin' },
				{ import: 'component.xls', new: 11181, edit: 3974, drop: 0, createDate: '2022-01-17', user: 'admin' },
				{ import: 'component.xls', new: 11181, edit: 3974, drop: 0, createDate: '2022-01-17', user: 'admin' },
				{ import: 'component.xls', new: 11181, edit: 3974, drop: 0, createDate: '2022-01-17', user: 'admin' },
				{ import: 'component.xls', new: 11181, edit: 3974, drop: 0, createDate: '2022-01-17', user: 'admin' }
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
			departmentOptions: [
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
        }
    },
    created() {
    }
}
</script>

<style lang="less" scoped>
</style>
