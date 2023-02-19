<template>
	<!-- 此处放置el-tabs代码 -->
	<el-tabs v-model="activePath" type="card" closable v-if="openTab.length" @tab-click='tabClick' @tab-remove='tabRemove'>
		<el-tab-pane :key="item.name" v-for="item in openTab" :label="item.name" :name="item.path"></el-tab-pane>
	</el-tabs>
</template>

<script>
export default {
	name: 'tab',
	data() {
		return {}
	},
	components: {},
	created() {},
	methods: {
		// tab标签点击时，切换相应的路由
		tabClick(tab) {
			this.$router.push({ path: this.activePath })
		},

		// 移除tab标签
		tabRemove(targetPath){
			// 首页不删
			if(targetPath == '/firstPage') return
			this.$store.commit('delete_tabs', targetPath)

			if (this.activePath === targetPath) {
				// 设置当前激活的路由
				if (this.openTab && this.openTab.length >= 1) {
					this.$store.commit('set_active_tab', this.openTab[this.openTab.length-1].path)
					this.$router.push({ path: this.activePath })
				} else {
					this.$router.push({ path: '/' })
				}
			}
		}
	},
  	mounted () {
		this.$store.commit('set_openTab', [])
		// console.log('openTab：', this.$store.state.openTab)
		// this.$store.commit('delete_tabs', '/firstPage')
		this.$store.commit('add_tabs', { path: '/firstPage', name: '首页' })
		this.$store.commit('set_active_tab', '/firstPage')
		this.$router.push({ path: '/firstPage' })
  	},
	computed: {
		// openTab() {
		// 	return this.$store.state.openTab
		// },
		openTab: {
			get() {
				return this.$store.state.openTab
			},
			set(val) {
				this.$store.commit('set_openTab', val)
			}
		},
		activePath: {
			get() {
				return this.$store.state.activePath
			},
			set(val) {
				this.$store.commit('set_active_tab', val)
			}
		}
	},
  	watch:{
		'$route'(to,from){
			// 判断路由是否已经打开
			let flag = false
			for(let item of this.openTab){
				// 已经打开的 ，将其置为active
				if(item.name === to.name){
					this.$store.commit('set_active_tab', to.path)
					flag = true
					break
				}
			}

			// 未打开的，将其放入队列里
			if(!flag){
				this.$store.commit('add_tabs', { path: to.path, name: to.name })
				this.$store.commit('set_active_tab', to.path)
			}
		}
  	}
}
</script>

<style lang='less' scoped>
</style>
