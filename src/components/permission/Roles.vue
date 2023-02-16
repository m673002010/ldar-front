<template>
    <div>
        <!-- <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb> -->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="addRoleDialog = true">添加角色</el-button>
                </el-col>
            </el-row>
            <el-table :data="roleList" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="desc"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(scope.row)">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteRole(scope.row)">删除</el-button>
                        <el-button type="warning" icon="el-icon-setting" size="mini" @click="allocate(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <el-dialog title="角色添加" :visible.sync="addRoleDialog">
            <el-form ref="addRoleFormRef" :model="addRoleForm">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="addRoleForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="desc">
                    <el-input v-model="addRoleForm.desc"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel('addRole')">取 消</el-button>
                <el-button type="primary" @click="addRole">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="角色编辑" :visible.sync="editRoleDialog">
            <el-form ref="editRoleFormRef" :model="editRoleForm">
                <el-form-item label="角色id" prop="roleId" v-show="false">
                    <el-input v-model="editRoleForm.roleId"></el-input>
                </el-form-item>
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="editRoleForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="desc">
                    <el-input v-model="editRoleForm.desc"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel('editRole')">取 消</el-button>
                <el-button type="primary" @click="editRole">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="权限分配" :visible.sync="rightTreeDialog">
            <el-tree :data="rightTree" ref="rightTreeRef" :props="treeProps" node-key="rightId" show-checkbox :expand-on-click-node="false"
            default-expand-all>
            </el-tree>
            <el-button @click="cancel('rightTree')">取 消</el-button>
            <el-button type="primary" @click="submit">确 定</el-button>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            roleList: [],
            rightTree: [],
            treeProps: {
                children: 'children',
                label: 'authName'
            },
            addRoleDialog: false,
            editRoleDialog: false,
            rightTreeDialog: false,
            addRoleForm: {
                roleName: '',
                desc: ''
            },
            editRoleForm: {
                roleId: 0,
                roleName: '',
                desc: ''
            },
            roleId: 0
        }
    },
    methods: {
        // 获取角色列表
        async getRoleList() {
            const { data: result } = await this.$http.get('/role/roleList')
            if (+result.code === 0) {
                this.roleList = result.data
            } else this.$message.error('获取角色列表失败')
        },
        // 获取权限树
        async getRightTree() {
            const { data: result } = await this.$http.get('/right/rightTree')
            if (+result.code === 0) {
                this.rightTree = result.data
            } else this.$message.error('获取权限树失败')
        },
        // 添加角色
        async addRole() {
            const { data: result } = await this.$http.post('/role/addRole', this.addRoleForm)
            if (+result.code === 0) {
                this.$message.success('添加角色成功')
                await this.getRoleList()
            } else {
                this.$message.error('添加角色失败')
            }

            this.cancel('addRole')
        },
        // 编辑角色
        async editRole() {
            const { data: result } = await this.$http.post('/role/editRole', this.editRoleForm)
            if (+result.code === 0) {
                this.$message.success('编辑角色成功')
                
                await this.getRoleList()
            } else {
                this.$message.error('编辑角色失败')
            }
            
            this.cancel('editRole')
        },
        // 删除角色
        async deleteRole(row) {
            const { data: result } = await this.$http.get('/role/deleteRole', { params: { roleId: row.roleId } })
            if (+result.code === 0) {
                this.$message.success('删除角色成功')
                
                await this.getRoleList()
            } else {
                this.$message.error('删除角色失败')
            }
        },
        // 提交权限分配
        async submit() {
            const roleId = this.roleId
            // 半选全选都提交
            const checkedKeys = this.$refs.rightTreeRef.getCheckedKeys()
            const halfCheckedKeys = this.$refs.rightTreeRef.getHalfCheckedKeys()
            const rightIds = checkedKeys.concat(halfCheckedKeys)
            const { data: result } = await this.$http.post('/role/allocateRights', { roleId, rightIds })
            if (+result.code === 0) {
                this.$message.success('更新权限成功')
                
                await this.getRoleList()
            } else {
                this.$message.error('更新权限失败')
            }

            this.cancel('rightTree')
        },
        // 弹出分配权限框
        async allocate(row) {
            this.rightTreeDialog = true
            this.roleId = row.roleId
            const { data: result } = await this.$http.get('/role/getRoleRights', { params: { roleId: row.roleId } })
            if (+result.code === 0) {
                const rights = result.data
                const rightIds = rights.map(v => {
                    if (v.authType === 3) return v.rightId
                })
                this.$nextTick(function() {
                    this.$refs.rightTreeRef.setCheckedKeys(rightIds)
                })
            } else {
                this.$message.error('获取角色权限失败')
            }
        },
        // 弹出角色编辑框
        edit(row) {
            this.editRoleDialog = true
            this.editRoleForm.roleId = row.roleId
            this.editRoleForm.roleName = row.roleName
            this.editRoleForm.desc = row.desc
        },
        // 取消对话框
        cancel (str) {
            this[`${str}Dialog`] = false
            if (str !== 'rightTree') this.$refs[`${str}FormRef`].resetFields()
            else this.$refs.rightTreeRef.setCheckedKeys([])
        }
    },
    created () {
        this.getRoleList()
        this.getRightTree()
    }
}
</script>
