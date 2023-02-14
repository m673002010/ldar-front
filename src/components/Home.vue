<template>
    <el-container class="home-container">
        <el-header>
            <div>
                <span>LDAR综合管理系统</span>
            </div>
            <div>
                <el-button @click="handleClick" type="primary">{{ shift ? '切换为后台管理' : '切换为数据面板' }}</el-button>
            </div>
            <div>
                用户:<span>{{ userInfo.username }}</span>
                <el-button type="info" @click="logout">退出</el-button>
            </div>
        </el-header>
        <dataPanel v-if="shift"></dataPanel>
        <backStage v-else :menuList="menuList"></backStage>
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
            activeName: "dp",
            shift: true
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
        async getUserInfo() {
            const { data: result } = await this.$http.get('/user/userInfo')
            if (+result.code === 0) {
                const userInfo = result.data
                this.menuList = userInfo.rightTree
                this.userInfo.username = userInfo.username
                this.userInfo.userId = userInfo.userId
            } else this.$message.error('获取用户信息失败')
        }
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
        background-color: #373d41;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #fff;
        font-size: 20px;
    }
</style>
