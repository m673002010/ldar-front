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
					<el-button type="danger" icon="el-icon-delete">删除</el-button>

				</el-form-item>
			</el-form>
		
			<el-table :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" border style="width: 100%">
				<el-table-column fixed type="index" align="center"></el-table-column>
				<el-table-column fixed type="selection" align="center"></el-table-column>
				<el-table-column fixed prop="device" label="装置名称" align="center"></el-table-column>
				<el-table-column fixed prop="area" label="区域名称" align="center"></el-table-column>
				<el-table-column fixed prop="equipment" label="设备名称" align="center"></el-table-column>
				<el-table-column fixed prop="label" label="标签号" align="center"></el-table-column>
				<el-table-column fixed prop="expand" label="扩展号" align="center"></el-table-column>
				<el-table-column prop="componentType" label="组件类型" align="center"></el-table-column>
				<el-table-column prop="uploadTime" label="PID图号" align="center"></el-table-column>
				<el-table-column prop="reference" label="参考物" align="center"></el-table-column>
				<el-table-column prop="location" label="位置" align="center"></el-table-column>
				<el-table-column prop="distance" label="距离(米)" align="center"></el-table-column>
				<el-table-column prop="floor" label="楼层" align="center"></el-table-column>
				<el-table-column prop="high" label="高度(米)" align="center"></el-table-column>
				<el-table-column prop="description" label="附加描述" align="center"></el-table-column>
				<el-table-column prop="size" label="尺寸(mm)" align="center"></el-table-column>
				<el-table-column prop="unreachable" label="是否不可达" align="center"></el-table-column>
				<el-table-column prop="reason" label="不可达原因" align="center"></el-table-column>
				<el-table-column prop="medium" label="主要介质" align="center"></el-table-column>
				<el-table-column prop="status" label="介质状态" align="center"></el-table-column>
				<el-table-column prop="quantity" label="数量" align="center"></el-table-column>
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
					device: '二甲基苯胺A车间', 
					area: '二甲基苯胺车间A车间', 
					equipment: 'V-402B', 
					label: 'EJJBA1-01-01-0001', 
					expand: '001',
					componentType: '法兰',
					uploadTime: '',
					reference: '',
					location: '东南左上',
					distance: '0.7',
					floor: '1',
					high: '0.8',
					description: '',
					size: '25',
					unreachable: '否',
					reason: '',
					medium: '二甲基苯胺 二甲基环己胺 ',
					status: '轻液',
					quantity: '',
				},
			],
			form: {
				device: '',
				department: '',
				isClear: true
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
			areaOption: [
				{ label: '全部', value: '1' },
			],
			equipmentOption: [
				{ label: 'E-101', value: 'E-101' },
				{ label: 'E-102', value: 'E-102' },
				{ label: 'E-103', value: 'E-103' },
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
