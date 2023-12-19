import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// 配置持久化操作vuex-persist
import VuexPersistence from 'vuex-persist'
 
// 创建对象配置持久化
const vuexLocal = new VuexPersistence({
    // 定义本地存储的方式，sessionStorage或localStorage
    storage: window.localStorage
})

export default new Vuex.Store({
    state: {
        openTab: [], // 所有打开的路由
        activePath: '', // 激活状态
        userInfo: {}
    },
    mutations: {
        // 添加tabs
        // data: { name: '首页', path: '/firstPage' }
        add_tabs(state, data) {
            this.state.openTab.push(data)
        },

        // 删除tabs
        // state.openTab: [{ name: '首页', path: '/firstpage' }]
        // path: /firstPage
        delete_tabs(state, path) {
            let i = 0
            for (let option of state.openTab) {
                if (option.path === path) {
                    break
                }
                i++
            }
            this.state.openTab.splice(i, 1)
        },

        // 设置当前激活的tab
        // path: '/role'
        set_active_tab(state, path) {
            this.state.activePath = path
        },

        set_openTab(state, val) {
            this.state.openTab = val
        },

        // 设置用户信息
        set_userInfo(state, data) {
            this.state.userInfo = data
        },

        // 删除用户信息
        delete_userInfo(state, data) {
            this.state.userInfo = {}
        },
    },
    actions: {},
    modules: {},
    getters: {
        // 获取用户信息
        get_userInfo(state) {
            return this.state.userInfo
        },
    },

    //配置插件支持
    plugins: [vuexLocal.plugin]
})

