<template>
    <el-container>
        <el-aside :width="isCollapse ? '64px' : '200px'">
            <div class="toggle-button" @click="toggleCollapse">|||</div>
            <el-menu background-color="#333744" text-color="#fff" active-text-color="#409bff" unique-opened
            :router="true" :default-active="$route.path" :collapse="isCollapse" :collapse-transition="false">
                <!-- 一级菜单 -->
                <el-submenu :index="item.rightId + ''" v-for="item in menuList" :key="item.rightId">
                    <template slot="title">
                        <span>{{item.authName}}</span>
                    </template>
                    <!-- 二级菜单 -->
                    <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.rightId">
                        <template slot="title">
                            <span>{{subItem.authName}}</span>
                        </template>
                    </el-menu-item>
                </el-submenu>
            </el-menu>
        </el-aside>
        <el-main>
            <tab></tab>
            <router-view></router-view>
        </el-main>
    </el-container>
</template>

<script>
import tab from './Tab.vue' // 选项卡

export default {
    name: "backStage",
    props:{
        menuList: {
            type: Array,
            default: []
        }
    },
    data() {
        return {
            isCollapse: false,
        }
    },
    methods: {
        toggleCollapse () {
            this.isCollapse = !this.isCollapse
        }
    },
    created() {},
    components:{
        tab
    }
}
</script>

<style lang="less" scoped>
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
