<template>
    <el-container class="home-container">
        <el-header>
            <div>
                <span style="font-size: 30px; font-weight: 1000;">LDAR综合管理系统</span>
            </div>
            <div>
                <el-button @click="handleClick">{{ shift ? '切换为后台管理' : '切换为数据面板' }}</el-button>
            </div>
            <div>
                <el-button type="info" @click="showUserInfo"><i class="el-icon-user-solid"></i></el-button> | 
                <el-button type="info" @click="logout">退出</el-button>
            </div>
        </el-header>
        <dataPanel v-if="shift"></dataPanel>
        <backStage v-else :menuList="menuList"></backStage>

        <el-dialog
            title="编辑用户"
            :visible.sync="userDialog"
            width="30%" @close="dialogClose('userForm')">
            <el-form :model="userForm" :rules="userFormRules" ref="userFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="userForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="旧密码" prop="oldPassword">
                    <el-input v-model="userForm.oldPassword"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword">
                    <el-input v-model="userForm.newPassword"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="userDialog = false">取 消</el-button>
                <el-button type="primary" @click="userDialog = false">确 定</el-button>
            </span>
        </el-dialog>
    </el-container>
</template>

<script>
import dataPanel from './DataPanel.vue' // 数据面板
import backStage from './BackStage.vue' // 后台管理系统

export default {
    data() {
        return {
            menuList: [],
            isCollapse: true,
            userInfo: {
                username: '',
                userId: 0,
            },
            userForm: {
                username: '',
                oldPassword: '',
                newPassword: ''
            },
            userFormRules: {
                oldPassword: [ { required: true, message: '请输入旧密码' }],
                newPassword: [ { required: true, message: '请输入新密码' }]
            },
            activeName: "dp",
            shift: true,
            userDialog: false
        }
    },
    methods: {
        handleClick() {
            this.shift = !this.shift
        },
        logout() {
            window.sessionStorage.clear()
            this.$router.push('/login')
        },
        showUserInfo() {
            this.userDialog = true
            this.userForm.username = this.userInfo.username
        },
        async getUserInfo() {
            const { data: result } = await this.$http.get('/user/userInfo')
            if (+result.code === 0) {
                const userInfo = result.data
                this.menuList = userInfo.rightTree
                this.userInfo.username = userInfo.username
                this.userInfo.userId = userInfo.userId
            } else this.$message.error('获取用户信息失败')
        },
        dialogClose (form) { // 关闭对话框
            this.$refs[`${form}Ref`].resetFields()
        },
    },
    created() {
        this.getUserInfo()
    },
    components:{
        backStage,
        dataPanel
    }
}
</script>

<style lang="less" scoped>
    .home-container {
        height: 100%;
    }

    .el-header {
        background-color: #3F85ED;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #fff;
        font-size: 20px;
    }
</style>
