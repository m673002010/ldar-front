<template>
    <div>
        <!-- <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb> -->
        <el-card>
            <el-button type="primary" @click="addDialogVisible = true">添加菜单权限</el-button>
            <el-tree :data="rightTree" :props="treeProps" node-key="rightId" :expand-on-click-node="false"
            default-expand-all :render-content="renderContent">
            </el-tree>
        </el-card>

        <el-dialog title="权限添加" :visible.sync="addDialogVisible">
            <el-form ref="addRightFormRef" :model="addRightForm">
                <el-form-item label="父id" prop="parentId" v-show="false">
                    <el-input v-model="addRightForm.parentId"></el-input>
                </el-form-item>
                <el-form-item label="权限类型" prop="authType">
                    <el-select v-model="addRightForm.authType" placeholder="请选择">
                        <el-option
                        v-for="item in authOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="权限名称" prop="authName">
                    <el-input v-model="addRightForm.authName"></el-input>
                </el-form-item>
                <el-form-item label="路径" prop="path">
                    <el-input v-model="addRightForm.path"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel('add')">取 消</el-button>
                <el-button type="primary" @click="addRight">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="权限编辑" :visible.sync="editDialogVisible">
            <el-form ref="editRightFormRef" :model="editRightForm">
                <el-form-item label="id" prop="rightId" v-show="false">
                    <el-input v-model="editRightForm.rightId"></el-input>
                </el-form-item>
                <el-form-item label="权限类型" prop="authType">
                    <el-select v-model="editRightForm.authType" placeholder="请选择">
                        <el-option
                        v-for="item in authOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="权限名称" prop="authName">
                    <el-input v-model="editRightForm.authName"></el-input>
                </el-form-item>
                <el-form-item label="路径" prop="path">
                    <el-input v-model="editRightForm.path"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel('edit')">取 消</el-button>
                <el-button type="primary" @click="editRight">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            rightTree: [],
            treeProps: {
                children: 'children',
                label: 'authName'
            },
            addDialogVisible: false,
            editDialogVisible: false,
            addRightForm: {
                parentId: 0,
                authType: '',
                authName: '',
                path: ''
            },
            editRightForm: {
                rightId: 0,
                authType: '',
                authName: '',
                path: ''
            },
            authOptions: [
                { label: '菜单权限', value: 1 },
                { label: '页面权限', value: 2 },
                { label: '接口权限', value: 3 }
            ],
        }
    },
    methods: {
        // 获取权限树
        async getRightTree() {
            const { data: result } = await this.$http.get('/right/rightTree')
            if (+result.code === 0) {
                this.rightTree = result.data
            } else this.$message.error('获取权限列表失败')
        },
        renderContent(h, { node, data, store }) {
            return (
            <span class="custom-tree-node">
                <span>{node.label}</span>
                <span>
                <el-button size="mini" type="text" on-click={ () => this.append(data) }>添加</el-button>
                <el-button size="mini" type="text" on-click={ () => this.edit(data) }>编辑</el-button>
                <el-button size="mini" type="text" on-click={ () => this.remove(node, data) }>删除</el-button>
                </span>
            </span>)
        },
        append(data) {
            this.addDialogVisible = true
            this.addRightForm.parentId = data.rightId
        },
        edit(data) {
            this.editDialogVisible = true
            this.editRightForm.rightId = data.rightId
            this.editRightForm.authType = data.authType
            this.editRightForm.authName = data.authName
            this.editRightForm.path = data.path
        },
        // 删除权限
        async remove(node, data) {
            const { data: result } = await this.$http.get('/right/deleteRight', { params: { rightId: data.rightId } })
            if (+result.code === 0) {
                this.$message.success('删除权限成功')
                await this.getRightTree()
            } else {
                this.$message.error('删除权限失败')
            }
        },
        // 添加权限
        async addRight () {
            const { data: result } = await this.$http.post('/right/addRight', this.addRightForm)
            if (+result.code === 0) {
                this.$message.success('添加权限成功')
                this.addDialogVisible = false
                await this.getRightTree()
            } else {
                this.$message.error('添加权限失败')
            }
            
            this.$refs.addRightFormRef.resetFields()
        },
        // 编辑权限
        async editRight () {
            const { data: result } = await this.$http.post('/right/editRight', this.editRightForm)
            if (+result.code === 0) {
                this.$message.success('编辑权限成功')
                this.editDialogVisible = false
                await this.getRightTree()
            } else {
                this.$message.error('编辑权限失败')
            }
            
            this.$refs.editRightFormRef.resetFields()
        },
        cancel (str) {
            this[`${str}DialogVisible`] = false
            this.$refs[`${str}RightFormRef`].resetFields()
        }
    },
    created() {
        this.getRightTree()
    }
}
</script>

<style>
    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }
</style>
