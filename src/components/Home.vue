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
                <el-form-item label="企业简称" prop="shortName">
                    <el-select v-model="userForm.companyNum" placeholder="请选择" clearable :disabled="!isAdmin" @change="selectedChange">
						<el-option
							v-for="(item, index) in companyList"
							:key="index"
							:label="item.companyNum"
							:value="item.companyNum">
						</el-option>
					</el-select>
                </el-form-item>
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="userForm.username" disabled></el-input>
                </el-form-item>
            </el-form>
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
            companyList: [],
            isCollapse: true,
            userInfo: {
                companyNum: '',
                shortName: '',
                username: '',
                userId: 0,
            },
            userForm: {
                companyNum: '',
                username: '',
            },
            userFormRules: {
                oldPassword: [ { required: true, message: '请输入旧密码' }],
                newPassword: [ { required: true, message: '请输入新密码' }]
            },
            activeName: "dp",
            shift: true,
            userDialog: false,
            isAdmin: 0,
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
            this.userForm.companyNum = this.userInfo.companyNum
            this.userForm.username = this.userInfo.username
        },
        async getUserInfo() {
            const { data: result } = await this.$http.get('/user/userInfo')
            if (+result.code === 0) {
                const userInfo = result.data
                this.menuList = userInfo.rightTree
                this.userInfo.username = userInfo.username
                this.userInfo.userId = userInfo.userId
                this.userInfo.companyNum = userInfo.companyNum
                this.userInfo.shortName = userInfo.shortName

                await this.getAdmin()

                // vuex设置用户信息
                this.$store.commit('set_userInfo', this.userInfo)
            } else this.$message.error('获取用户信息失败')
        },
        async getCompanyList() {
            const { data: companyResult } = await this.$http.get('/company/queryCompany')
            const companyList = companyResult.data
            this.companyList = companyList.map(item => { return { companyNum: item.companyNum, shortName: item.shortName } })
        },
        async getAdmin() {
			const { data: result } = await this.$http.get('/user/isAdmin')
			this.isAdmin = result.data
		},
        dialogClose (form) { // 关闭对话框
            this.$refs[`${form}Ref`].resetFields()
        },
        async selectedChange(value) {
            const item = this.companyList.find(cp => { return cp.companyNum === value })
            this.userDialog = false

            const { data: result } = await this.$http.post('/user/reToken', { companyNum: item.companyNum, shortName: item.shortName })
            if (+result.code === 0) {
                this.userForm.companyNum = item.companyNum
                window.sessionStorage.setItem('token', result.data.token)
                location.reload()
            } else {
                this.$message.error('切换公司失败')
            }

        }
    },
    created() {
        this.getCompanyList()
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
