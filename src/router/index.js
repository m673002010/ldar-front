import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import DataPanel from '../components/DataPanel.vue'
import BackStage from '../components/BackStage.vue'
import FirstPage from '../components/FirstPage.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/permission/Rights.vue'
import Roles from '../components/permission/Roles.vue'
import UploadComponentLedger from '../components/ledger/UploadComponentLedger.vue'
import UploadPictureLedger from '../components/ledger/UploadPictureLedger.vue'
import DeleteComponent from '../components/ledger/DeleteComponent.vue'
import DeviceManagement from '../components/ledger/DeviceManagement.vue'
import AreaManagement from '../components/ledger/AreaManagement.vue'
import EquipmentManagement from '../components/ledger/EquipmentManagement.vue'

Vue.use(VueRouter)

const routes = [
    { path: '/', redirect: '/home',  },
    { path: '/login', component: Login },
    { 
		path: '/home', 
		component: Home,
		name: '主页',
		children: [
			{ path: '/dataPanel', component: DataPanel, name: '数据面板' },
			{ path: '/backStage', component: BackStage, name: '后台管理' },
			{ path: '/firstPage', component: FirstPage, name: '首页' },
			{ path: '/users', component: Users, name: '用户列表' },
			{ path: '/rights', component: Rights, name: '权限列表' },
			{ path: '/roles', component: Roles, name: '角色列表' },
			{ path: '/uploadComponentLedger', component: UploadComponentLedger, name: '上传组件台账' },
			{ path: '/uploadPictureLedger', component: UploadPictureLedger, name: '上传图片台账' },
			{ path: '/deleteComponent', component: DeleteComponent, name: '组件删除' },
			{ path: '/deviceManagement', component: DeviceManagement, name: '装置管理' },
			{ path: '/areaManagement', component: AreaManagement, name: '区域管理' },
			{ path: '/equipmentManagement', component: EquipmentManagement, name: '设备管理' },
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
