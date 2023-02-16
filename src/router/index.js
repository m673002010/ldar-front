import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import FirstPage from '../components/FirstPage.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/permission/Rights.vue'
import Roles from '../components/permission/Roles.vue'
import UploadComponentLedger from '../components/ledger/UploadComponentLedger.vue'

Vue.use(VueRouter)

const routes = [
    { path: '/', redirect: '/home',  },
    { path: '/login', component: Login },
    { 
		path: '/home', 
		component: Home,
		name: '主页',
		redirect: '/firstPage',
		children: [
			{ path: '/firstPage', component: FirstPage, name: '首页' },
			{ path: '/users', component: Users, name: '用户列表' },
			{ path: '/rights', component: Rights, name: '权限列表' },
			{ path: '/roles', component: Roles, name: '角色列表' },
			{ path: '/uploadComponentLedger', component: UploadComponentLedger, name: '上传组件台账' }
		]
    }
]

const router = new VueRouter({
  	routes
})

router.beforeEach((to, from, next) => {
	if (to.path === '/login') return next()
	const tokenStr = window.sessionStorage.getItem('token')
	if (!tokenStr) return next('/login')
	next()
})

export default router
