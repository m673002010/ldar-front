import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

// 导入全局样式
import './assets/css/global.css'

// axios
import axios from 'axios'
axios.defaults.baseURL = 'http://175.178.8.213:3002'
Vue.prototype.$http = axios

// vuex
import store from './store'

import qs from 'qs'

// axios拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    config.headers.Authorization = window.sessionStorage.getItem('token')
    config.headers['Content-Type'] = 'application/json;charset=utf-8'

    // if (config.method==='post')
    // {
    //   	config.data = qs.stringify(config.data)
    // }
    return config
}, function (error) {
	// 对请求错误做些什么
	return Promise.reject(error)
})

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
	// 对响应数据做点什么
	return response
}, function (error) {
	// 对响应错误做点什么
	return Promise.reject(error)
})

Vue.config.productionTip = false

new Vue({
	router,
    store,
	render: h => h(App)
}).$mount('#app')
