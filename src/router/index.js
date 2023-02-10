import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import DataPanel from '../components/DataPanel.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/permission/Rights.vue'
import Roles from '../components/permission/Roles.vue'

Vue.use(VueRouter)

const routes = [
    { path: '/', redirect: '/home' },
    { path: '/login', component: Login },
    { 
		path: '/home', 
		component: Home, 
		redirect: '/DataPanel',
		children: [
			{ path: '/DataPanel', component: DataPanel },
			{ path: '/users', component: Users },
			{ path: '/rights', component: Rights },
			{ path: '/roles', component: Roles }
		]
    },
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
	if (to.path === '/login') return next();
	const tokenStr = window.sessionStorage.getItem('token')
	if (!tokenStr) return next('/login')
	next()
})

export default router
