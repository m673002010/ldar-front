<template>
    <el-container class="home-container">
        <el-header>
            <div>
                <span>cms后台管理系统</span>
            </div>
            <div>
                用户:<span>{{ userInfo.username }}</span>
                <el-button type="info" @click="logout">退出</el-button>
            </div>
        </el-header>
        <el-container>
            <el-aside :width="isCollapse ? '64px' : '200px'">
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <el-menu background-color="#333744" text-color="#fff" active-text-color="#409bff" unique-opened
                :router="true" :default-active="$route.path" :collapse="isCollapse" :collapse-transition="false">
                    <!-- 一级菜单 -->
                    <el-submenu :index="item.rightId + ''" v-for="item in menuList" :key="item.rightId">
                        <template slot="title">
                            <i class="el-icon-menu"></i>
                            <span>{{item.authName}}</span>
                        </template>
                        <!-- 二级菜单 -->
                        <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.rightId">
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>{{subItem.authName}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    data() {
        return {
            menuList: [],
            isCollapse: false,
            userInfo: {
                username: '',
                userId: 0,
            }
        }
    },
    methods: {
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
        },
        toggleCollapse () {
            this.isCollapse = !this.isCollapse
        }
    },
    created() {
        this.getUserInfo()
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
    
    .el-aside {
        background-color: #333744;
        .el-menu {
            border-right: none;
        }
    }

    .el-main {
        background-color: #edeaf1;
    }

    .toggle-button {
        background-color: #4a5064;
        font-size: 10px;
        line-height: 24px;
        color:#fff;
        text-align: center;
        letter-spacing: 0.2em;
        cursor: pointer;
    }
</style>
