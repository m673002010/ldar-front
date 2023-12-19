<template>
    <div>
        <!-- <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb> -->

        <el-card>
            <el-row :gutter="20">
                <!-- <el-col :span="8">
                    <el-input placeholder="请输入内容"  class="input-with-select">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col> -->
                <el-col :span="4">
                    <el-button type="primary" @click="addDialog = true">添加用户</el-button>
                </el-col>
            </el-row>

            <el-table :data="userList" border>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="角色" prop="roleName"></el-table-column>
                <el-table-column label="公司" prop="companyNum"></el-table-column>
                <el-table-column label="密码" prop="password"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="editUser(scope.row)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row)"></el-button>
                        <el-tooltip :enterable="false" placement="top" effect="dark" content="分配角色">
                            <el-button type="warning" icon="el-icon-setting" size="mini" @click="allocate(scope.row)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryForm.page"
                :page-sizes="[1, 5, 10, 50]"
                :page-size="queryForm.size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>

        <el-dialog
            title="添加用户"
            :visible.sync="addDialog"
            width="30%" @close="dialogClose('addForm')">
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="公司" prop="companyNum">
                    <el-select v-model="addForm.companyNum">
                        <el-option v-for="(item, index) in companyList" :key="index" :label="item" :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialog = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog
            title="修改用户"
            :visible.sync="editDialog"
            width="30%" @close="dialogClose('editForm')">
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
                <el-form-item label="id" prop="userId" v-show="false">
                    <el-input v-model="editForm.userId"></el-input>
                </el-form-item>
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="editForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="editForm.password"></el-input>
                </el-form-item>
                <el-form-item label="公司" prop="companyNum">
                    <el-select v-model="editForm.companyNum">
                        <el-option v-for="(item, index) in companyList" :key="index" :label="item" :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialog = false">取 消</el-button>
                <el-button type="primary" @click="submitEdit">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog
            title="分配角色"
            :visible.sync="roleDialog"
            width="30%" @close="dialogClose('roleForm')">
            <el-form :model="roleForm" ref="roleFormRef" label-width="70px">
                <el-form-item label="用户id" prop="userId" v-show="false">
                    <el-input v-model="roleForm.userId"></el-input>
                </el-form-item>
                <el-form-item label="用户" prop="username">
                    <el-input v-model="roleForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="角色" prop="roleName">
                    <el-input v-model="roleForm.roleName" disabled></el-input>
                </el-form-item>
                <el-form-item label="角色列表" prop="roleId">
                    <el-select v-model="roleForm.roleId">
                        <el-option v-for="role in roleList" :key="role.roleId" :label="role.roleName" :value="role.roleId">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="roleDialog = false">取 消</el-button>
                <el-button type="primary" @click="submitRole">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {   
            queryForm: {
                id: '',
                page: 1,
                size: 5,
            },
            total: 0,
            userList: [],
            roleList: [],
            companyList: [],
            addDialog: false,
            editDialog: false,
            roleDialog: false,
            userInfo: {
                username: '',
                roleName: ''
            },
            addForm: {
                username: '',
                password: '',
            },
            editForm: {
                userId: 0,
                username: '',
                password: '',
            },
            roleForm: {
                userId: 0,
                username: '',
                roleName: '',
                roleId: '',
            },
            addFormRules: {
                username: [{ required: true, message: "请输入用户名" }, { min: 2, max: 10, message: '用户名长度在1-10位'}],
                password: [{ required: true, message: "请输入密码" }, { min: 5, max: 36, message: '密码长度在5-36位'}]
            },
            editFormRules: {
                username: [{ required: true, message: "请输入用户名" }, { min: 2, max: 10, message: '用户名长度在1-10位'}],
                password: [{ required: true, message: "请输入密码" }, { min: 5, max: 36, message: '密码长度在5-36位'}]
            }
        }
    },
    methods: {
        async getUserList() { // 获取用户
             const { data: result } =  await this.$http.get('/user/getUsers', { params: this.queryForm })
            // 增加或删除对象属性值时，视图并不触发更新
            // this.userList = result.data.users
            // this.userList = this.userList.map(v => Object.assign(v, { state: false }))
            
            // 可以触发视图更新
            // this.userList = result.data.users
            // this.userList.forEach(v => {
            //     this.$set(v, 'state', false)
            // })

            const users = result.data.users
            this.total = result.data.total
            this.userList = users.map(v => Object.assign(v, { state: false }))
        },
        addUser() { // 添加用户
            this.$refs.addFormRef.validate(async (val) => {
                if (val) {
                    const { data: result } =  await this.$http.post('/user/addUser', this.addForm)
                    if (+result.code === 0) {
                        this.$message.success('添加用户成功')
                        this.addDialog = false
                        this.getUserList()
                    } else {
                        this.$message.error('添加用户失败')
                    }
                }
            })
        },
        editUser(row) { // 编辑用户
            this.editDialog = true 
            this.editForm = { userId: row.userId, username: row.username, companyNum: row.companyNum }
        },
        submitEdit () { // 提交编辑
            this.$refs.editFormRef.validate(async (val) => {
                if (val) {
                    const { data: result } = await this.$http.post('/user/updateUser', this.editForm)
                    if (+result.code === 0) {
                        this.$message.success('修改用户成功')
                        this.editDialog = false
                        this.getUserList()
                    } else {
                        this.$message.error('修改用户失败')
                    }
                }
            })
        },
        async deleteUser(row) { // 编辑用户
            const res = await this.$confirm(
                '此操作将删除用户，是否继续?',
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            ).catch(err => err)

            if (res === 'confirm') {
                const { data: result } = await this.$http.post('/user/deleteUser', row)
                if (+result.code === 0) {
                    this.$message.success('删除用户成功')
                    this.getUserList()
                }
                else this.$message.error('删除用户失败')
            }
        },
        async submitRole () {
            const { data: result } = await this.$http.post('/user/allocateRole', this.roleForm)
            if (+result.code === 0) {
                this.$message.success('分配角色成功')
                this.roleDialog = false
                this.getUserList()
            }
            else this.$message.error('分配角色失败')
        },
        async getRoleList() {
            const { data: result } = await this.$http.get('/role/roleList')
            if (+result.code === 0) {
                this.roleList = result.data
            } else this.$message.error('获取角色列表失败')
        },
        async getCompanyList() {
            const { data: companyResult } = await this.$http.get('/company/queryCompany')
            const companyList = companyResult.data
            this.companyList = companyList.map(item => { return item.companyNum })
        },
        allocate (row) {
            this.roleDialog = true
            this.roleForm.userId = row.userId
            this.roleForm.username = row.username
            this.roleForm.roleName = row.roleName
        },
        handleSizeChange (newSize) {
            this.queryForm.size = newSize
            this.getUserList()
        },
        handleCurrentChange (newPage) {
            this.queryForm.page = newPage
            this.getUserList()
        },
        dialogClose (form) { // 关闭对话框
            this.$refs[`${form}Ref`].resetFields()
        },
    },
    created() {
        this.getUserList()
        this.getRoleList()
        this.getCompanyList()
    }
}
</script>

