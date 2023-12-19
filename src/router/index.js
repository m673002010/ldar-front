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
import Companys from '../components/company/Companys.vue'

// 台账管理
import UploadComponentLedger from '../components/ledger/UploadComponentLedger.vue'
import UploadPictureLedger from '../components/ledger/UploadPictureLedger.vue'
import ComponentManagement from '../components/ledger/ComponentManagement.vue'
import DeviceManagement from '../components/ledger/DeviceManagement.vue'
import AreaManagement from '../components/ledger/AreaManagement.vue'
import EquipmentManagement from '../components/ledger/EquipmentManagement.vue'
import ComponentInfoLedger from '../components/ledger/ComponentInfoLedger.vue'
import ComponentPictureLedger from '../components/ledger/ComponentPictureLedger.vue'

// 检测管理
import RegulationManagement from '../components/detection/RegulationManagement.vue'
import Assignment from '../components/detection/Assignment.vue'
import Assign from '../components/detection/Assign.vue'
import AssignDetail from '../components/detection/AssignDetail.vue'
import DownloadDetectionTask from '../components/detection/DownloadDetectionTask.vue'
import UploadDetectionLedger from '../components/detection/UploadDetectionLedger.vue'
import UploadDetectionFile from '../components/detection/UploadDetectionFile.vue'
import DetectionDataLedger from '../components/detection/DetectionDataLedger.vue'
import LeakInfoLedger from '../components/detection/LeakInfoLedger.vue'

// 复测管理
import ExportRepairOrder from '../components/retest/ExportRepairOrder.vue'
import UploadRetestInfo from '../components/retest/UploadRetestInfo.vue'

// 报表统计
import ComponentTypeEmissionAnalysis from '../components/report/ComponentTypeEmissionAnalysis.vue'
import EmissionCalculationReport from '../components/report/EmissionCalculationReport.vue'
import HistoryDetectionStatistics from '../components/report/HistoryDetectionStatistics.vue'
import HistoryEmissionStatistics from '../components/report/HistoryEmissionStatistics.vue'
import InstrumentCalibrationRecord from '../components/report/InstrumentCalibrationRecord.vue'
import LeakInterval from '../components/report/LeakInterval.vue'

// 基础参数
import InstrumentManagement from '../components/param/InstrumentManagement.vue'
import StandardGasManagement from '../components/param/StandardGasManagement.vue'
import MeteorologyParam from '../components/param/MeteorologyParam.vue'
import MediumStatus from '../components/param/MediumStatus.vue'
import InstrumentDetectionStatistics from '../components/param/InstrumentDetectionStatistics.vue'
import ComponentType from '../components/param/ComponentType.vue'
import CalibrationManagement from '../components/param/CalibrationManagement.vue'
import CalculationType from '../components/param/CalculationType.vue'
import DeviceType from '../components/param/DeviceType.vue'
import FormulaManagement from '../components/param/FormulaManagement.vue'

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
			{ path: '/roles', component: Roles, name: '角色列表' },
			{ path: '/companys', component: Companys, name: '公司列表' },

			// 台账管理
			{ path: '/componentManagement', component: ComponentManagement, name: '组件管理' },
			{ path: '/uploadComponentLedger', component: UploadComponentLedger, name: '上传组件台账' },
			{ path: '/uploadPictureLedger', component: UploadPictureLedger, name: '上传图片台账' },
			{ path: '/deviceManagement', component: DeviceManagement, name: '装置管理' },
			{ path: '/areaManagement', component: AreaManagement, name: '区域管理' },
			{ path: '/equipmentManagement', component: EquipmentManagement, name: '设备管理' },

			// 检测管理
			{ path: '/regulationManagement', component: RegulationManagement, name: '法规管理' },
			{ path: '/assignment', component: Assignment, name: '分配任务' },
			{ path: '/assign', component: Assign, name: '分配' },
			{ path: '/assignDetail', component: AssignDetail, name: '分配详情' },
			{ path: '/downloadDetectionTask', component: DownloadDetectionTask, name: '下载检测任务' },
			{ path: '/uploadDetectionLedger', component: UploadDetectionLedger, name: '上传检测台账' },
			{ path: '/uploadDetectionFile', component: UploadDetectionFile, name: '上传检测文件' },

			// 复测管理
			{ path: '/exportRepairOrder', component: ExportRepairOrder, name: '导出维修工单' },
			{ path: '/uploadRetestInfo', component: UploadRetestInfo, name: '上传复测信息' },

			// 报表统计
			{ path: '/componentTypeEmissionAnalysis', component: ComponentTypeEmissionAnalysis, name: '组件类型排放分析' },
			{ path: '/componentInfoLedger', component: ComponentInfoLedger, name: '组件信息台账' },
			{ path: '/componentPictureLedger', component: ComponentPictureLedger, name: '组件图片台账' },
			{ path: '/detectionDataLedger', component: DetectionDataLedger, name: '检测数据台账' },
			{ path: '/emissionCalculationReport', component: EmissionCalculationReport, name: '排放量计算报告' },
			{ path: '/historyDetectionStatistics', component: HistoryDetectionStatistics, name: '历史检测统计' },
			{ path: '/historyEmissionStatistics', component: HistoryEmissionStatistics, name: '历史排放统计' },
			{ path: '/instrumentCalibrationRecord', component: InstrumentCalibrationRecord, name: '仪器校准记录单' },
			{ path: '/leakInfoLedger', component: LeakInfoLedger, name: '泄露信息台账' },
			{ path: '/leakInterval', component: LeakInterval, name: '泄露区间分析' },

			// 基础参数
			{ path: '/instrumentManagement', component: InstrumentManagement, name: '仪器管理' },
			{ path: '/standardGasManagement', component: StandardGasManagement, name: '标气管理' },
			{ path: '/meteorologyParam', component: MeteorologyParam, name: '气象参数' },
			{ path: '/mediumStatus', component: MediumStatus, name: '介质状态' },
			{ path: '/instrumentDetectionStatistics', component: InstrumentDetectionStatistics, name: '仪器检测统计' },
			{ path: '/componentType', component: ComponentType, name: '组件类型' },
			{ path: '/calibrationManagement', component: CalibrationManagement, name: '校准管理' },
			{ path: '/calculationType', component: CalculationType, name: '计算类型' },
			{ path: '/deviceType', component: DeviceType, name: '装置类型' },
			{ path: '/formulaManagement', component: FormulaManagement, name: '公式管理' }
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
